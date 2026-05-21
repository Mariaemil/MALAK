import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { AttendanceRecord, Student, Class, Profile } from '../types';

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('classes').select('*').order('day_of_week');
      if (error) throw error;
      return data as Class[];
    },
  });
}

export function useStudents(classId?: string) {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: async () => {
      let query = supabase.from('students').select('*');
      if (classId) {
        query = query.eq('class_id', classId);
      }
      const { data, error } = await query.order('full_name');
      if (error) throw error;
      return data as Student[];
    },
    enabled: !classId || classId !== undefined,
  });
}

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auth_users')
        .select('*')
        .eq('role', 'teacher')
        .order('full_name');
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useAttendanceRecords(dateRange?: { from: Date; to: Date }, studentId?: string) {
  return useQuery({
    queryKey: ['attendance', dateRange, studentId],
    queryFn: async () => {
      let query = supabase.from('attendance_records').select('*');

      if (dateRange) {
        const from = dateRange.from.toISOString().split('T')[0];
        const to = dateRange.to.toISOString().split('T')[0];
        query = query
          .gte('record_date', from)
          .lte('record_date', to);
      }

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
}

export function useAttendanceByDate(classId: string, recordDate: string) {
  return useQuery({
    queryKey: ['attendance', classId, recordDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('class_id', classId)
        .eq('record_date', recordDate);
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
}

export function useClassWithTeachers(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(
          `
          *,
          class_teachers(
            teacher_id,
            profiles(id, full_name)
          )
        `
        )
        .eq('id', classId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!classId,
  });
}

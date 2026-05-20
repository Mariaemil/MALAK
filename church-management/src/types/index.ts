export type UserRole = 'manager' | 'teacher';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  day_of_week: 'friday' | 'thursday' | 'sunday';
  created_at: string;
}

export interface ClassTeacher {
  id: string;
  class_id: string;
  teacher_id: string;
}

export interface Student {
  id: string;
  full_name: string;
  class_id: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  teacher_id: string;
  record_date: string;
  attended_shamosya: boolean;
  attended_mass: boolean;
  home_visit: boolean;
  created_at: string;
}

export interface StudentScore {
  student_id: string;
  student_name: string;
  class_id: string;
  class_name: string;
  shamosya_sessions: number;
  mass_sessions: number;
  home_visits: number;
  total_points: number;
  possible_points: number;
  percentage: number;
}

export interface AttendanceSummary {
  month: string;
  shamosya_count: number;
  mass_count: number;
  visit_count: number;
  total_days: number;
}

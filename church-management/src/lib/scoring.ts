import type { AttendanceRecord, StudentScore } from '../types';
import { isWithinInterval, parseISO } from 'date-fns';

export function calculateStudentScore(
  records: AttendanceRecord[],
  student: { id: string; full_name: string; class_id: string; class_name: string },
  dateRange?: { from: Date; to: Date }
): StudentScore {
  let filteredRecords = records.filter((r) => r.student_id === student.id);

  if (dateRange) {
    filteredRecords = filteredRecords.filter((r) =>
      isWithinInterval(parseISO(r.record_date), { start: dateRange.from, end: dateRange.to })
    );
  }

  const shamosyaSessions = filteredRecords.filter((r) => r.attended_shamosya).length;
  const massSessions = filteredRecords.filter((r) => r.attended_mass).length;
  const homeVisits = filteredRecords.filter((r) => r.home_visit).length;

  // Each shamosya = 0.5 points, each mass = 0.5 points
  const totalPoints = shamosyaSessions * 0.5 + massSessions * 0.5;

  // Max per month: 4 shamosya + 4 mass = 8 half-points = 4 full points
  // If date range is provided, calculate possible points based on the date range
  let possiblePoints = 4;
  if (dateRange) {
    // Count the number of months in the date range
    const startDate = dateRange.from;
    const endDate = dateRange.to;
    const monthCount = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    possiblePoints = Math.max(1, monthCount) * 4;
  }

  const percentage = possiblePoints > 0 ? (totalPoints / possiblePoints) * 100 : 0;

  return {
    student_id: student.id,
    student_name: student.full_name,
    class_id: student.class_id,
    class_name: student.class_name,
    shamosya_sessions: shamosyaSessions,
    mass_sessions: massSessions,
    home_visits: homeVisits,
    total_points: totalPoints,
    possible_points: possiblePoints,
    percentage: Math.round(percentage * 100) / 100,
  };
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 75) return '#10b981'; // green
  if (percentage >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

export function getScoreColorClass(percentage: number): string {
  if (percentage >= 75) return 'bg-green-500';
  if (percentage >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

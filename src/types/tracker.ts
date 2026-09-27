export type HabitPeriod = 'weekly' | 'daily';

export type HabitCategory = 'fitness' | 'productivity' | 'wellness' | 'mindset';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  weeklyTarget: number; // e.g. 6 for gym, 7 for water
  weight: number; // percentage, e.g. 14 for 14%
  isDailyHabit: boolean; // true if target is 7/week, false if target < 7/week
  description?: string;
  unit?: string;
  category: HabitCategory;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completedHabits: string[]; // array of habit IDs completed on this day
  notes?: string;
}

export interface ChallengeSettings {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  durationDays: number; // default 90
  streakThresholdPercent: number; // default 70%
  theme: 'dark' | 'midnight' | 'cyber';
}

export interface HabitAnalyticsItem {
  habit: Habit;
  completedTotal: number;
  targetTotal: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  completedThisWeek: number;
  weeklyTarget: number;
}

export interface WeeklyData {
  weekNumber: number;
  weekLabel: string;
  startDate: string;
  endDate: string;
  score: number;
  habitsCompleted: number;
  habitsRemaining: number;
  bestHabitId?: string;
  worstHabitId?: string;
  totalGym: number;
  totalRunning: number;
  totalStudy: number;
}

export interface TrackerStats {
  overallPercentage: number;
  todayPercentage: number;
  thisWeekPercentage: number;
  bestDay: { date: string; score: number } | null;
  worstDay: { date: string; score: number } | null;
  currentStreak: number;
  longestStreak: number;
  totalGymSessions: number;
  totalRunningSessions: number;
  totalStudySessions: number;
  avgDailyScore: number;
  avgWeeklyScore: number;
  dayNumber: number;
  daysRemaining: number;
  totalCompletedHabitLogs: number;
  totalMissedHabitLogs: number;
}

import { format, parseISO, differenceInCalendarDays, addDays, isWithinInterval, isBefore } from 'date-fns';
import type { Habit, DailyLog, ChallengeSettings, TrackerStats, WeeklyData } from '../types/tracker';

export function calculateDailyScore(habits: Habit[], completedHabitIds: string[]): number {
  if (!habits || habits.length === 0 || completedHabitIds.length === 0) {
    return 0;
  }

  let earnedScore = 0;
  let totalPossibleScore = 0;

  habits.forEach((habit) => {
    const dailyAllocation = habit.weight * (7 / habit.weeklyTarget);
    totalPossibleScore += dailyAllocation;

    if (completedHabitIds.includes(habit.id)) {
      earnedScore += dailyAllocation;
    }
  });

  if (totalPossibleScore === 0) return 0;
  
  const percentage = (earnedScore / totalPossibleScore) * 100;
  return Math.min(100, Math.round(percentage * 10) / 10);
}

export function calculateWeeklyScore(habits: Habit[], logsInWeek: DailyLog[]): number {
  if (!logsInWeek || logsInWeek.length === 0) return 0;
  let totalScore = 0;

  habits.forEach((habit) => {
    const completedCount = logsInWeek.filter((log) => log.completedHabits.includes(habit.id)).length;
    const habitScore = Math.min(completedCount / habit.weeklyTarget, 1.0) * habit.weight;
    totalScore += habitScore;
  });

  return Math.min(100, Math.round(totalScore * 10) / 10);
}

export function getLogsInRange(logs: Record<string, DailyLog>, startDateStr: string, endDateStr: string): DailyLog[] {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  return Object.values(logs).filter((log) => {
    try {
      const logDate = parseISO(log.date);
      return isWithinInterval(logDate, { start, end });
    } catch {
      return false;
    }
  });
}

export function calculateOverallStreaks(
  habits: Habit[],
  logs: Record<string, DailyLog>,
  startDateStr: string,
  endDateStr: string,
  thresholdPercent: number = 70
): { currentStreak: number; longestStreak: number } {
  if (Object.keys(logs).length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const today = parseISO(todayStr);

  if (isBefore(today, startDate)) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const effectiveEnd = today < endDate ? today : endDate;
  const totalDays = Math.max(0, differenceInCalendarDays(effectiveEnd, startDate) + 1);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = format(addDays(startDate, i), 'yyyy-MM-dd');
    const log = logs[d];
    const score = log ? calculateDailyScore(habits, log.completedHabits) : 0;

    if (score >= thresholdPercent) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  const todayScore = logs[todayStr] ? calculateDailyScore(habits, logs[todayStr].completedHabits) : 0;
  let cursorDate = today;

  if (todayScore < thresholdPercent) {
    cursorDate = addDays(cursorDate, -1);
  }

  while (cursorDate >= startDate) {
    const cursorStr = format(cursorDate, 'yyyy-MM-dd');
    const log = logs[cursorStr];
    const score = log ? calculateDailyScore(habits, log.completedHabits) : 0;

    if (score >= thresholdPercent) {
      currentStreak++;
      cursorDate = addDays(cursorDate, -1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

export function calculateHabitStreaks(
  habitId: string,
  logs: Record<string, DailyLog>,
  startDateStr: string,
  endDateStr: string
): { currentStreak: number; longestStreak: number } {
  if (Object.keys(logs).length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const today = parseISO(todayStr);

  if (isBefore(today, startDate)) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const effectiveEnd = today < endDate ? today : endDate;
  const totalDays = Math.max(0, differenceInCalendarDays(effectiveEnd, startDate) + 1);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = format(addDays(startDate, i), 'yyyy-MM-dd');
    const log = logs[d];
    const isCompleted = log && log.completedHabits.includes(habitId);

    if (isCompleted) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  let cursorDate = today;
  const todayCompleted = logs[todayStr] && logs[todayStr].completedHabits.includes(habitId);

  if (!todayCompleted) {
    cursorDate = addDays(cursorDate, -1);
  }

  while (cursorDate >= startDate) {
    const cursorStr = format(cursorDate, 'yyyy-MM-dd');
    const log = logs[cursorStr];

    if (log && log.completedHabits.includes(habitId)) {
      currentStreak++;
      cursorDate = addDays(cursorDate, -1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

export function computeWeeklyBreakdowns(
  habits: Habit[],
  logs: Record<string, DailyLog>,
  startDateStr: string,
  durationDays: number = 90
): WeeklyData[] {
  const startDate = parseISO(startDateStr);
  const totalWeeks = Math.ceil(durationDays / 7);
  const weeks: WeeklyData[] = [];

  for (let w = 0; w < totalWeeks; w++) {
    const wStart = addDays(startDate, w * 7);
    const wEnd = addDays(wStart, 6);
    const wStartStr = format(wStart, 'yyyy-MM-dd');
    const wEndStr = format(wEnd, 'yyyy-MM-dd');

    const weekLogs: DailyLog[] = [];
    for (let d = 0; d < 7; d++) {
      const curDateStr = format(addDays(wStart, d), 'yyyy-MM-dd');
      if (logs[curDateStr]) {
        weekLogs.push(logs[curDateStr]);
      }
    }

    const weekScore = calculateWeeklyScore(habits, weekLogs);

    let totalCompleted = 0;
    let gymCount = 0;
    let runningCount = 0;
    let studyCount = 0;

    const habitCounts: Record<string, number> = {};

    weekLogs.forEach((log) => {
      log.completedHabits.forEach((hId) => {
        totalCompleted++;
        habitCounts[hId] = (habitCounts[hId] || 0) + 1;
        if (hId === 'gym') gymCount++;
        if (hId === 'running') runningCount++;
        if (hId === 'study') studyCount++;
      });
    });

    let bestHabitId: string | undefined = undefined;
    let worstHabitId: string | undefined = undefined;
    let bestRatio = -1;
    let worstRatio = 999;

    habits.forEach((h) => {
      const count = habitCounts[h.id] || 0;
      const ratio = count / h.weeklyTarget;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestHabitId = h.id;
      }
      if (ratio < worstRatio) {
        worstRatio = ratio;
        worstHabitId = h.id;
      }
    });

    const totalWeeklyTargetCount = habits.reduce((acc, h) => acc + h.weeklyTarget, 0);

    weeks.push({
      weekNumber: w + 1,
      weekLabel: `Week ${w + 1}`,
      startDate: wStartStr,
      endDate: wEndStr,
      score: weekScore,
      habitsCompleted: totalCompleted,
      habitsRemaining: Math.max(0, totalWeeklyTargetCount - totalCompleted),
      bestHabitId,
      worstHabitId,
      totalGym: gymCount,
      totalRunning: runningCount,
      totalStudy: studyCount,
    });
  }

  return weeks;
}

export function computeTrackerStats(
  habits: Habit[],
  logs: Record<string, DailyLog>,
  settings: ChallengeSettings
): TrackerStats {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const startDate = parseISO(settings.startDate);
  const today = parseISO(todayStr);

  const isPreChallenge = isBefore(today, startDate);

  const dayNumber = isPreChallenge
    ? 0
    : Math.min(
        settings.durationDays,
        Math.max(1, differenceInCalendarDays(today, startDate) + 1)
      );

  const daysRemaining = isPreChallenge
    ? settings.durationDays
    : Math.max(0, settings.durationDays - dayNumber + 1);

  const todayLog = logs[todayStr];
  const todayPercentage = todayLog ? calculateDailyScore(habits, todayLog.completedHabits) : 0;

  const weeks = computeWeeklyBreakdowns(habits, logs, settings.startDate, settings.durationDays);
  const currentWeekIdx = isPreChallenge ? 0 : Math.min(weeks.length - 1, Math.floor((dayNumber - 1) / 7));
  const thisWeekPercentage = weeks[currentWeekIdx] ? weeks[currentWeekIdx].score : 0;

  const elapsedWeeks = isPreChallenge ? [] : weeks.slice(0, currentWeekIdx + 1);
  const overallPercentage = elapsedWeeks.length > 0
    ? Math.round(elapsedWeeks.reduce((acc, w) => acc + w.score, 0) / elapsedWeeks.length * 10) / 10
    : 0;

  let bestDay: { date: string; score: number } | null = null;
  let worstDay: { date: string; score: number } | null = null;
  let totalDailyScoreSum = 0;
  let loggedDaysCount = 0;
  let totalGymSessions = 0;
  let totalRunningSessions = 0;
  let totalStudySessions = 0;
  let totalCompletedHabitLogs = 0;

  const totalPossibleHabitLogs = habits.length * (dayNumber || 1);

  if (!isPreChallenge) {
    for (let i = 0; i < dayNumber; i++) {
      const curDateStr = format(addDays(startDate, i), 'yyyy-MM-dd');
      const log = logs[curDateStr];
      if (log) {
        loggedDaysCount++;
        const score = calculateDailyScore(habits, log.completedHabits);
        totalDailyScoreSum += score;

        if (!bestDay || score > bestDay.score) {
          bestDay = { date: curDateStr, score };
        }
        if (!worstDay || score < worstDay.score) {
          worstDay = { date: curDateStr, score };
        }

        totalCompletedHabitLogs += log.completedHabits.length;
        if (log.completedHabits.includes('gym')) totalGymSessions++;
        if (log.completedHabits.includes('running')) totalRunningSessions++;
        if (log.completedHabits.includes('study')) totalStudySessions++;
      }
    }
  }

  const avgDailyScore = loggedDaysCount > 0
    ? Math.round((totalDailyScoreSum / loggedDaysCount) * 10) / 10
    : 0;

  const avgWeeklyScore = elapsedWeeks.length > 0
    ? Math.round((elapsedWeeks.reduce((acc, w) => acc + w.score, 0) / elapsedWeeks.length) * 10) / 10
    : 0;

  const streaks = calculateOverallStreaks(
    habits,
    logs,
    settings.startDate,
    settings.endDate,
    settings.streakThresholdPercent
  );

  return {
    overallPercentage,
    todayPercentage,
    thisWeekPercentage,
    bestDay,
    worstDay,
    currentStreak: streaks.currentStreak,
    longestStreak: streaks.longestStreak,
    totalGymSessions,
    totalRunningSessions,
    totalStudySessions,
    avgDailyScore,
    avgWeeklyScore,
    dayNumber,
    daysRemaining,
    totalCompletedHabitLogs,
    totalMissedHabitLogs: isPreChallenge ? 0 : Math.max(0, totalPossibleHabitLogs - totalCompletedHabitLogs),
  };
}

export function getScoreColor(score: number, hasLog: boolean): { bg: string; border: string; text: string } {
  if (!hasLog) {
    return { bg: 'bg-slate-800/50', border: 'border-slate-700/50', text: 'text-slate-500' };
  }
  if (score >= 90) {
    return { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-950 font-bold' };
  }
  if (score >= 80) {
    return { bg: 'bg-emerald-600/90', border: 'border-emerald-500', text: 'text-white font-semibold' };
  }
  if (score >= 60) {
    return { bg: 'bg-amber-500/80', border: 'border-amber-400', text: 'text-amber-950 font-semibold' };
  }
  return { bg: 'bg-rose-500/80', border: 'border-rose-400', text: 'text-white' };
}

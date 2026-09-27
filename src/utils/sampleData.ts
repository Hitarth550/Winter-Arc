import { format, subDays } from 'date-fns';
import type { DailyLog } from '../types/tracker';
import { INITIAL_HABITS } from '../constants/habits';

export function generateSampleLogs(_startDateStr?: string, pastDays: number = 14): Record<string, DailyLog> {
  const habits = INITIAL_HABITS;
  const logs: Record<string, DailyLog> = {};
  const today = new Date();

  for (let i = pastDays; i >= 0; i--) {
    const curDate = subDays(today, i);
    const curDateStr = format(curDate, 'yyyy-MM-dd');

    const completedHabits: string[] = [];

    habits.forEach((habit) => {
      if (habit.id === 'running') {
        if (i % 2 === 0 && completedHabits.filter((id) => id === 'running').length < 3) {
          completedHabits.push(habit.id);
        }
      } else if (habit.id === 'gym') {
        if (i % 7 !== 0) {
          completedHabits.push(habit.id);
        }
      } else {
        const chance = habit.weight >= 10 ? 0.85 : 0.75;
        if (Math.random() < chance) {
          completedHabits.push(habit.id);
        }
      }
    });

    logs[curDateStr] = {
      date: curDateStr,
      completedHabits,
      notes: i === 0 ? 'Feeling energized today! Pushed hard on gym.' : undefined,
    };
  }

  return logs;
}

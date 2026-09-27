import React from 'react';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from 'date-fns';
import { CheckCircle2, Circle, Clock, Dumbbell } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import type { Habit } from '../../types/tracker';

export const TodayHabits: React.FC = () => {
  const { habits, logs, todayLog, toggleHabitToday } = useTracker();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const getWeeklyCompletedCount = (habitId: string): number => {
    return Object.values(logs).filter((log) => {
      try {
        const logDate = parseISO(log.date);
        return isWithinInterval(logDate, { start: weekStart, end: weekEnd }) && log.completedHabits.includes(habitId);
      } catch {
        return false;
      }
    }).length;
  };

  const dailyHabits = habits.filter((h) => h.isDailyHabit);
  const weeklyTargetHabits = habits.filter((h) => !h.isDailyHabit);

  const renderHabitCard = (habit: Habit) => {
    const isCompletedToday = todayLog.completedHabits.includes(habit.id);
    const weeklyCount = getWeeklyCompletedCount(habit.id);
    const weeklyTarget = habit.weeklyTarget;
    const isTargetMetThisWeek = weeklyCount >= weeklyTarget;

    return (
      <div
        key={habit.id}
        onClick={() => toggleHabitToday(habit.id)}
        className={`group relative py-2.5 px-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
          isCompletedToday
            ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900/90 border-emerald-500/40 shadow-sm shadow-emerald-950/30'
            : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
                {habit.icon}
              </div>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1 py-0 rounded-full bg-slate-950 text-cyan-400 border border-cyan-500/30 leading-none">
                {habit.weight}%
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h3 className={`font-bold text-xs sm:text-sm truncate ${isCompletedToday ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-slate-100'}`}>
                  {habit.name}
                </h3>
              </div>
              
              <div className="flex items-center space-x-1.5 mt-0.5">
                {habit.isDailyHabit ? (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Daily Habit (7 days/wk)
                  </span>
                ) : (
                  <div className="flex items-center space-x-1">
                    <span className={`text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.2 rounded ${
                      isTargetMetThisWeek
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {weeklyCount} / {weeklyTarget} this week
                    </span>
                    {isTargetMetThisWeek && (
                      <span className="text-[9px] font-bold text-emerald-400">✓ Met</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            <button
              type="button"
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                isCompletedToday
                  ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30 scale-105'
                  : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
              }`}
            >
              {isCompletedToday ? (
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Circle className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>

        {!habit.isDailyHabit && (
          <div className="mt-2 w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                isTargetMetThisWeek ? 'bg-emerald-400' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(100, (weeklyCount / weeklyTarget) * 100)}%` }}
            ></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Today's Progress Checklist
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any card to toggle completion for today ({todayLog.completedHabits.length} / {habits.length} done)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-3 h-3 text-cyan-400" />
              Weekly Target Habits ({weeklyTargetHabits.length})
            </h3>
            <span className="text-[10px] text-slate-400">Flexibility on Rest Days</span>
          </div>
          <div className="space-y-2">
            {weeklyTargetHabits.map(renderHabitCard)}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-emerald-400" />
              Daily Non-Negotiable Habits ({dailyHabits.length})
            </h3>
            <span className="text-[10px] text-slate-400">7 Days / Week</span>
          </div>
          <div className="space-y-2">
            {dailyHabits.map(renderHabitCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

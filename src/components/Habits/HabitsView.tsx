import React, { useState, useMemo } from 'react';
import { format, parseISO, subDays } from 'date-fns';
import { Flame, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTracker } from '../../context/TrackerContext';
import type { Habit, HabitAnalyticsItem } from '../../types/tracker';
import { calculateHabitStreaks } from '../../utils/calculations';

export const HabitsView: React.FC = () => {
  const { habits, logs, settings } = useTracker();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const habitAnalytics: HabitAnalyticsItem[] = useMemo(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const startDate = parseISO(settings.startDate);
    const today = parseISO(todayStr);

    const elapsedDays = Math.max(1, Math.min(settings.durationDays, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1));

    return habits.map((habit) => {
      let completedTotal = 0;

      Object.values(logs).forEach((log) => {
        if (log.completedHabits.includes(habit.id)) {
          completedTotal++;
        }
      });

      const elapsedWeeks = Math.max(1, Math.ceil(elapsedDays / 7));
      const targetTotal = habit.weeklyTarget * elapsedWeeks;

      const completionPercentage = targetTotal > 0
        ? Math.min(100, Math.round((completedTotal / targetTotal) * 100))
        : 0;

      const streaks = calculateHabitStreaks(habit.id, logs, settings.startDate, settings.endDate);

      return {
        habit,
        completedTotal,
        targetTotal,
        completionPercentage,
        currentStreak: streaks.currentStreak,
        longestStreak: streaks.longestStreak,
        completedThisWeek: 0,
        weeklyTarget: habit.weeklyTarget,
      };
    });
  }, [habits, logs, settings]);

  const habitHistoryData = useMemo(() => {
    if (!selectedHabit) return [];
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const curDate = subDays(today, i);
      const curStr = format(curDate, 'yyyy-MM-dd');
      const log = logs[curStr];
      const isCompleted = log ? log.completedHabits.includes(selectedHabit.id) : false;

      data.push({
        date: curStr,
        displayDate: format(curDate, 'MMM d'),
        completed: isCompleted ? 1 : 0,
      });
    }
    return data;
  }, [selectedHabit, logs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Habit Analytics & Streaks</h2>
        <p className="text-sm text-slate-400 mt-1">
          Detailed performance metrics, target completion ratios, and consistency streaks for each habit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habitAnalytics.map(({ habit, completedTotal, targetTotal, completionPercentage, currentStreak, longestStreak }) => {
          return (
            <div
              key={habit.id}
              onClick={() => setSelectedHabit(habit)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-200 cursor-pointer group hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                      {habit.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      Weight: <strong className="text-cyan-400">{habit.weight}%</strong> • Target: {habit.weeklyTarget}/wk
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {completionPercentage}%
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold text-slate-200">{completedTotal} / {targetTotal} sessions</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      completionPercentage >= 80 ? 'bg-emerald-500' : completionPercentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, completionPercentage)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>🔥 {currentStreak}-day streak</span>
                </div>
                <div className="text-slate-400">
                  Longest: <strong className="text-slate-200">{longestStreak} days</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedHabit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl p-2 bg-slate-800 rounded-2xl">{selectedHabit.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedHabit.name}</h3>
                <p className="text-xs text-slate-400">
                  Weight: {selectedHabit.weight}% | Weekly Target: {selectedHabit.weeklyTarget} sessions
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              {selectedHabit.description || 'Track your daily adherence and view your 30-day performance history.'}
            </p>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Past 30 Days Adherence</h4>
            <div className="h-44 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="displayDate" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => (v === 1 ? 'Done' : 'Missed')} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedHabit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

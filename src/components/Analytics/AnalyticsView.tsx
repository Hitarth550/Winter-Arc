import React from 'react';
import { format, parseISO } from 'date-fns';
import { Trophy, Flame, Award } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const AnalyticsView: React.FC = () => {
  const { stats } = useTracker();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Master Analytics & Volume Statistics</h2>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive summary metrics, total activity volume, best performance days, and overall consistency stats.
        </p>
      </div>

      {/* Primary Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Overall Arc Progress</span>
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{stats.overallPercentage}%</div>
          <p className="text-xs text-slate-400 mt-2">Cumulative challenge completion score</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Average Daily Score</span>
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400">{stats.avgDailyScore}%</div>
          <p className="text-xs text-slate-400 mt-2">Average weighted score across logged days</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Current Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{stats.currentStreak} days</div>
          <p className="text-xs text-slate-400 mt-2">Best streak: <strong className="text-slate-200">{stats.longestStreak} days</strong></p>
        </div>
      </div>

      {/* Activity Volume Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Total Workout & Session Volume</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Gym Sessions</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{stats.totalGymSessions}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              🏋️
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Running Sessions</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.totalRunningSessions}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              🏃
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Total Study Sessions</span>
              <div className="text-2xl font-extrabold text-blue-400 mt-1">{stats.totalStudySessions}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              📚
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Performance Statistics */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Performance Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Best Day Performance</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">
              {stats.bestDay ? `${stats.bestDay.score}%` : 'N/A'}
            </div>
            {stats.bestDay && (
              <div className="text-[10px] text-slate-400 mt-0.5">{format(parseISO(stats.bestDay.date), 'MMM d, yyyy')}</div>
            )}
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Lowest Score Day</span>
            <div className="text-xl font-extrabold text-rose-400 mt-1">
              {stats.worstDay ? `${stats.worstDay.score}%` : 'N/A'}
            </div>
            {stats.worstDay && (
              <div className="text-[10px] text-slate-400 mt-0.5">{format(parseISO(stats.worstDay.date), 'MMM d, yyyy')}</div>
            )}
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Completed Habit Logs</span>
            <div className="text-xl font-extrabold text-teal-400 mt-1">{stats.totalCompletedHabitLogs}</div>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Longest Streak</span>
            <div className="text-xl font-extrabold text-amber-400 mt-1">{stats.longestStreak} days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

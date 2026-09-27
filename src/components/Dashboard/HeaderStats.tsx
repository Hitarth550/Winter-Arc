import React from 'react';
import { parseISO, isBefore, differenceInCalendarDays } from 'date-fns';
import { Flame, Trophy, Calendar, Rocket } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const HeaderStats: React.FC = () => {
  const { stats, settings } = useTracker();
  const today = new Date();
  const startDate = parseISO(settings.startDate);
  const isPreChallenge = isBefore(today, startDate);
  const daysUntilStart = isPreChallenge ? Math.max(1, differenceInCalendarDays(startDate, today)) : 0;

  return (
    <div className="mb-6">
      {/* Pre-challenge Countdown Banner */}
      {isPreChallenge && (
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Rocket className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Winter Arc Challenge Starts October 1, 2026</h3>
              <p className="text-xs text-slate-400">
                All metrics start fresh on October 1. Lock in your routine and prepare for Day 1!
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block bg-cyan-500/20 text-cyan-300 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-cyan-500/40">
            Starts in {daysUntilStart} {daysUntilStart === 1 ? 'day' : 'days'}
          </span>
        </div>
      )}

      {/* Reorganized 3-Card Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Overall Completion */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Arc</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">{stats.overallPercentage}%</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, stats.overallPercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Current & Best Streak */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-amber-400">{stats.currentStreak}</span>
            <span className="text-xs font-semibold text-amber-400/80">days</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Best Streak: <strong className="text-slate-200">{stats.longestStreak} days</strong></p>
        </div>

        {/* 3. Challenge Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Challenge Progress</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-indigo-400">
              {isPreChallenge ? 'Day 0' : `Day ${stats.dayNumber}`}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {settings.durationDays}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {isPreChallenge ? 'Starts Oct 1, 2026' : `${stats.daysRemaining} days remaining`}
          </p>
        </div>
      </div>
    </div>
  );
};

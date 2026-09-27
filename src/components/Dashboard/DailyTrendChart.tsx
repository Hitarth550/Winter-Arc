import React, { useState, useMemo } from 'react';
import { format, parseISO, addDays, isAfter } from 'date-fns';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { calculateDailyScore } from '../../utils/calculations';

type RangeOption = '7d' | '30d' | '90d' | 'custom';

export const DailyTrendChart: React.FC = () => {
  const { habits, logs, settings } = useTracker();
  const [range, setRange] = useState<RangeOption>('30d');
  
  const [customStart, setCustomStart] = useState<string>(settings.startDate);
  const [customEnd, setCustomEnd] = useState<string>(settings.endDate);

  const chartData = useMemo(() => {
    let startDate: Date;
    let endDate = parseISO(settings.endDate);

    if (range === '7d') {
      startDate = parseISO(settings.startDate);
      endDate = addDays(startDate, 6);
    } else if (range === '30d') {
      startDate = parseISO(settings.startDate);
      endDate = addDays(startDate, 29);
    } else if (range === '90d') {
      startDate = parseISO(settings.startDate);
      endDate = parseISO(settings.endDate);
    } else {
      startDate = parseISO(customStart);
      endDate = parseISO(customEnd);
    }

    const data = [];
    let cur = startDate;

    while (!isAfter(cur, endDate)) {
      const curStr = format(cur, 'yyyy-MM-dd');
      const log = logs[curStr];
      const completedIds = log ? log.completedHabits : [];
      const score = calculateDailyScore(habits, completedIds);

      data.push({
        date: curStr,
        displayDate: format(cur, 'MMM d'),
        fullDate: format(cur, 'EEEE, MMM d, yyyy'),
        score,
        completedCount: completedIds.length,
        totalHabits: habits.length,
      });

      cur = addDays(cur, 1);
    }

    return data;
  }, [range, customStart, customEnd, logs, habits, settings]);

  const hasLogs = useMemo(() => {
    return Object.keys(logs).length > 0;
  }, [logs]);

  const periodAvg = useMemo(() => {
    if (chartData.length === 0) return 0;
    const sum = chartData.reduce((acc, d) => acc + d.score, 0);
    return Math.round((sum / chartData.length) * 10) / 10;
  }, [chartData]);

  const trendPercentage = useMemo(() => {
    if (chartData.length < 2) return 0;
    const mid = Math.floor(chartData.length / 2);
    const firstHalfAvg = chartData.slice(0, mid).reduce((acc, d) => acc + d.score, 0) / (mid || 1);
    const secondHalfAvg = chartData.slice(mid).reduce((acc, d) => acc + d.score, 0) / (chartData.length - mid || 1);
    return Math.round((secondHalfAvg - firstHalfAvg) * 10) / 10;
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400">{data.fullDate}</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-extrabold text-emerald-400">{data.score}%</span>
            <span className="text-xs text-slate-300">Daily Score</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {data.completedCount} of {data.totalHabits} habits completed
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 mb-8 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Daily Score Trend
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-xs text-slate-400">
              Period Average: <strong className="text-emerald-400 font-bold">{periodAvg}%</strong>
            </span>
            <span className={`text-xs font-semibold flex items-center gap-1 ${
              trendPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {trendPercentage >= 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5" /> +{trendPercentage}% trend
                </>
              ) : (
                <>
                  <TrendingDown className="w-3.5 h-3.5" /> {trendPercentage}% trend
                </>
              )}
            </span>
          </div>
        </div>

        {/* Range Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {(['7d', '30d', '90d', 'custom'] as RangeOption[]).map((opt) => (
              <button
                key={opt}
                onClick={() => setRange(opt)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
                  range === opt
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="flex items-center space-x-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>
      </div>

      {!hasLogs && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-xs font-semibold text-slate-300">No progress logged yet.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Your graph will update automatically as you complete habits starting Day 1 (October 1, 2026).
          </p>
        </div>
      )}

      {/* Recharts Area Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGradient)"
              activeDot={{ r: 6, fill: '#34d399', stroke: '#064e3b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

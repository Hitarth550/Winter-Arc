import React, { useState, useMemo } from 'react';
import { format, parseISO, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Flame, CheckCircle, XCircle, Edit3, Save, RotateCcw } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { calculateDailyScore, getScoreColor } from '../../utils/calculations';

export const CalendarView: React.FC = () => {
  const { habits, logs, settings, stats, toggleHabitForDate, updateNotesForDate, resetDay } = useTracker();
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [editingNotes, setEditingNotes] = useState<string>('');

  const heatmapDays = useMemo(() => {
    const start = parseISO(settings.startDate);
    const totalDays = settings.durationDays || 90;
    const days = [];

    for (let i = 0; i < totalDays; i++) {
      const curDate = addDays(start, i);
      const curStr = format(curDate, 'yyyy-MM-dd');
      const log = logs[curStr];
      const hasLog = !!log;
      const score = log ? calculateDailyScore(habits, log.completedHabits) : 0;

      days.push({
        dayIndex: i + 1,
        date: curStr,
        displayDate: format(curDate, 'MMM d'),
        fullDate: format(curDate, 'EEEE, MMMM d, yyyy'),
        score,
        hasLog,
        notes: log?.notes || '',
      });
    }
    return days;
  }, [settings, logs, habits]);

  const selectedLog = selectedDate ? logs[selectedDate] : null;
  const selectedScore = selectedDate
    ? calculateDailyScore(habits, selectedLog?.completedHabits || [])
    : 0;

  const handleOpenDateModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingNotes(logs[dateStr]?.notes || '');
  };

  const handleSaveNotes = () => {
    if (selectedDate) {
      updateNotesForDate(selectedDate, editingNotes);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">90-Day Winter Arc Progress</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                Day {stats.dayNumber} / 90
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Visual contribution heatmap showing your daily score performance over the entire challenge.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-slate-400">Overall Arc Completion</span>
              <div className="text-2xl font-extrabold text-emerald-400">{stats.overallPercentage}%</div>
            </div>
            <div className="h-10 w-[1px] bg-slate-800"></div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Current Streak</span>
              <div className="text-2xl font-extrabold text-amber-400 flex items-center gap-1 justify-end">
                <Flame className="w-5 h-5 fill-amber-500" /> {stats.currentStreak}d
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-3 text-slate-400">
            <span className="font-semibold">Performance Legend:</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500"></span> 90–100%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-600"></span> 80–89%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500"></span> 60–79%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-500"></span> &lt;60%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-800"></span> No Data</span>
          </div>

          <div className="text-slate-400">
            Click any cell to edit historical progress
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 mb-8">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-400" />
          90-Day Contribution Heatmap Grid
        </h3>

        <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2 sm:gap-3">
          {heatmapDays.map((item) => {
            const { bg, border, text } = getScoreColor(item.score, item.hasLog);
            const isToday = item.date === todayStr;
            const isSelected = item.date === selectedDate;

            return (
              <button
                key={item.date}
                onClick={() => handleOpenDateModal(item.date)}
                className={`heatmap-cell relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${bg} ${border} ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 z-20' : ''
                } ${isToday ? 'ring-1 ring-cyan-400' : ''}`}
              >
                <span className="text-[10px] opacity-80 leading-none">D{item.dayIndex}</span>
                <span className={`text-xs font-bold mt-1 ${text}`}>
                  {item.hasLog ? `${item.score}%` : '-'}
                </span>
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-extrabold text-white">
                  {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
                </h3>
                {selectedDate === todayStr && (
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">Review and modify habit completions for this date.</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-xs text-slate-400">Daily Score</span>
                <div className="text-2xl font-extrabold text-emerald-400">{selectedScore}%</div>
              </div>

              <button
                onClick={() => resetDay(selectedDate)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Date</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Habits Completion for {format(parseISO(selectedDate), 'MMM d')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {habits.map((habit) => {
                const isDone = selectedLog?.completedHabits.includes(habit.id) || false;
                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitForDate(selectedDate, habit.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{habit.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-slate-200">{habit.name}</span>
                        <span className="block text-[10px] text-slate-400">{habit.weight}% weight</span>
                      </div>
                    </div>

                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Daily Notes & Reflection
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Add daily wins, workout details, energy levels, or notes..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

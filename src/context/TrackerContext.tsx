import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import confetti from 'canvas-confetti';
import type { Habit, DailyLog, ChallengeSettings, TrackerStats } from '../types/tracker';
import { INITIAL_HABITS } from '../constants/habits';
import { computeTrackerStats, calculateDailyScore } from '../utils/calculations';
import { generateSampleLogs } from '../utils/sampleData';

interface TrackerContextType {
  habits: Habit[];
  logs: Record<string, DailyLog>;
  settings: ChallengeSettings;
  stats: TrackerStats;
  todayLog: DailyLog;
  toggleHabitToday: (habitId: string) => void;
  toggleHabitForDate: (dateStr: string, habitId: string) => void;
  updateNotesForDate: (dateStr: string, notes: string) => void;
  resetDay: (dateStr: string) => void;
  resetChallenge: () => void;
  loadSampleData: () => void;
  updateSettings: (newSettings: Partial<ChallengeSettings>) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
}

const STORAGE_KEY_LOGS = 'winter_arc_tracker_logs_v2';
const STORAGE_KEY_SETTINGS = 'winter_arc_tracker_settings_v2';

const defaultSettings: ChallengeSettings = {
  startDate: '2026-10-01',
  endDate: '2026-12-29', // 90 days starting Oct 1, 2026
  durationDays: 90,
  streakThresholdPercent: 70,
  theme: 'dark',
};

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits] = useState<Habit[]>(INITIAL_HABITS);

  // Initialize clean settings
  const [settings, setSettings] = useState<ChallengeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return defaultSettings;
  });

  // Initialize clean zero-logs object
  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load logs from localStorage', e);
    }
    return {}; // Fresh start: ZERO fake data
  });

  // Persist logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save logs to localStorage', e);
    }
  }, [logs]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayLog = logs[todayStr] || { date: todayStr, completedHabits: [] };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (e) {
      // ignore
    }
  };

  const toggleHabitForDate = (dateStr: string, habitId: string) => {
    setLogs((prev) => {
      const currentLog = prev[dateStr] || { date: dateStr, completedHabits: [] };
      const isCompleted = currentLog.completedHabits.includes(habitId);

      const updatedCompleted = isCompleted
        ? currentLog.completedHabits.filter((id) => id !== habitId)
        : [...currentLog.completedHabits, habitId];

      const newLog: DailyLog = {
        ...currentLog,
        completedHabits: updatedCompleted,
      };

      if (!isCompleted && dateStr === todayStr) {
        const score = calculateDailyScore(habits, updatedCompleted);
        if (score >= 90) {
          triggerCelebration();
        }
      }

      return {
        ...prev,
        [dateStr]: newLog,
      };
    });
  };

  const toggleHabitToday = (habitId: string) => {
    toggleHabitForDate(todayStr, habitId);
  };

  const updateNotesForDate = (dateStr: string, notes: string) => {
    setLogs((prev) => {
      const currentLog = prev[dateStr] || { date: dateStr, completedHabits: [] };
      return {
        ...prev,
        [dateStr]: {
          ...currentLog,
          notes,
        },
      };
    });
  };

  const resetDay = (dateStr: string) => {
    setLogs((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
  };

  const resetChallenge = () => {
    if (window.confirm('Are you sure you want to reset all challenge data? This cannot be undone.')) {
      setLogs({});
      const freshSettings: ChallengeSettings = {
        startDate: '2026-10-01',
        endDate: '2026-12-29',
        durationDays: 90,
        streakThresholdPercent: 70,
        theme: 'dark',
      };
      setSettings(freshSettings);
      localStorage.removeItem(STORAGE_KEY_LOGS);
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(freshSettings));
    }
  };

  const loadSampleData = () => {
    const freshLogs = generateSampleLogs(settings.startDate, 14);
    setLogs(freshLogs);
  };

  const updateSettings = (newSettings: Partial<ChallengeSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.startDate || newSettings.durationDays) {
        const start = parseISOStr(updated.startDate);
        const duration = updated.durationDays || 90;
        updated.endDate = format(addDays(start, duration - 1), 'yyyy-MM-dd');
      }
      return updated;
    });
  };

  const exportData = () => {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      settings,
      logs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winter-arc-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.logs) {
        setLogs(parsed.logs);
        if (parsed.settings) {
          setSettings(parsed.settings);
        }
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import file', e);
    }
    return false;
  };

  const stats = computeTrackerStats(habits, logs, settings);

  return (
    <TrackerContext.Provider
      value={{
        habits,
        logs,
        settings,
        stats,
        todayLog,
        toggleHabitToday,
        toggleHabitForDate,
        updateNotesForDate,
        resetDay,
        resetChallenge,
        loadSampleData,
        updateSettings,
        exportData,
        importData,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};

function parseISOStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

import React, { useState, useRef } from 'react';
import { Download, Upload, RotateCcw, Sparkles, Shield, Sliders, Calendar } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetChallenge,
    loadSampleData,
  } = useTracker();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importData(content);
        if (success) {
          setImportStatus('Data imported successfully!');
        } else {
          setImportStatus('Failed to import file. Please check file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Challenge Settings & Backup</h2>
        <p className="text-sm text-slate-400 mt-1">
          Customize start date, streak parameters, backup JSON data, or reset progress.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. CHALLENGE DATES CONFIGURATION */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Winter Arc Challenge Dates
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Start Date</label>
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => updateSettings({ startDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Days)</label>
              <input
                type="number"
                value={settings.durationDays}
                onChange={(e) => updateSettings({ durationDays: parseInt(e.target.value) || 90 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">End Date (Auto)</label>
              <input
                type="date"
                value={settings.endDate}
                disabled
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 2. STREAK THRESHOLD PARAMETERS */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Streak Threshold
          </h3>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Minimum Daily Score % to count towards Streak
              </label>
              <span className="text-xs font-extrabold text-amber-400">{settings.streakThresholdPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={settings.streakThresholdPercent}
              onChange={(e) => updateSettings({ streakThresholdPercent: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              A streak rewards consistency without requiring 100% daily perfection.
            </p>
          </div>
        </div>

        {/* 3. DATA BACKUP & RESTORE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Data Persistence & Backup
          </h3>

          <p className="text-xs text-slate-400 mb-4">
            Your data is stored locally in your browser. You can export a JSON backup file to keep your progress safe or transfer it to another device.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportData}
              className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Progress JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import Progress JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={loadSampleData}
              className="px-4 py-2.5 bg-purple-600/80 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 border border-purple-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Data</span>
            </button>
          </div>

          {importStatus && (
            <p className="text-xs font-semibold text-emerald-400 mt-3">{importStatus}</p>
          )}
        </div>

        {/* 4. DANGER ZONE */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-950/60 bg-rose-950/10">
          <h3 className="text-base font-bold text-rose-400 mb-2 flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Resetting the challenge will permanently clear all daily habit completion records and start fresh from Day 1.
          </p>

          <button
            onClick={resetChallenge}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-rose-600/20"
          >
            Reset Entire Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

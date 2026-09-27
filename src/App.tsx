import React, { useState } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Navbar } from './components/Navbar';
import type { TabType } from './components/Navbar';
import { HeaderStats } from './components/Dashboard/HeaderStats';
import { TodayHabits } from './components/Dashboard/TodayHabits';
import { DailyTrendChart } from './components/Dashboard/DailyTrendChart';
import { HabitsView } from './components/Habits/HabitsView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { CalendarView } from './components/Calendar/CalendarView';
import { SettingsView } from './components/Settings/SettingsView';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { stats } = useTracker();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Sticky Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <div>
            <HeaderStats />
            <TodayHabits />
            <DailyTrendChart />
          </div>
        )}

        {activeTab === 'habits' && <HabitsView />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-400">Winter Arc Tracker</span> • Lock in. Stay consistent. Own your discipline.
          </div>
          <div className="text-slate-400">
            Day {stats.dayNumber} of 90 • {stats.overallPercentage}% Overall Completion
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <TrackerProvider>
      <MainContent />
    </TrackerProvider>
  );
}

export default App;

import React from 'react';
import { format, parseISO, isBefore } from 'date-fns';
import { LayoutDashboard, CheckSquare, BarChart3, Calendar, Settings, Flame, Trophy } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';

export type TabType = 'dashboard' | 'habits' | 'analytics' | 'calendar' | 'settings';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, settings } = useTracker();
  const today = new Date();
  const startDate = parseISO(settings.startDate);
  const isPreChallenge = isBefore(today, startDate);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'habits', label: 'Habits', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Date Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              ❄️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl tracking-tight text-white">WINTER ARC</h1>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {isPreChallenge ? 'STARTS OCT 1' : `DAY ${stats.dayNumber}/90`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {format(today, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Mobile Streak Badge */}
          <div className="flex md:hidden items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-200">{stats.currentStreak}d</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center justify-start overflow-x-auto no-scrollbar space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Desktop Header Badges */}
        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none">STREAK</div>
              <div className="text-xs font-bold text-amber-400 leading-tight">{stats.currentStreak} Days</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 leading-none">OVERALL</div>
              <div className="text-xs font-bold text-emerald-400 leading-tight">{stats.overallPercentage}%</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

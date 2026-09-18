import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Search,
  Bell,
  Activity,
  Menu,
  X,
  School,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    settings,
    unreadAlertCount,
    navigateTo,
    setIsSearchOpen,
    toastMessage,
  } = useSchool();

  const todayDateStr = 'Friday, 18 Sept 2026';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          id="system-toast-banner"
          className="bg-slate-900 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between border-b border-slate-700 animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Branding */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => navigateTo('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <School className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-sans leading-tight">
                    SMART SCHOOL 360°
                  </h1>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 uppercase tracking-wider">
                    PROTOTYPE
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 tracking-normal">
                  One Digital Platform. One Smart School.
                </p>
              </div>
            </div>
          </div>

          {/* Middle: Live School Operating Status (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-800">Operational Normal</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">Session In Progress</span>
            </div>

            <div className="text-slate-500 font-medium">
              <span>{todayDateStr}</span>
            </div>
          </div>

          {/* Right: Global Search & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Trigger */}
            <button
              id="header-global-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span className="hidden sm:inline font-medium">Search school 360°...</span>
              <span className="hidden sm:inline text-[10px] font-semibold bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-sm shadow-2xs">
                ⌘K
              </span>
            </button>

            {/* Live Sim Toggle status indicator */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-emerald-50 text-emerald-800 border-emerald-200 cursor-pointer"
              onClick={() => navigateTo('settings')}
              title="Simulation Engine Status: Active"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sim Active</span>
            </div>

            {/* Alert Center Trigger */}
            <button
              id="header-alert-btn"
              onClick={() => navigateTo('alerts')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              aria-label="View School Alerts"
              title="Alert Center"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertCount > 0 && (
                <span
                  id="unread-alert-badge"
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-rose-600 rounded-full px-1 shadow-xs animate-bounce"
                >
                  {unreadAlertCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

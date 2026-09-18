/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Pages
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { EnergyPage } from './pages/Energy/EnergyPage';
import { TransportPage } from './pages/Transport/TransportPage';
import { AttendancePage } from './pages/Attendance/AttendancePage';
import { LibraryPage } from './pages/Library/LibraryPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { AlertsPage } from './pages/Alerts/AlertsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab, settings } = useSchool();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'energy':
        return <EnergyPage />;
      case 'transport':
        return <TransportPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'library':
        return <LibraryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <Navbar
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          mobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActivePage()}

          {/* Footer */}
          <footer className="mt-12 pt-6 pb-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 tracking-tight">SMART SCHOOL 360°</span>
              <span>—</span>
              <span>One Digital Platform. One Smart School.</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {settings.schoolName} • Standalone Web Edition
            </div>
          </footer>
        </main>
      </div>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}

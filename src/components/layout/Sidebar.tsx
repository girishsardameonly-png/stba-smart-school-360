import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TabType } from '../../types';
import {
  LayoutDashboard,
  Zap,
  Bus,
  Users,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  badge?: string | number;
  badgeColor?: string;
  icon: React.ElementType;
  moduleTag?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, unreadAlertCount, settings } = useSchool();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'energy',
      label: 'Smart Energy',
      moduleTag: 'M-1',
      icon: Zap,
    },
    {
      id: 'transport',
      label: 'Smart Transport',
      moduleTag: 'M-2',
      icon: Bus,
    },
    {
      id: 'attendance',
      label: 'Smart Attendance',
      moduleTag: 'M-3',
      icon: Users,
    },
    {
      id: 'library',
      label: 'Smart Library',
      moduleTag: 'M-4',
      icon: BookOpen,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 lg:top-16 z-40 h-[100dvh] lg:h-[calc(100vh-4rem)] w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Section */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Mobile Header in Drawer */}
          <div className="lg:hidden pb-3 border-b border-slate-200">
            <div className="font-bold text-slate-900 text-base">SMART SCHOOL 360°</div>
            <div className="text-xs text-slate-500">{settings.schoolName}</div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              System Modules
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.moduleTag && !item.badge && (
                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-500 group-hover:bg-slate-200">
                          {item.moduleTag}
                        </span>
                      )}
                      {item.badge !== undefined && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Module Status Summary widget */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <span>Campus Systems</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                4 Active
              </span>
            </div>
            <div className="space-y-1.5 pt-1 text-slate-600 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Energy Load</span>
                <span className="font-semibold text-slate-800">18.7 kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Transit Fleet</span>
                <span className="font-semibold text-slate-800">8/10 Buses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Attendance</span>
                <span className="font-semibold text-emerald-600">93.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Library Issued</span>
                <span className="font-semibold text-slate-800">32 Books</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {settings.schoolName}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {settings.campusTitle}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Filter,
  CheckCheck,
  Zap,
  Bus,
  Users,
  BookOpen,
  Bell,
  Clock,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead, dismissAlert, navigateTo } = useSchool();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unread' | 'Read'>('All');

  const filteredAlerts = alerts.filter((alert) => {
    if (categoryFilter !== 'All' && alert.category !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter === 'Unread' && alert.isRead) return false;
    if (statusFilter === 'Read' && !alert.isRead) return false;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleMarkAllRead = () => {
    alerts.forEach((a) => {
      if (!a.isRead) markAlertRead(a.id);
    });
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'energy':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-amber-600" />;
      case 'attendance':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'library':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div id="alerts-center-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-sm border border-rose-200/60">
                SYSTEM NOTIFICATIONS
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Incident Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              School Alert Center
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Automated anomaly triggers from energy circuits, vehicle telemetry, and attendance registers
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4 text-slate-500" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Counters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Energy', 'Transport', 'Attendance', 'Library'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            {(['All', 'Unread', 'Read'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st === 'Unread' ? `Unread (${unreadCount})` : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
            <h3 className="text-base font-bold text-slate-800">All Clear!</h3>
            <p className="text-xs text-slate-400">
              No matching alerts found for the selected category and status filters.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical' || alert.severity === 'high';

            return (
              <div
                key={alert.id}
                className={`bg-white border rounded-xl p-4 transition-all duration-150 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  alert.isRead
                    ? 'border-slate-200 bg-slate-50/40 text-slate-600'
                    : isCritical
                    ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/30 text-slate-900'
                    : 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20 text-slate-900'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.isRead
                        ? 'bg-slate-100 text-slate-500'
                        : isCritical
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {getCategoryIcon(alert.category)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-slate-900">
                        {alert.title}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-700 leading-relaxed max-w-3xl">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => navigateTo(alert.actionModule, alert.targetId)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{alert.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

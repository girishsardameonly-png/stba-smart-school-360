import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { MetricCard } from '../../components/common/MetricCard';
import {
  Users,
  BookOpen,
  Bus,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    settings,
    navigateTo,
    energyMetrics,
    buses,
    overallAttendance,
    libraryStats,
    alerts,
    markAlertRead,
    activityLogs,
    rooms,
    optimizeRoom,
  } = useSchool();

  const activeBusesCount = buses.filter((b) => b.status === 'On Route').length;
  const delayedBusesCount = buses.filter((b) => b.status === 'Delayed').length;
  const atSchoolBusesCount = buses.filter((b) => b.status === 'At School' || b.status === 'Completed').length;
  const wastageRooms = rooms.filter((r) => r.isWastage);

  return (
    <div id="dashboard-page" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & Operating Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">
                School Command Center
              </span>
              <span className="text-xs text-slate-400 font-medium">|</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Friday, 18 September 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SMART SCHOOL 360°
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              School Overview — {settings.schoolName} ({settings.campusTitle})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* School Operating Status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operating Status: Optimal</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Period 2 (08:30 – 09:15 AM)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Statistics: Clickable Cards Navigating to Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <MetricCard
          id="stat-attendance-card"
          title="Attendance"
          value={`${overallAttendance.percentage}%`}
          subtitle={`${overallAttendance.present} Present • ${overallAttendance.absent} Absent • ${overallAttendance.late} Late`}
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          accentBorderColor="border-blue-500"
          badge="Target ≥ 90%"
          badgeColor="bg-blue-100 text-blue-800"
          onClick={() => navigateTo('attendance')}
        />

        {/* Library Card */}
        <MetricCard
          id="stat-library-card"
          title="Library"
          value={`${libraryStats.totalBooks.toLocaleString()} Books`}
          subtitle={`${libraryStats.issued} Issued Today • ${libraryStats.overdue} Overdue`}
          icon={BookOpen}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          accentBorderColor="border-indigo-500"
          badge={`${libraryStats.available} Available`}
          badgeColor="bg-emerald-100 text-emerald-800"
          onClick={() => navigateTo('library')}
        />

        {/* Transport Card */}
        <MetricCard
          id="stat-transport-card"
          title="Transport"
          value={`${activeBusesCount}/${buses.length} Buses Active`}
          subtitle={`${atSchoolBusesCount} At School • ${delayedBusesCount} Delayed • 384 Students`}
          icon={Bus}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          accentBorderColor="border-amber-500"
          badge={delayedBusesCount > 0 ? `${delayedBusesCount} Delayed` : 'On Schedule'}
          badgeColor={delayedBusesCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}
          onClick={() => navigateTo('transport')}
        />

        {/* Energy Card */}
        <MetricCard
          id="stat-energy-card"
          title="Energy"
          value={`${energyMetrics.currentUsageKw} kWh`}
          subtitle={`Today: ${energyMetrics.todayUsageKwh} kWh • Est. Cost: ₹${energyMetrics.estimatedCostToday}`}
          icon={Zap}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorderColor="border-emerald-500"
          badge={`${energyMetrics.efficiencyScore}/100 Score`}
          badgeColor="bg-emerald-100 text-emerald-800"
          onClick={() => navigateTo('energy')}
        />
      </div>

      {/* 3. Live School Overview (Section 6) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-700/80 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">Live School Overview</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● Real-time Stream
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Continuous IoT telemetry synthesized across attendance, fleet, library, and campus circuits
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Simulated updates frequency: ~14s
          </div>
        </div>

        {/* 4 Connected Module Live Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigateTo('attendance')}
            className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-3.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Today's Attendance</span>
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">{overallAttendance.percentage}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {overallAttendance.present} students checked in
            </div>
          </div>

          <div
            onClick={() => navigateTo('transport')}
            className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-3.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Active Buses</span>
              <Bus className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">{activeBusesCount} active</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {delayedBusesCount > 0 ? `${delayedBusesCount} delayed alert` : 'All routes in green zone'}
            </div>
          </div>

          <div
            onClick={() => navigateTo('library')}
            className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-3.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Library Activity</span>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">{libraryStats.issued} books issued today</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {libraryStats.overdue} returns pending fine
            </div>
          </div>

          <div
            onClick={() => navigateTo('energy')}
            className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-lg p-3.5 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Current Energy Usage</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono">{energyMetrics.currentUsageKw} kWh</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {wastageRooms.length > 0 ? `⚠ ${wastageRooms.length} room wastage` : 'Sensors fully optimized'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wastage Optimizer notification if Room 204 or any room is in wastage */}
      {wastageRooms.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-900">
                Energy Wastage Detected: {wastageRooms.map((r) => r.name).join(', ')}
              </div>
              <div className="text-xs text-amber-700">
                Appliances active in unoccupied room drawing unnecessary load. Click to optimize instantly.
              </div>
            </div>
          </div>
          <button
            onClick={() => optimizeRoom(wastageRooms[0].id)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimize {wastageRooms[0].name}
          </button>
        </div>
      )}

      {/* Two Columns: Alert Center & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Alert Center (Section 7) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Alert Center</h2>
                <p className="text-xs text-slate-500">
                  {alerts.length} active notifications across campus systems
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('alerts')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {alerts.slice(0, 4).map((alert) => {
              const isCritical = alert.severity === 'critical' || alert.severity === 'high';
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-lg border transition-colors ${
                    alert.isRead
                      ? 'bg-slate-50/70 border-slate-200 text-slate-600'
                      : isCritical
                      ? 'bg-rose-50/40 border-rose-200/80 text-slate-900'
                      : 'bg-amber-50/30 border-amber-200/80 text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {alert.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {alert.timestamp}
                      </span>
                    </div>

                    {!alert.isRead && (
                      <button
                        onClick={() => markAlertRead(alert.id)}
                        className="text-[11px] text-slate-400 hover:text-slate-700 font-medium"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo(alert.actionModule, alert.targetId)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group"
                    >
                      <span>{alert.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400 capitalize">
                      {alert.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Recent Activity Feed (Section 27) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-500">Live chronological campus events</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium font-mono">
              Auto-sync enabled
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {activityLogs.slice(0, 7).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    log.category === 'energy'
                      ? 'bg-emerald-100 text-emerald-700'
                      : log.category === 'transport'
                      ? 'bg-amber-100 text-amber-700'
                      : log.category === 'attendance'
                      ? 'bg-blue-100 text-blue-700'
                      : log.category === 'library'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {log.time}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 leading-snug mt-0.5">
                    {log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

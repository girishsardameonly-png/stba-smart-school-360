import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AreaLineChart, HorizontalBarChart } from '../../components/common/ChartSvg';
import {
  BarChart3,
  Users,
  Bus,
  Zap,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { energyMetrics, overallAttendance, libraryStats, buses } = useSchool();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'term'>('week');

  // Attendance Trend Data
  const attendanceTrendData = [
    { label: 'Mon', value: 94.2 },
    { label: 'Tue', value: 95.1 },
    { label: 'Wed', value: 93.8 },
    { label: 'Thu', value: 92.5 },
    { label: 'Fri', value: overallAttendance.percentage },
  ];

  // Energy Trend Data
  const energyTrendData = [
    { label: 'Mon', value: 148 },
    { label: 'Tue', value: 152 },
    { label: 'Wed', value: 146 },
    { label: 'Thu', value: 139 },
    { label: 'Fri', value: Math.round(energyMetrics.todayUsageKwh) },
  ];

  // Library Circulation Trend Data
  const libraryCirculationData = [
    { label: 'Mon', value: 28 },
    { label: 'Tue', value: 34 },
    { label: 'Wed', value: 41 },
    { label: 'Thu', value: 30 },
    { label: 'Fri', value: libraryStats.issued },
  ];

  // Transport Fleet Utilization
  const transportSpeedData = [
    { label: '07:30', value: 32 },
    { label: '07:50', value: 24 },
    { label: '08:10', value: 18 },
    { label: '08:30', value: 34 },
    { label: '08:50', value: 0 },
  ];

  const categoryBooksData = [
    { label: 'Computer Science', value: 340, color: 'bg-indigo-600' },
    { label: 'General Science', value: 280, color: 'bg-blue-600' },
    { label: 'Mathematics', value: 240, color: 'bg-emerald-600' },
    { label: 'Literature', value: 210, color: 'bg-amber-600' },
    { label: 'History & Arts', value: 197, color: 'bg-purple-600' },
  ];

  return (
    <div id="analytics-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200/60">
                CAMPUS INTELLIGENCE
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Cross-System Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              School Analytics & Operations Audit
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Synthesis of the 4 core pillars: Energy, Transit, Attendance, and Library circulation
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
            {(['week', 'month', 'term'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedTimeRange(r)}
                className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-colors ${
                  selectedTimeRange === r
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'week' ? 'This Week' : r === 'month' ? 'This Month' : 'Academic Term'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs border-t-4 border-blue-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Attendance Rate</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {overallAttendance.percentage}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+1.4% above term average</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs border-t-4 border-emerald-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Energy Efficiency</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {energyMetrics.efficiencyScore}/100
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{energyMetrics.energySavingPercent}% load reduced</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs border-t-4 border-amber-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Transit On-Time</span>
            <Bus className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">92.0%</div>
          <div className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Avg ETA accuracy: ±4 mins</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs border-t-4 border-indigo-500">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold uppercase tracking-wider">Library Index</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {libraryStats.issued} Active
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            <span>{libraryStats.available} available titles</span>
          </div>
        </div>
      </div>

      {/* Analytics Section 1: Attendance Trend & Energy Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Attendance Daily Trajectory</span>
              </h2>
              <p className="text-xs text-slate-500">Weekly student attendance percentages</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Avg: 93.8%
            </span>
          </div>

          <AreaLineChart
            data={attendanceTrendData}
            height={200}
            lineColor="#2563eb"
            areaColor="rgba(37, 99, 235, 0.12)"
            valueSuffix="%"
          />
        </div>

        {/* Energy Consumption Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Energy Consumption Trend</span>
              </h2>
              <p className="text-xs text-slate-500">Daily kilowatt-hour meter totals</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Cost: ₹8/kWh
            </span>
          </div>

          <AreaLineChart
            data={energyTrendData}
            height={200}
            lineColor="#059669"
            areaColor="rgba(5, 150, 105, 0.12)"
            valueSuffix="kWh"
          />
        </div>
      </div>

      {/* Analytics Section 2: Library Circulation & Transport Fleet Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Library Issue/Return Trend */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Library Issue / Return Trends</span>
              </h2>
              <p className="text-xs text-slate-500">Daily student borrow transactions</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Total: 1,267 Books
            </span>
          </div>

          <AreaLineChart
            data={libraryCirculationData}
            height={190}
            lineColor="#6366f1"
            areaColor="rgba(99, 102, 241, 0.12)"
            valueSuffix="issues"
          />

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Collection Distribution by Category
            </div>
            <HorizontalBarChart data={categoryBooksData} maxValue={400} valueSuffix="vols" />
          </div>
        </div>

        {/* Transport Fleet Analytics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-600" />
                  <span>Transport Fleet Operations</span>
                </h2>
                <p className="text-xs text-slate-500">Morning route speeds and boarding density</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                10 Routes
              </span>
            </div>

            <AreaLineChart
              data={transportSpeedData}
              height={190}
              lineColor="#d97706"
              areaColor="rgba(217, 119, 6, 0.12)"
              valueSuffix="km/h"
              title="Fleet Average Speed During Morning Transit"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[11px] font-medium">Daily Transit Mileage</div>
              <div className="font-bold text-slate-900 text-sm mt-0.5">142.5 km Total</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-slate-400 text-[11px] font-medium">Fuel / Carbon Saving</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">18% Eco-Routing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

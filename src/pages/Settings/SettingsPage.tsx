import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Settings,
  RotateCcw,
  Save,
  CheckCircle2,
  Building,
  Zap,
  Users,
  Bell,
  Sliders,
  Shield,
  FileCode,
  Github,
  Check,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useSchool();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [campusTitle, setCampusTitle] = useState(settings.campusTitle);
  const [attendanceThreshold, setAttendanceThreshold] = useState(
    settings.attendanceThresholdPercent
  );
  const [energyCost, setEnergyCost] = useState(settings.energyCostPerKwh);
  const [autoSimulation, setAutoSimulation] = useState(settings.enableAutoSimulation);
  const [lowAttendanceAlerts, setLowAttendanceAlerts] = useState(
    settings.lowAttendanceAlerts
  );
  const [energyWastageAlerts, setEnergyWastageAlerts] = useState(
    settings.energyWastageAlerts
  );
  const [transportDelayAlerts, setTransportDelayAlerts] = useState(
    settings.transportDelayAlerts
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      campusTitle,
      attendanceThresholdPercent: Number(attendanceThreshold),
      energyCostPerKwh: Number(energyCost),
      enableAutoSimulation: autoSimulation,
      lowAttendanceAlerts,
      energyWastageAlerts,
      transportDelayAlerts,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    resetDemoData();
    setShowResetConfirm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="settings-page" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                SYSTEM CONFIGURATION
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Administrative Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Settings & Platform Configuration
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Customize institutional thresholds, electricity tariffs, telemetry intervals, and data resets
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Configuration Saved</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Institutional Parameters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Institutional Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">School Name</label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Subtitle / Tagline</label>
              <input
                type="text"
                value={campusTitle}
                onChange={(e) => setCampusTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Operational Thresholds */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Operational Parameters & Tariffs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Attendance Alert Threshold (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={attendanceThreshold}
                  onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                  required
                />
                <span className="text-slate-500 font-medium shrink-0">Current: {attendanceThreshold}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Classes or individual records with attendance below this percentage trigger automatic warnings.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Energy Cost per kWh Tariff (₹)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  value={energyCost}
                  onChange={(e) => setEnergyCost(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-blue-500 font-medium"
                  required
                />
                <span className="text-slate-500 font-medium shrink-0">₹{energyCost}/unit</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used in real-time calculation of estimated daily energy expenditure.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry & Simulation Engine */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Zap className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Simulation & Telemetry Engine</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div>
                <div className="font-bold text-slate-900">Background Telemetry Simulation</div>
                <p className="text-slate-500 text-[11px]">
                  Simulates periodic bus speed adjustments, slight power fluctuations, and scheduled logs
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSimulation}
                  onChange={(e) => setAutoSimulation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Alert Notification Rules */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Automated Alert Triggers</h2>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900">Low Attendance Alerts</span>
                <p className="text-slate-500 text-[11px]">Notify when class attendance drops below threshold</p>
              </div>
              <input
                type="checkbox"
                checked={lowAttendanceAlerts}
                onChange={(e) => setLowAttendanceAlerts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900">Energy Wastage Alerts</span>
                <p className="text-slate-500 text-[11px]">Notify when empty rooms run active lighting/cooling</p>
              </div>
              <input
                type="checkbox"
                checked={energyWastageAlerts}
                onChange={(e) => setEnergyWastageAlerts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900">Transport Delay Alerts</span>
                <p className="text-slate-500 text-[11px]">Notify when bus transit runs &gt;10 minutes past schedule</p>
              </div>
              <input
                type="checkbox"
                checked={transportDelayAlerts}
                onChange={(e) => setTransportDelayAlerts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-0 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Save button bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>

      {/* GitHub Repository Readiness Card */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Github className="w-5 h-5 text-slate-300" />
          <span>GitHub Repository Ready & Standalone Architecture</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          SMART SCHOOL 360° is designed with zero external SaaS or proprietary cloud dependencies. All data layers, simulated IoT circuits, bus GPS trackers, and circulation registers run directly in modern browser local state with persistent cache synchronization.
        </p>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
          <span className="bg-slate-800 px-2 py-1 rounded">React 19 + TypeScript</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Tailwind CSS 4</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Lucide Icons</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Client-side Storage Engine</span>
        </div>
      </div>

      {/* Confirmation modal for Reset Data */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Demo Data?</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will restore all rooms, buses, student records, and library catalogs to the original demonstration state.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-2xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

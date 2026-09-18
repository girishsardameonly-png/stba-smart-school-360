import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AreaLineChart, HorizontalBarChart } from '../../components/common/ChartSvg';
import {
  Zap,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  Fan,
  Wind,
  CheckCircle,
  Building,
  Sliders,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

export const EnergyPage: React.FC = () => {
  const {
    rooms,
    energyMetrics,
    optimizeRoom,
    toggleRoomAppliance,
    toggleRoomOccupancy,
    lastOptimization,
    clearLastOptimization,
  } = useSchool();

  const [activePeriod, setActivePeriod] = useState<'today' | '7days' | '30days'>('today');
  const [filterBuilding, setFilterBuilding] = useState<string>('All');

  const wastageRooms = rooms.filter((r) => r.isWastage);

  // Time-series data based on activePeriod
  const chartData = {
    today: [
      { label: '06:00', value: 8.2 },
      { label: '07:00', value: 11.4 },
      { label: '08:00', value: 17.1 },
      { label: '09:00', value: 18.7 },
      { label: '10:00', value: 19.4 },
      { label: '11:00', value: 18.2 },
      { label: '12:00', value: 16.5 },
      { label: '13:00', value: 15.8 },
      { label: '14:00', value: 17.9 },
      { label: '15:00', value: 14.1 },
    ],
    '7days': [
      { label: 'Mon', value: 148 },
      { label: 'Tue', value: 152 },
      { label: 'Wed', value: 146 },
      { label: 'Thu', value: 139 },
      { label: 'Fri', value: 142 },
      { label: 'Sat', value: 68 },
      { label: 'Sun', value: 42 },
    ],
    '30days': [
      { label: 'Week 1', value: 920 },
      { label: 'Week 2', value: 890 },
      { label: 'Week 3', value: 865 },
      { label: 'Week 4', value: 840 },
    ],
  }[activePeriod];

  const roomChartData = rooms.map((r) => ({
    label: r.name.split(' (')[0],
    value: r.powerKw,
    color: r.isWastage ? 'bg-rose-500' : r.powerKw > 3.0 ? 'bg-amber-500' : 'bg-emerald-600',
    secondaryText: r.isOccupied ? 'Occupied' : 'Empty',
  }));

  const filteredRooms = rooms.filter((r) => {
    if (filterBuilding === 'All') return true;
    if (filterBuilding === 'Wastage') return r.isWastage;
    return r.building === filterBuilding;
  });

  const buildings = ['All', 'Wastage', 'Block A', 'Tech Wing', 'Science Block', 'Academic Block', 'Admin Block'];

  const handleOptimizeAll = () => {
    wastageRooms.forEach((r) => optimizeRoom(r.id));
  };

  return (
    <div id="energy-management-page" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200/60">
                MODULE 1
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Smart Energy Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Energy Command & Optimization
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Automated circuit telemetry, occupancy tracking, and active wastage mitigation
            </p>
          </div>

          {wastageRooms.length > 0 ? (
            <button
              onClick={handleOptimizeAll}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Optimize All Wastage ({wastageRooms.length} Rooms)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>All Rooms Energy Optimized</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Success Banner for Last Optimization */}
      {lastOptimization && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-2xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">
                {lastOptimization.roomName} Successfully Optimized!
              </div>
              <div className="text-xs text-emerald-800 font-medium mt-0.5">
                Energy reduced by <span className="font-bold">{lastOptimization.savedKw} kWh</span> • Estimated saving: <span className="font-bold">₹{lastOptimization.savedCost}</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearLastOptimization}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Section 8 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Current Usage</span>
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {energyMetrics.currentUsageKw} kWh
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Real-time load</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Today's Usage</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {energyMetrics.todayUsageKwh} kWh
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cumulative from 06:00</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Cost</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            ₹{energyMetrics.estimatedCostToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">@ ₹{energyMetrics.costPerKwh}/unit</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Energy Saving</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {energyMetrics.energySavingPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Vs. unmanaged baseline</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Efficiency Score</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 font-mono">
            {energyMetrics.efficiencyScore}/100
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Grade A Smart Campus</div>
        </div>
      </div>

      {/* 4. Section 9 & 10: Energy Rooms & Automation Simulation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Campus Room Circuit Status</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {rooms.length} Monitored Zones
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time occupancy sensors and appliance relay controls. Click any control to simulate changes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {buildings.map((b) => (
              <button
                key={b}
                onClick={() => setFilterBuilding(b)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filterBuilding === b
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'Wastage' ? `⚠ Wastage (${wastageRooms.length})` : b}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRooms.map((room) => {
            return (
              <div
                key={room.id}
                id={`room-card-${room.id}`}
                className={`rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                  room.isWastage
                    ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  {/* Room Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{room.name}</h3>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {room.building} • {room.floor}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold font-mono text-slate-900">
                        {room.powerKw} kW
                      </div>
                      <button
                        onClick={() => toggleRoomOccupancy(room.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 transition-colors ${
                          room.isOccupied
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Click to toggle simulated room occupancy"
                      >
                        {room.isOccupied ? '● Occupied' : '○ Empty'}
                      </button>
                    </div>
                  </div>

                  {/* Wastage Warning Banner (Section 10) */}
                  {room.isWastage && (
                    <div className="my-2.5 p-2.5 rounded-lg bg-rose-100/80 border border-rose-200 text-rose-900 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>⚠ Energy Wastage Detected</span>
                      </div>
                      <span className="text-[10px] bg-rose-200/80 text-rose-900 px-1.5 py-0.5 rounded-sm">
                        Empty + Load ON
                      </span>
                    </div>
                  )}

                  {/* Appliance Controls (Section 9) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Connected Circuits
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {/* Lights toggle */}
                      <button
                        onClick={() => toggleRoomAppliance(room.id, 'lights')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-colors ${
                          room.lightsOn
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <Lightbulb className={`w-4 h-4 mb-1 ${room.lightsOn ? 'text-amber-600' : 'text-slate-400'}`} />
                        <span>Lights {room.lightsOn ? 'ON' : 'OFF'}</span>
                      </button>

                      {/* Fans toggle */}
                      <button
                        onClick={() => toggleRoomAppliance(room.id, 'fans')}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-colors ${
                          room.fansOn
                            ? 'bg-sky-50 border-sky-300 text-sky-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <Fan className={`w-4 h-4 mb-1 ${room.fansOn ? 'text-sky-600 animate-spin' : 'text-slate-400'}`} />
                        <span>Fans {room.fansOn ? 'ON' : 'OFF'}</span>
                      </button>

                      {/* AC toggle (where applicable) */}
                      {room.hasAc ? (
                        <button
                          onClick={() => toggleRoomAppliance(room.id, 'ac')}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-semibold transition-colors ${
                            room.acOn
                              ? 'bg-blue-50 border-blue-300 text-blue-900'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <Wind className={`w-4 h-4 mb-1 ${room.acOn ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>AC {room.acOn ? 'ON' : 'OFF'}</span>
                        </button>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 text-[10px] text-slate-400 font-medium">
                          <Wind className="w-4 h-4 mb-1 opacity-30" />
                          <span>No AC</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action: Optimize Room Button (Section 10) */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  {room.isWastage ? (
                    <button
                      onClick={() => optimizeRoom(room.id)}
                      className="w-full py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimize Room</span>
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Circuit Stable
                      </span>
                      {room.lastOptimized && (
                        <span className="text-[10px] text-slate-400">
                          Optimized {room.lastOptimized}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section 11: Energy Analytics (Today, 7 Days, 30 Days & Room-wise breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time trend chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Energy Consumption Analytics</h2>
              <p className="text-xs text-slate-500">Hourly & daily smart meter telemetry trends</p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              {(['today', '7days', '30days'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                    activePeriod === period
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period === 'today' ? 'Today' : period === '7days' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          <AreaLineChart
            data={chartData}
            height={220}
            lineColor="#059669"
            areaColor="rgba(5, 150, 105, 0.15)"
            valueSuffix={activePeriod === 'today' ? 'kW' : 'kWh'}
          />

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[11px] font-medium">Peak Hour</div>
              <div className="font-bold text-slate-800">10:00 AM (19.4 kW)</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] font-medium">Off-Peak Basline</div>
              <div className="font-bold text-slate-800">06:00 AM (8.2 kW)</div>
            </div>
            <div>
              <div className="text-slate-400 text-[11px] font-medium">Avg Power Factor</div>
              <div className="font-bold text-emerald-700">0.96 (Excellent)</div>
            </div>
          </div>
        </div>

        {/* Room-wise consumption breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="pb-3 mb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Room-Wise Load Distribution</h2>
            <p className="text-xs text-slate-500">Current kilowatt draw per campus zone</p>
          </div>

          <HorizontalBarChart data={roomChartData.slice(0, 6)} valueSuffix="kW" maxValue={5.0} />

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">IoT Circuit Insights:</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Computer Lab 1 and Central Library draw the highest active loads due to desktop workstations and multi-ton AC units.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

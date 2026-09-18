import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Bus,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Navigation,
  Phone,
  Compass,
  Gauge,
  Route,
} from 'lucide-react';
import { BusStatus } from '../../types';

export const TransportPage: React.FC = () => {
  const {
    buses,
    routes,
    selectedBusId,
    setSelectedBusId,
    advanceBusStop,
    simulateBusDelay,
    optimizeBusRoute,
  } = useSchool();

  const [statusFilter, setStatusFilter] = useState<string>('All');

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];
  const selectedRoute = routes.find((r) => r.busPlate === selectedBus.plateNumber) || routes[0];

  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.status === 'On Route').length;
  const atSchoolBuses = buses.filter((b) => b.status === 'At School' || b.status === 'Completed').length;
  const delayedBuses = buses.filter((b) => b.status === 'Delayed').length;
  const totalStudentsTransported = buses.reduce((acc, b) => acc + b.studentsCount, 0);

  const filteredBuses = buses.filter((b) => {
    if (statusFilter === 'All') return true;
    return b.status === statusFilter;
  });

  const getStatusBadge = (status: BusStatus) => {
    switch (status) {
      case 'On Route':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delayed':
        return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'At School':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div id="transport-management-page" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200/60">
                MODULE 2
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Smart Transport Fleet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              School Fleet & Route Navigation
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Real-time transit simulation, student boarding manifests, and automated detour rerouting
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>GPS Telemetry Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Section 12: Transport Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Buses</span>
            <Bus className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {totalBuses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Campus fleet size</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Buses</span>
            <Navigation className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 font-mono">
            {activeBuses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Currently on transit</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">At School</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {atSchoolBuses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Safely docked</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Delayed</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono">
            {delayedBuses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires reroute</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Students Transported</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 font-mono">
            {totalStudentsTransported}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 10 morning routes</div>
        </div>
      </div>

      {/* 3. Section 15: Interactive Transport Simulation Station */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Interactive Bus Route Simulation
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {selectedBus.plateNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate bus stop progression, live ETA recalculation, and traffic congestion mitigation
            </p>
          </div>

          {/* Quick bus selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Selected Bus:</span>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plateNumber} ({b.routeName} - {b.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Delay notification / Alternate Route Banner (Section 15) */}
        {selectedBus.isDelayed && (
          <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-sm font-bold text-rose-900">
                  Route Delay Encountered on {selectedBus.plateNumber}
                </div>
                <div className="text-xs text-rose-700 mt-0.5">
                  {selectedBus.delayReason || 'Congestion near Hospital Junction flyover'}. Alternative bypass route available via Ring Road!
                </div>
              </div>
            </div>

            <button
              onClick={() => optimizeBusRoute(selectedBus.id)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Optimize Route</span>
            </button>
          </div>
        )}

        {/* Selected Bus Active Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus Details & Controls Card */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {selectedBus.plateNumber}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedBus.routeName} • Driver: {selectedBus.driverName}
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(selectedBus.status)}`}>
                {selectedBus.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Current Stop</div>
                <div className="font-semibold text-slate-800 text-sm mt-0.5">{selectedBus.currentStop}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Next Stop</div>
                <div className="font-semibold text-blue-700 text-sm mt-0.5">{selectedBus.nextStop}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Estimated Arrival (ETA)</div>
                <div className="font-semibold text-slate-800 text-sm mt-0.5">{selectedBus.eta}</div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Onboard Manifest</div>
                <div className="font-semibold text-slate-800 text-sm mt-0.5">
                  {selectedBus.studentsCount}/{selectedBus.capacity} Students
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {selectedBus.driverPhone}
              </span>
              <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                {selectedBus.speedKmH} km/h
              </span>
            </div>

            {/* Simulation Action Buttons (Section 15) */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Fleet Simulation Controls
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => advanceBusStop(selectedBus.id)}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Next Stop</span>
                </button>

                {!selectedBus.isDelayed ? (
                  <button
                    onClick={() => simulateBusDelay(selectedBus.id)}
                    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Simulate Delay</span>
                  </button>
                ) : (
                  <button
                    onClick={() => optimizeBusRoute(selectedBus.id)}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Optimize Route</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Visual Interactive Route Progression Stops Map */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-slate-900">
                    Route Waypoints Progression
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Stop {selectedBus.currentStopIndex + 1} of {selectedBus.stops.length}
                </span>
              </div>

              {/* Waypoint Stepper */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {selectedBus.routeStops.map((stop, index) => {
                  const isPassed = index < selectedBus.currentStopIndex;
                  const isCurrent = index === selectedBus.currentStopIndex;
                  const isUpcoming = index > selectedBus.currentStopIndex;

                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Node circle */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isPassed
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isPassed ? '✓' : index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? 'text-blue-700 font-bold'
                                : isPassed
                                ? 'text-slate-800'
                                : 'text-slate-500'
                            }`}
                          >
                            {stop.name}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {stop.scheduledTime}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {isCurrent
                            ? '● Bus currently here (boarding / in-transit)'
                            : isPassed
                            ? 'Passed on schedule'
                            : 'Upcoming scheduled waypoint'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Safety Protocol: Speed Governor Active</span>
              <span className="font-semibold text-emerald-700">RFID Attendance Tap In: Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section 13: Bus Fleet Monitoring Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Campus Fleet Monitoring Manifest</h2>
            <p className="text-xs text-slate-500">Live operational status across all 10 transit units</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {(['All', 'On Route', 'Delayed', 'At School', 'Completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">Bus Plate</th>
                <th className="px-3 py-3">Route</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Driver</th>
                <th className="px-3 py-3">Students</th>
                <th className="px-3 py-3">Next Stop</th>
                <th className="px-3 py-3">ETA</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBuses.map((bus) => {
                const isSelected = bus.id === selectedBusId;
                return (
                  <tr
                    key={bus.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="px-3 py-3 font-mono font-bold text-slate-900">
                      {bus.plateNumber}
                    </td>
                    <td className="px-3 py-3">{bus.routeName}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(bus.status)}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{bus.driverName}</td>
                    <td className="px-3 py-3 font-mono font-semibold">
                      {bus.studentsCount}/{bus.capacity}
                    </td>
                    <td className="px-3 py-3 text-slate-800 font-medium">{bus.nextStop}</td>
                    <td className="px-3 py-3 font-mono text-slate-600">{bus.eta}</td>
                    <td className="px-3 py-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedBusId(bus.id);
                          advanceBusStop(bus.id);
                        }}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold transition-colors"
                      >
                        Advance
                      </button>
                      <button
                        onClick={() => setSelectedBusId(bus.id)}
                        className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold transition-colors"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Section 14: Transport Routes Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="pb-3 mb-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">Configured Bus Transit Corridors</h2>
          <p className="text-xs text-slate-500">Stops, assigned bus units, and estimated run times</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => {
            const assignedBus = buses.find((b) => b.plateNumber === route.busPlate);
            return (
              <div
                key={route.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {route.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Assigned: {route.busPlate}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {route.totalDistanceKm} km • ~{route.estimatedDurationMin} mins
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-800 mb-3 leading-relaxed">
                  {route.description}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                  <span className="text-slate-500">
                    Active Students: <span className="font-bold text-slate-900">{route.activeStudents}</span>
                  </span>
                  {assignedBus && (
                    <button
                      onClick={() => setSelectedBusId(assignedBus.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <span>Simulate Bus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

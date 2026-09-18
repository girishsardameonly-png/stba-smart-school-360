import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  CheckCheck,
  TrendingDown,
  Phone,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const {
    students,
    classes,
    overallAttendance,
    updateStudentAttendance,
    settings,
    selectedClassFilter,
    setSelectedClassFilter,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState('2026-09-18');

  const threshold = settings.attendanceThresholdPercent || 75;

  // Filter students
  const filteredStudents = students.filter((st) => {
    // Class filter
    if (selectedClassFilter !== 'All') {
      const targetClass = selectedClassFilter.replace('Class ', '');
      const studentClassFormatted = `${st.className.replace('Class ', '')}-${st.section}`;
      const classNameOnly = st.className.replace('Class ', '');
      if (
        selectedClassFilter !== `${st.className}-${st.section}` &&
        selectedClassFilter !== st.className &&
        !selectedClassFilter.includes(studentClassFormatted) &&
        !selectedClassFilter.includes(classNameOnly)
      ) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'All' && st.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        st.rollNo.toLowerCase().includes(q) ||
        st.className.toLowerCase().includes(q) ||
        st.section.toLowerCase().includes(q)
      );
    }

    return true;
  });

  // Check for classes below threshold (Section 20)
  const lowAttendanceClasses = classes.filter((c) => c.percentage < threshold);

  return (
    <div id="attendance-management-page" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200/60">
                MODULE 3
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Smart Attendance Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Student Attendance & Class Roster
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Live biometric check-in sync, class thresholds, and real-time roll status updating
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Low Attendance Threshold Alert Banner (Section 20) */}
      {lowAttendanceClasses.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-900">
                Low Attendance Alert — Threshold {threshold}%
              </div>
              <div className="text-xs text-amber-800 mt-0.5">
                The following classes have attendance below {threshold}%:{' '}
                <span className="font-bold">
                  {lowAttendanceClasses.map((c) => `${c.className}-${c.section} (${c.percentage}%)`).join(', ')}
                </span>
                . Parent notifications queued.
              </div>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-amber-200/80 text-amber-900 shrink-0">
            Escalation Active
          </span>
        </div>
      )}

      {/* 3. Section 16: Overall Attendance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overall Attendance</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {overallAttendance.percentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Campus wide average</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Present Today</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {overallAttendance.present.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Checked in classrooms</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Absent</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono">
            {overallAttendance.absent}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Unexcused / excused</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Late Arrivals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-700 font-mono">
            {overallAttendance.late}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Arrived post 08:15 AM</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Classes Tracked</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 font-mono">
            {overallAttendance.totalClasses}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Primary to Senior Secondary</div>
        </div>
      </div>

      {/* 4. Section 17: Class Attendance Cards Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Class Performance Records</h2>
            <p className="text-xs text-slate-500">
              Grade-wise attendance distribution and class teacher assignments
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click any class to filter students</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {classes.map((c) => {
            const classKey = `${c.className}-${c.section}`;
            const isSelected = selectedClassFilter === classKey || selectedClassFilter === c.className;
            const isLow = c.percentage < threshold;

            return (
              <div
                key={classKey}
                onClick={() => setSelectedClassFilter(isSelected ? 'All' : classKey)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-300/30'
                    : isLow
                    ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {c.className}-{c.section}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Teacher: {c.teacher} • {c.room}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${
                      isLow
                        ? 'bg-rose-100 text-rose-800'
                        : c.percentage >= 95
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {c.percentage}%
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center py-2 bg-slate-50/80 rounded-lg text-xs border border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Total</div>
                    <div className="font-bold text-slate-800">{c.totalStudents}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-600 uppercase font-semibold">Pres</div>
                    <div className="font-bold text-emerald-700">{c.present}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-rose-600 uppercase font-semibold">Abs</div>
                    <div className="font-bold text-rose-700">{c.absent}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-600 uppercase font-semibold">Late</div>
                    <div className="font-bold text-amber-700">{c.late}</div>
                  </div>
                </div>

                {isLow && (
                  <div className="mt-2 text-[10px] font-bold text-rose-700 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>Below {threshold}% Attendance threshold</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Section 18 & 19: Attendance Filters & Interactive Student Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Interactive Student Attendance Registry
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredStudents.length} Students Shown
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click Present / Absent / Late to update live student status and recalculate class & dashboard metrics
            </p>
          </div>

          {/* Search and Filters Bar (Section 18) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or roll..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-400"
              />
            </div>

            {/* Class Dropdown Filter */}
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={`${c.className}-${c.section}`} value={`${c.className}-${c.section}`}>
                  {c.className}-{c.section}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['All', 'Present', 'Absent', 'Late'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 19: Student Attendance Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">Roll No</th>
                <th className="px-3 py-3">Student Name</th>
                <th className="px-3 py-3">Class & Section</th>
                <th className="px-3 py-3">Guardian Contact</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Last Recorded</th>
                <th className="px-3 py-3 text-right">Quick Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                    No student records matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-3 py-3 font-mono font-bold text-slate-900">
                        {student.rollNo}
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {student.name}
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {student.className}-{student.section}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.guardianPhone}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            student.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : student.status === 'Absent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {student.status === 'Present' && <CheckCircle className="w-3 h-3" />}
                          {student.status === 'Absent' && <XCircle className="w-3 h-3" />}
                          {student.status === 'Late' && <Clock className="w-3 h-3" />}
                          <span>{student.status}</span>
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-400">
                        {student.lastMarkedTime}
                      </td>

                      {/* Working Buttons to change attendance status (Section 19) */}
                      <td className="px-3 py-3 text-right">
                        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateStudentAttendance(student.id, 'Present')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              student.status === 'Present'
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                            title="Mark Present"
                          >
                            Present
                          </button>

                          <button
                            onClick={() => updateStudentAttendance(student.id, 'Absent')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              student.status === 'Absent'
                                ? 'bg-rose-600 text-white'
                                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                            title="Mark Absent"
                          >
                            Absent
                          </button>

                          <button
                            onClick={() => updateStudentAttendance(student.id, 'Late')}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              student.status === 'Late'
                                ? 'bg-amber-500 text-white'
                                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                            title="Mark Late"
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

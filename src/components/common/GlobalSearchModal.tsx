import React, { useState, useMemo, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Search, X, Users, Bus, Zap, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { TabType } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, students, buses, books, rooms, classes, navigateTo } = useSchool();
  const [query, setQuery] = useState('');

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global key listener for Esc and Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedStudents = students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.section.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedBuses = buses.filter(
      (b) =>
        b.plateNumber.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.driverName.toLowerCase().includes(q) ||
        b.currentStop.toLowerCase().includes(q) ||
        b.nextStop.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedBooks = books.filter(
      (bk) =>
        bk.title.toLowerCase().includes(q) ||
        bk.author.toLowerCase().includes(q) ||
        bk.category.toLowerCase().includes(q) ||
        bk.bookCode.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedRooms = rooms.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.building.toLowerCase().includes(q) ||
        r.floor.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedClasses = classes.filter(
      (c) =>
        `${c.className}-${c.section}`.toLowerCase().includes(q) ||
        c.teacher.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount =
      matchedStudents.length +
      matchedBuses.length +
      matchedBooks.length +
      matchedRooms.length +
      matchedClasses.length;

    return {
      students: matchedStudents,
      buses: matchedBuses,
      books: matchedBooks,
      rooms: matchedRooms,
      classes: matchedClasses,
      totalCount,
    };
  }, [query, students, buses, books, rooms, classes]);

  if (!isSearchOpen) return null;

  const handleSelect = (tab: TabType, targetId?: string) => {
    setIsSearchOpen(false);
    navigateTo(tab, targetId);
  };

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="global-search-dialog"
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            id="global-search-input"
            className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 text-base focus:outline-hidden"
            placeholder="Search students, buses, books, rooms, classes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              id="clear-search-btn"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-xs font-medium text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-sm">
            ESC to close
          </span>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Quick Jump Across 4 Core Smart Systems</p>
              <p className="text-xs text-slate-400 mt-1">
                Type a student name, bus number, book title, or room name
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setQuery('Room 204')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium"
                >
                  Room 204
                </button>
                <button
                  onClick={() => setQuery('RJ-07')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium"
                >
                  Bus RJ-07
                </button>
                <button
                  onClick={() => setQuery('Class 10')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium"
                >
                  Class 10
                </button>
                <button
                  onClick={() => setQuery('Computer')}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700 font-medium"
                >
                  Computer Basics
                </button>
              </div>
            </div>
          )}

          {query.trim() && results && results.totalCount === 0 && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium">No records found matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another term or search by code</p>
            </div>
          )}

          {results && results.totalCount > 0 && (
            <div className="space-y-4">
              {/* Students Section */}
              {results.students.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Students ({results.students.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.students.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSelect('attendance', st.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {st.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Roll {st.rollNo} • {st.className}-{st.section}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              st.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : st.status === 'Absent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {st.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buses Section */}
              {results.buses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <Bus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Transport & Buses ({results.buses.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.buses.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSelect('transport', b.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-amber-50/70 border border-transparent hover:border-amber-100 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-amber-700">
                            {b.plateNumber} ({b.routeName})
                          </div>
                          <div className="text-xs text-slate-500">
                            Driver: {b.driverName} • Next: {b.nextStop} (ETA: {b.eta})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              b.status === 'On Route'
                                ? 'bg-blue-100 text-blue-800'
                                : b.status === 'Delayed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {b.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Books Section */}
              {results.books.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Library Books ({results.books.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.books.map((bk) => (
                      <button
                        key={bk.id}
                        onClick={() => handleSelect('library', bk.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-indigo-50/70 border border-transparent hover:border-indigo-100 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
                            {bk.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {bk.author} • {bk.category} • [{bk.bookCode}]
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              bk.status === 'Available'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {bk.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Section */}
              {results.rooms.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rooms & Energy ({results.rooms.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.rooms.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => handleSelect('energy', r.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50/70 border border-transparent hover:border-emerald-100 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                            {r.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {r.building} • {r.floor} • Current Load: {r.powerKw} kW
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.isWastage ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-rose-100 text-rose-800 animate-pulse">
                              ⚠ Wastage
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                              {r.isOccupied ? 'Occupied' : 'Empty'}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Classes Section */}
              {results.classes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>Classes ({results.classes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {results.classes.map((c) => (
                      <button
                        key={`${c.className}-${c.section}`}
                        onClick={() => handleSelect('attendance', `${c.className}-${c.section}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-teal-50/70 border border-transparent hover:border-teal-100 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                            {c.className}-{c.section}
                          </div>
                          <div className="text-xs text-slate-500">
                            Teacher: {c.teacher} • Room: {c.room}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-teal-100 text-teal-800">
                            {c.percentage}% Attendance
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Navigate with click or Enter</span>
          <span className="font-semibold text-slate-600">SMART SCHOOL 360°</span>
        </div>
      </div>
    </div>
  );
};

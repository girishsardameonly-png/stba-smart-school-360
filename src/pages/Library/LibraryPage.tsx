import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Search,
  Filter,
  AlertCircle,
  ArrowRight,
  BookPlus,
  RotateCcw,
  Sparkles,
  Layers,
  DollarSign,
  UserCheck,
  X,
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const {
    books,
    overdueBooks,
    libraryStats,
    issueBook,
    returnBook,
    markOverdueReturned,
    students,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  // Issue modal state
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [selectedBookToIssue, setSelectedBookToIssue] = useState<string | null>(null);
  const [issueStudentName, setIssueStudentName] = useState('');
  const [issueClass, setIssueClass] = useState('Class 10-B');

  const categories = [
    'All',
    'Computer Science',
    'General Science',
    'Mathematics',
    'Literature',
    'History',
    'Physics',
    'Biology',
  ];

  const filteredBooks = books.filter((book) => {
    if (selectedCategory !== 'All' && book.category !== selectedCategory) {
      return false;
    }
    if (selectedAvailability !== 'All' && book.status !== selectedAvailability) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q) ||
        book.bookCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenIssueModal = (bookId: string) => {
    setSelectedBookToIssue(bookId);
    setIssueStudentName(students[0]?.name || 'Student 14');
    setIssueClass('Class 10-B');
    setIssueModalOpen(true);
  };

  const handleConfirmIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookToIssue || !issueStudentName.trim()) return;

    issueBook(selectedBookToIssue, issueStudentName, issueClass);
    setIssueModalOpen(false);
    setSelectedBookToIssue(null);
  };

  const totalFinesAccrued = overdueBooks.reduce((acc, b) => acc + b.fineAmount, 0);

  return (
    <div id="library-management-page" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200/60">
                MODULE 4
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-600">Smart Library & RFID Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Knowledge Repository & Circulation
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Live book borrowing status, shelf inventory, and overdue fine tracking
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>RFID Checkouts: Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Section 21: Library Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Books</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
            {libraryStats.totalBooks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cataloged collection</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Issued</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 font-mono">
            {libraryStats.issued}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">With active student loans</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
            {libraryStats.available.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">On shelves ready for checkout</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Overdue</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono">
            {libraryStats.overdue}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Pending return (₹{totalFinesAccrued} fine)
          </div>
        </div>
      </div>

      {/* 3. Section 24: Overdue Books Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Overdue Books & Accrued Fines
              </h2>
              <p className="text-xs text-slate-500">
                Borrowings exceeding standard 14-day loan duration (@ ₹5/day fine)
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
            {overdueBooks.length} Overdue Items Pending
          </span>
        </div>

        {overdueBooks.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
            <span>No overdue books. All student loans are within due dates!</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Book Title</th>
                  <th className="px-3 py-2.5">Student / Borrower</th>
                  <th className="px-3 py-2.5">Class</th>
                  <th className="px-3 py-2.5">Due Date</th>
                  <th className="px-3 py-2.5">Days Overdue</th>
                  <th className="px-3 py-2.5">Fine Amount</th>
                  <th className="px-3 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overdueBooks.map((od) => (
                  <tr key={od.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-3 py-3 font-semibold text-slate-900">
                      {od.bookTitle}
                    </td>
                    <td className="px-3 py-3 text-slate-700 font-medium">
                      {od.studentName}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{od.className}</td>
                    <td className="px-3 py-3 font-mono text-slate-500">{od.dueDate}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
                        {od.daysOverdue} days overdue
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono font-bold text-rose-700">
                      ₹{od.fineAmount}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => markOverdueReturned(od.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors"
                      >
                        Mark Returned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Section 22 & 23: Library Catalog & Issue/Return Interactions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Searchable Library Catalog</h2>
            <p className="text-xs text-slate-500">
              Browse reference volumes, text materials, and manage circulation status
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, or code..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['All', 'Available', 'Issued'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedAvailability(st)}
                  className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                    selectedAvailability === st
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

        {/* Books Table (Section 22 & 23) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">Book ID</th>
                <th className="px-3 py-3">Book Title</th>
                <th className="px-3 py-3">Author</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Shelf / Rack</th>
                <th className="px-3 py-3">Availability</th>
                <th className="px-3 py-3">Issued To</th>
                <th className="px-3 py-3 text-right">Circulation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => {
                const isAvailable = book.status === 'Available';
                return (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-3 font-mono font-bold text-slate-800">
                      {book.bookCode}
                    </td>
                    <td className="px-3 py-3 font-bold text-slate-900">
                      {book.title}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{book.author}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-slate-500">
                      {book.rackLocation}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {book.issuedTo ? (
                        <div>
                          <div className="font-semibold text-slate-800">
                            {book.issuedTo.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Due: {book.issuedTo.dueDate}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Section 23: Working Issue / Return Buttons */}
                    <td className="px-3 py-3 text-right">
                      {isAvailable ? (
                        <button
                          onClick={() => handleOpenIssueModal(book.id)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1"
                        >
                          <BookPlus className="w-3.5 h-3.5" />
                          <span>Issue Book</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => returnBook(book.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return Book</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Modal */}
      {issueModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIssueModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Issue Library Book</h3>
              </div>
              <button
                onClick={() => setIssueModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmIssue} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Selected Book
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                  {books.find((b) => b.id === selectedBookToIssue)?.title} [
                  {books.find((b) => b.id === selectedBookToIssue)?.bookCode}]
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Student Name (Borrower)
                </label>
                <input
                  type="text"
                  value={issueStudentName}
                  onChange={(e) => setIssueStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma or Student 14"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Class / Section
                </label>
                <input
                  type="text"
                  value={issueClass}
                  onChange={(e) => setIssueClass(e.target.value)}
                  placeholder="e.g. Class 10-B"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-900 text-[11px] leading-relaxed">
                Loan duration: 14 days. Automatic reminders sent to guardian contact 2 days prior to due date.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

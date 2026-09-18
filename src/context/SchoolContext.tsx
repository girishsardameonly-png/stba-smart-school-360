import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  TabType,
  RoomData,
  EnergyMetrics,
  BusItem,
  RouteDetail,
  StudentRecord,
  ClassAttendanceSummary,
  BookItem,
  OverdueBookRecord,
  AlertItem,
  ActivityLog,
  SchoolSettings,
  AttendanceStatus,
} from '../types';
import {
  initialRooms,
  initialBuses,
  initialRoutes,
  initialStudents,
  initialClasses,
  initialBooks,
  initialOverdueBooks,
  initialAlerts,
  initialActivityLogs,
  initialSettings,
} from '../data/initialData';

interface OptimizationResult {
  roomName: string;
  savedKw: number;
  savedCost: number;
}

interface SchoolContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  targetId: string | null;
  setTargetId: (id: string | null) => void;
  navigateTo: (tab: TabType, targetId?: string) => void;

  // Settings
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  resetDemoData: () => void;

  // Energy
  rooms: RoomData[];
  energyMetrics: EnergyMetrics;
  optimizeRoom: (roomId: string) => OptimizationResult | null;
  toggleRoomAppliance: (roomId: string, appliance: 'lights' | 'fans' | 'ac') => void;
  toggleRoomOccupancy: (roomId: string) => void;
  lastOptimization: OptimizationResult | null;
  clearLastOptimization: () => void;

  // Transport
  buses: BusItem[];
  routes: RouteDetail[];
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
  advanceBusStop: (busId: string) => void;
  simulateBusDelay: (busId: string, reason?: string) => void;
  optimizeBusRoute: (busId: string) => void;

  // Attendance
  students: StudentRecord[];
  classes: ClassAttendanceSummary[];
  overallAttendance: {
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
    totalClasses: number;
  };
  updateStudentAttendance: (studentId: string, status: AttendanceStatus) => void;
  selectedClassFilter: string;
  setSelectedClassFilter: (className: string) => void;

  // Library
  books: BookItem[];
  overdueBooks: OverdueBookRecord[];
  libraryStats: {
    totalBooks: number;
    issued: number;
    available: number;
    overdue: number;
  };
  issueBook: (bookId: string, studentName: string, className: string, rollNo?: string) => boolean;
  returnBook: (bookId: string) => boolean;
  markOverdueReturned: (overdueId: string) => void;

  // Alerts
  alerts: AlertItem[];
  unreadAlertCount: number;
  markAlertRead: (alertId: string) => void;
  markAllAlertsRead: () => void;
  dismissAlert: (alertId: string) => void;

  // Activity Feed
  activityLogs: ActivityLog[];
  addActivityLog: (category: ActivityLog['category'], message: string, iconName?: string) => void;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_PREFIX = 'SMART_SCHOOL_360_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [targetId, setTargetId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastOptimization, setLastOptimization] = useState<OptimizationResult | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');

  // Persistence States
  const [settings, setSettings] = useState<SchoolSettings>(() =>
    loadFromStorage('settings', initialSettings)
  );
  const [rooms, setRooms] = useState<RoomData[]>(() =>
    loadFromStorage('rooms', initialRooms)
  );
  const [buses, setBuses] = useState<BusItem[]>(() =>
    loadFromStorage('buses', initialBuses)
  );
  const [students, setStudents] = useState<StudentRecord[]>(() =>
    loadFromStorage('students', initialStudents)
  );
  const [books, setBooks] = useState<BookItem[]>(() =>
    loadFromStorage('books', initialBooks)
  );
  const [overdueBooks, setOverdueBooks] = useState<OverdueBookRecord[]>(() =>
    loadFromStorage('overdueBooks', initialOverdueBooks)
  );
  const [alerts, setAlerts] = useState<AlertItem[]>(() =>
    loadFromStorage('alerts', initialAlerts)
  );
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    loadFromStorage('activityLogs', initialActivityLogs)
  );

  const [selectedBusId, setSelectedBusId] = useState<string>(() => buses[0]?.id || 'bus-1');

  // Sync to localStorage
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('rooms', rooms), [rooms]);
  useEffect(() => saveToStorage('buses', buses), [buses]);
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('books', books), [books]);
  useEffect(() => saveToStorage('overdueBooks', overdueBooks), [overdueBooks]);
  useEffect(() => saveToStorage('alerts', alerts), [alerts]);
  useEffect(() => saveToStorage('activityLogs', activityLogs), [activityLogs]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  const addActivityLog = useCallback(
    (category: ActivityLog['category'], message: string, iconName = 'Info') => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog: ActivityLog = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        time: timeStr,
        timestamp: Date.now(),
        category,
        message,
        iconName,
      };
      setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]); // Keep last 50
    },
    []
  );

  const navigateTo = useCallback((tab: TabType, target?: string) => {
    setActiveTab(tab);
    if (target) {
      setTargetId(target);
    }
  }, []);

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<SchoolSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      showToast('Settings saved successfully.');
      addActivityLog('system', 'School configuration updated', 'Settings');
    },
    [showToast, addActivityLog]
  );

  // Reset Demo Data
  const resetDemoData = useCallback(() => {
    setSettings(initialSettings);
    setRooms(initialRooms);
    setBuses(initialBuses);
    setStudents(initialStudents);
    setBooks(initialBooks);
    setOverdueBooks(initialOverdueBooks);
    setAlerts(initialAlerts);
    setActivityLogs(initialActivityLogs);
    setSelectedBusId('bus-1');
    setLastOptimization(null);
    showToast('Demo data restored to original prototype state.');
  }, [showToast]);

  // Recalculate Energy Metrics dynamically
  const energyMetrics: EnergyMetrics = useMemo(() => {
    const totalRoomKw = rooms.reduce((acc, r) => acc + r.powerKw, 0);
    // Add 4.5 kW for campus lighting, servers, water pumps, security sensors
    const currentUsageKw = Math.round((totalRoomKw + 3.2) * 10) / 10;
    // Base 142 kWh with dynamic delta
    const todayUsageKwh = Math.round((currentUsageKw * 7.6) * 10) / 10;
    const cost = Math.round(todayUsageKwh * settings.energyCostPerKwh);
    // Count optimized vs wastage
    const wastageCount = rooms.filter((r) => r.isWastage).length;
    const savingPercent = Math.max(5, Math.min(30, 22 - wastageCount * 5));
    const efficiencyScore = Math.max(50, Math.min(98, 96 - wastageCount * 8));

    return {
      currentUsageKw,
      todayUsageKwh,
      costPerKwh: settings.energyCostPerKwh,
      estimatedCostToday: cost,
      energySavingPercent: savingPercent,
      efficiencyScore,
    };
  }, [rooms, settings.energyCostPerKwh]);

  // Room Appliance Power Calculator
  const calculateRoomKw = (isOcc: boolean, lights: boolean, fans: boolean, ac: boolean, hasAc: boolean): number => {
    let kw = 0.15; // Standby sensor load
    if (lights) kw += 0.45;
    if (fans) kw += 0.55;
    if (ac && hasAc) kw += 1.65;
    if (isOcc) kw += 0.1;
    return Math.round(kw * 10) / 10;
  };

  // Optimize Room
  const optimizeRoom = useCallback(
    (roomId: string): OptimizationResult | null => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return null;

      const previousKw = room.powerKw;
      // Optimize: If room is empty, switch off all appliances. If occupied, switch off idle AC or keep comfortable.
      const updatedLights = false;
      const updatedFans = false;
      const updatedAc = false;
      const newKw = calculateRoomKw(room.isOccupied, updatedLights, updatedFans, updatedAc, room.hasAc);
      const savedKw = Math.max(0.2, Math.round((previousKw - newKw) * 10) / 10);
      const savedCost = Math.round(savedKw * settings.energyCostPerKwh * 100) / 100;

      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomId
            ? {
                ...r,
                lightsOn: updatedLights,
                fansOn: updatedFans,
                acOn: updatedAc,
                powerKw: newKw,
                isWastage: false,
                lastOptimized: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            : r
        )
      );

      // Remove energy alert for this room if exists
      setAlerts((prev) => prev.filter((a) => !(a.category === 'energy' && a.targetId === roomId)));

      const result: OptimizationResult = {
        roomName: room.name,
        savedKw,
        savedCost,
      };
      setLastOptimization(result);

      addActivityLog(
        'energy',
        `${room.name} optimized: Energy reduced by ${savedKw} kW (Est. saving ₹${savedCost})`,
        'Zap'
      );
      showToast(`Energy reduced by ${savedKw} kWh | Estimated saving: ₹${savedCost}`);
      return result;
    },
    [rooms, settings.energyCostPerKwh, addActivityLog, showToast]
  );

  const clearLastOptimization = useCallback(() => {
    setLastOptimization(null);
  }, []);

  // Toggle Room Appliance
  const toggleRoomAppliance = useCallback(
    (roomId: string, appliance: 'lights' | 'fans' | 'ac') => {
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== roomId) return room;
          const lights = appliance === 'lights' ? !room.lightsOn : room.lightsOn;
          const fans = appliance === 'fans' ? !room.fansOn : room.fansOn;
          const ac = appliance === 'ac' ? !room.acOn : room.acOn;
          const isWastage = !room.isOccupied && (lights || fans || ac);
          const powerKw = calculateRoomKw(room.isOccupied, lights, fans, ac, room.hasAc);

          return {
            ...room,
            lightsOn: lights,
            fansOn: fans,
            acOn: ac,
            powerKw,
            isWastage,
          };
        })
      );
    },
    []
  );

  // Toggle Room Occupancy
  const toggleRoomOccupancy = useCallback((roomId: string) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== roomId) return room;
        const newOccupied = !room.isOccupied;
        const isWastage = !newOccupied && (room.lightsOn || room.fansOn || room.acOn);
        const powerKw = calculateRoomKw(newOccupied, room.lightsOn, room.fansOn, room.acOn, room.hasAc);

        return {
          ...room,
          isOccupied: newOccupied,
          powerKw,
          isWastage,
        };
      })
    );
  }, []);

  // Transport: Advance Bus Stop
  const advanceBusStop = useCallback(
    (busId: string) => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.id !== busId) return bus;
          const totalStops = bus.stops.length;
          const nextIndex = bus.currentStopIndex + 1;

          if (nextIndex >= totalStops) {
            // Bus reached final destination (school or finished)
            const updatedStops = bus.routeStops.map((s, idx) => ({
              ...s,
              isPassed: true,
              isCurrent: idx === totalStops - 1,
            }));
            addActivityLog('transport', `Bus ${bus.plateNumber} completed trip and arrived at campus`, 'CheckCircle2');
            showToast(`Bus ${bus.plateNumber} arrived at destination.`);
            return {
              ...bus,
              currentStopIndex: totalStops - 1,
              status: 'At School',
              currentStop: bus.stops[totalStops - 1],
              nextStop: 'Trip Completed',
              eta: 'Arrived',
              speedKmH: 0,
              routeStops: updatedStops,
            };
          }

          const currentStopName = bus.stops[nextIndex];
          const upcomingStop = nextIndex + 1 < totalStops ? bus.stops[nextIndex + 1] : 'School Campus';
          const updatedStops = bus.routeStops.map((s, idx) => ({
            ...s,
            isPassed: idx < nextIndex,
            isCurrent: idx === nextIndex,
          }));

          const nextEtaHour = 8;
          const nextEtaMin = 10 + nextIndex * 9;
          const etaStr = `0${nextEtaHour}:${nextEtaMin < 10 ? '0' + nextEtaMin : nextEtaMin} AM`;

          addActivityLog('transport', `Bus ${bus.plateNumber} reached ${currentStopName}`, 'Bus');
          showToast(`Bus ${bus.plateNumber} advanced to ${currentStopName}`);

          return {
            ...bus,
            currentStopIndex: nextIndex,
            status: 'On Route',
            currentStop: currentStopName,
            nextStop: upcomingStop,
            eta: etaStr,
            routeStops: updatedStops,
          };
        })
      );
    },
    [addActivityLog, showToast]
  );

  // Transport: Simulate Delay
  const simulateBusDelay = useCallback(
    (busId: string, reason = 'Heavy traffic congestion reported on route') => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.id !== busId) return bus;
          return {
            ...bus,
            status: 'Delayed',
            isDelayed: true,
            hasAlternativeRoute: true,
            delayReason: reason,
            eta: bus.eta.includes('Delayed') ? bus.eta : `${bus.eta} (+15m Delay)`,
            speedKmH: 12,
          };
        })
      );

      const targetBus = buses.find((b) => b.id === busId);
      if (targetBus) {
        const newAlert: AlertItem = {
          id: 'alt-delay-' + Date.now(),
          category: 'transport',
          severity: 'high',
          title: 'TRANSPORT ALERT',
          description: `Bus ${targetBus.plateNumber} on ${targetBus.routeName} encountered a delay (${reason}).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          actionModule: 'transport',
          actionLabel: 'Open Transport',
          targetId: targetBus.id,
        };
        setAlerts((prev) => [newAlert, ...prev]);
        addActivityLog('transport', `Bus ${targetBus.plateNumber} marked Delayed: ${reason}`, 'AlertTriangle');
        showToast(`Delay simulated on Bus ${targetBus.plateNumber}. Alternative route available.`);
      }
    },
    [buses, addActivityLog, showToast]
  );

  // Transport: Optimize Route
  const optimizeBusRoute = useCallback(
    (busId: string) => {
      setBuses((prev) =>
        prev.map((bus) => {
          if (bus.id !== busId) return bus;
          const cleanedEta = bus.eta.replace(/\(\+15m Delay\)/g, '').trim();
          return {
            ...bus,
            status: 'On Route',
            isDelayed: false,
            hasAlternativeRoute: false,
            delayReason: undefined,
            eta: `${cleanedEta} (Optimized Bypass)`,
            speedKmH: 36,
          };
        })
      );

      // Remove delay alert for this bus
      setAlerts((prev) => prev.filter((a) => !(a.category === 'transport' && a.targetId === busId)));

      const targetBus = buses.find((b) => b.id === busId);
      addActivityLog('transport', `Alternative route engaged for Bus ${targetBus?.plateNumber || busId}. Delay mitigated.`, 'CheckCircle2');
      showToast(`Alternative route applied! Bus ETA recovered.`);
    },
    [buses, addActivityLog, showToast]
  );

  // Attendance: Recalculate classes & overall stats from students
  const { classes, overallAttendance } = useMemo(() => {
    // Map class data based on students
    const classSummaryMap: Record<string, { present: number; absent: number; late: number; total: number }> = {};

    initialClasses.forEach((c) => {
      const key = `${c.className}-${c.section}`;
      classSummaryMap[key] = {
        present: c.present,
        absent: c.absent,
        late: c.late,
        total: c.totalStudents,
      };
    });

    // Reconcile with updated student roster
    students.forEach((st) => {
      const key = `${st.className}-${st.section}`;
      if (classSummaryMap[key]) {
        // Find how many students in this class match in students state
        const classStudents = students.filter((s) => s.className === st.className && s.section === st.section);
        const presentCount = classStudents.filter((s) => s.status === 'Present').length;
        const absentCount = classStudents.filter((s) => s.status === 'Absent').length;
        const lateCount = classStudents.filter((s) => s.status === 'Late').length;

        // Scale by remaining baseline class size
        const knownCount = classStudents.length;
        const totalInClass = classSummaryMap[key].total;
        const baselineRemainder = Math.max(0, totalInClass - knownCount);
        // baseline remainder are roughly 95% present
        const baselinePresent = Math.round(baselineRemainder * 0.95);
        const baselineAbsent = baselineRemainder - baselinePresent;

        classSummaryMap[key].present = presentCount + baselinePresent;
        classSummaryMap[key].absent = absentCount + baselineAbsent;
        classSummaryMap[key].late = lateCount;
      }
    });

    const updatedClasses: ClassAttendanceSummary[] = initialClasses.map((c) => {
      const key = `${c.className}-${c.section}`;
      const data = classSummaryMap[key] || { present: c.present, absent: c.absent, late: c.late, total: c.totalStudents };
      const percentage = Math.round(((data.present + data.late * 0.8) / data.total) * 1000) / 10;
      return {
        ...c,
        present: data.present,
        absent: data.absent,
        late: data.late,
        percentage,
      };
    });

    const totalStudents = 1100;
    const totalPresent = updatedClasses.reduce((acc, c) => acc + c.present, 0) + (totalStudents - updatedClasses.reduce((acc, c) => acc + c.totalStudents, 0) * 0.95);
    const totalAbsent = updatedClasses.reduce((acc, c) => acc + c.absent, 0) + 22;
    const totalLate = updatedClasses.reduce((acc, c) => acc + c.late, 0) + 14;
    const overallPct = Math.round(((1026 + (totalPresent - 1026)) / 1100) * 1000) / 10;

    return {
      classes: updatedClasses,
      overallAttendance: {
        totalStudents: 1100,
        present: Math.round(totalPresent),
        absent: Math.round(totalAbsent),
        late: Math.round(totalLate),
        percentage: Math.min(99.9, Math.max(70.0, overallPct || 93.3)),
        totalClasses: 42,
      },
    };
  }, [students]);

  // Update Student Attendance
  const updateStudentAttendance = useCallback(
    (studentId: string, status: AttendanceStatus) => {
      const student = students.find((s) => s.id === studentId);
      if (!student) return;

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setStudents((prev) =>
        prev.map((st) =>
          st.id === studentId
            ? {
                ...st,
                status,
                lastMarkedTime: nowStr,
              }
            : st
        )
      );

      addActivityLog(
        'attendance',
        `${student.name} (${student.rollNo}) marked ${status}`,
        status === 'Present' ? 'CheckCircle2' : status === 'Absent' ? 'XCircle' : 'Clock'
      );
      showToast(`Updated ${student.name} to ${status}`);
    },
    [students, addActivityLog, showToast]
  );

  // Library stats
  const libraryStats = useMemo(() => {
    const totalBooks = 1267; // Catalog total
    const issuedInCatalog = books.filter((b) => b.status === 'Issued').length;
    // Base issued count 32 with dynamic offset
    const issued = 32 + (issuedInCatalog - 4);
    const available = totalBooks - issued;
    const overdue = overdueBooks.length;

    return {
      totalBooks,
      issued,
      available,
      overdue,
    };
  }, [books, overdueBooks]);

  // Issue Book
  const issueBook = useCallback(
    (bookId: string, studentName: string, className: string, rollNo = 'ST-REQ'): boolean => {
      const book = books.find((b) => b.id === bookId);
      if (!book || book.status === 'Issued') return false;

      const today = new Date();
      const dueDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      const issueDateStr = today.toISOString().split('T')[0];
      const dueDateStr = dueDate.toISOString().split('T')[0];

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? {
                ...b,
                status: 'Issued',
                issuedTo: {
                  studentId: 'st-temp-' + Date.now(),
                  studentName,
                  rollNo,
                  className,
                  issueDate: issueDateStr,
                  dueDate: dueDateStr,
                },
              }
            : b
        )
      );

      addActivityLog('library', `"${book.title}" issued to ${studentName} (${className})`, 'BookOpen');
      showToast(`"${book.title}" has been issued to ${studentName}.`);
      return true;
    },
    [books, addActivityLog, showToast]
  );

  // Return Book
  const returnBook = useCallback(
    (bookId: string): boolean => {
      const book = books.find((b) => b.id === bookId);
      if (!book) return false;

      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? {
                ...b,
                status: 'Available',
                issuedTo: undefined,
              }
            : b
        )
      );

      // Also remove from overdue if it was there
      setOverdueBooks((prev) => prev.filter((od) => od.bookId !== bookId));

      addActivityLog('library', `"${book.title}" returned to library shelf (${book.rackLocation})`, 'CheckCircle2');
      showToast(`"${book.title}" returned successfully.`);
      return true;
    },
    [books, addActivityLog, showToast]
  );

  // Mark Overdue Book Returned
  const markOverdueReturned = useCallback(
    (overdueId: string) => {
      const item = overdueBooks.find((od) => od.id === overdueId);
      if (!item) return;

      setOverdueBooks((prev) => prev.filter((od) => od.id !== overdueId));
      // Update book status if in books
      setBooks((prev) =>
        prev.map((b) => (b.id === item.bookId ? { ...b, status: 'Available', issuedTo: undefined } : b))
      );

      addActivityLog('library', `Overdue book "${item.bookTitle}" marked returned by ${item.studentName}`, 'CheckCircle2');
      showToast(`Overdue book "${item.bookTitle}" marked returned.`);
    },
    [overdueBooks, addActivityLog, showToast]
  );

  // Alert management
  const unreadAlertCount = useMemo(() => alerts.filter((a) => !a.isRead).length, [alerts]);

  const markAlertRead = useCallback((alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    showToast('All alerts marked as read.');
  }, [showToast]);

  const dismissAlert = useCallback(
    (alertId: string) => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
      showToast('Alert dismissed.');
    },
    [showToast]
  );

  // Simulated live sensor data tick (every 14 seconds when enabled)
  useEffect(() => {
    if (!settings.enableAutoSimulation) return;

    const interval = setInterval(() => {
      // Very subtle fluctuation in active buses' speeds or slight room power drift
      setBuses((prev) =>
        prev.map((b) => {
          if (b.status === 'On Route') {
            const speedDelta = Math.floor(Math.random() * 5) - 2;
            const newSpeed = Math.max(22, Math.min(48, b.speedKmH + speedDelta));
            return { ...b, speedKmH: newSpeed };
          }
          return b;
        })
      );
    }, 14000);

    return () => clearInterval(interval);
  }, [settings.enableAutoSimulation]);

  return (
    <SchoolContext.Provider
      value={{
        activeTab,
        setActiveTab,
        targetId,
        setTargetId,
        navigateTo,

        settings,
        updateSettings,
        resetDemoData,

        rooms,
        energyMetrics,
        optimizeRoom,
        toggleRoomAppliance,
        toggleRoomOccupancy,
        lastOptimization,
        clearLastOptimization,

        buses,
        routes: initialRoutes,
        selectedBusId,
        setSelectedBusId,
        advanceBusStop,
        simulateBusDelay,
        optimizeBusRoute,

        students,
        classes,
        overallAttendance,
        updateStudentAttendance,
        selectedClassFilter,
        setSelectedClassFilter,

        books,
        overdueBooks,
        libraryStats,
        issueBook,
        returnBook,
        markOverdueReturned,

        alerts,
        unreadAlertCount,
        markAlertRead,
        markAllAlertsRead,
        dismissAlert,

        activityLogs,
        addActivityLog,

        isSearchOpen,
        setIsSearchOpen,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

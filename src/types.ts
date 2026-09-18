export type TabType =
  | 'dashboard'
  | 'energy'
  | 'transport'
  | 'attendance'
  | 'library'
  | 'analytics'
  | 'alerts'
  | 'settings';

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertCategory = 'energy' | 'transport' | 'attendance' | 'library' | 'system';

export interface AlertItem {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionModule: TabType;
  actionLabel: string;
  targetId?: string;
}

export interface RoomData {
  id: string;
  name: string;
  building: string;
  floor: string;
  isOccupied: boolean;
  lightsOn: boolean;
  fansOn: boolean;
  acOn: boolean;
  hasAc: boolean;
  powerKw: number; // kW current draw
  isWastage: boolean;
  lastOptimized?: string;
}

export interface EnergyMetrics {
  currentUsageKw: number; // e.g. 18.7 kW
  todayUsageKwh: number; // e.g. 142 kWh
  costPerKwh: number; // e.g. 8 (INR)
  estimatedCostToday: number; // ₹
  energySavingPercent: number; // e.g. 12%
  efficiencyScore: number; // e.g. 88
}

export type BusStatus = 'On Route' | 'At School' | 'Delayed' | 'Completed';

export interface BusStop {
  name: string;
  scheduledTime: string;
  isPassed: boolean;
  isCurrent: boolean;
}

export interface BusItem {
  id: string;
  plateNumber: string; // e.g. RJ-07-SB-1024
  routeName: string; // Route A
  driverName: string;
  driverPhone: string;
  status: BusStatus;
  studentsCount: number;
  capacity: number;
  currentStopIndex: number;
  stops: string[];
  currentStop: string;
  nextStop: string;
  eta: string;
  speedKmH: number;
  isDelayed: boolean;
  hasAlternativeRoute: boolean;
  delayReason?: string;
  routeStops: BusStop[];
}

export interface RouteDetail {
  id: string;
  name: string;
  description: string;
  busPlate: string;
  stops: string[];
  totalDistanceKm: number;
  estimatedDurationMin: number;
  activeStudents: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  className: string;
  section: string;
  status: AttendanceStatus;
  guardianPhone: string;
  lastMarkedTime: string;
}

export interface ClassAttendanceSummary {
  className: string;
  section: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
  teacher: string;
  room: string;
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  bookCode: string;
  status: 'Available' | 'Issued';
  isbn: string;
  rackLocation: string;
  issuedTo?: {
    studentId: string;
    studentName: string;
    rollNo: string;
    className: string;
    issueDate: string;
    dueDate: string;
  };
}

export interface OverdueBookRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  studentRoll: string;
  className: string;
  dueDate: string;
  daysOverdue: number;
  fineAmount: number;
}

export interface ActivityLog {
  id: string;
  time: string;
  timestamp: number;
  category: 'energy' | 'transport' | 'attendance' | 'library' | 'system';
  message: string;
  iconName: string;
}

export interface SchoolSettings {
  schoolName: string;
  campusTitle: string;
  attendanceThresholdPercent: number; // e.g. 75
  energyCostPerKwh: number; // e.g. 8.00
  enableAutoSimulation: boolean;
  soundAlertsEnabled: boolean;
  lowAttendanceAlerts: boolean;
  energyWastageAlerts: boolean;
  transportDelayAlerts: boolean;
}

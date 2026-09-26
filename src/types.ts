// ─── ENUMS / UNIONS ───────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'faculty' | 'student';
export type UserStatus = 'active' | 'inactive';
export type RiskLevel = 'low' | 'medium' | 'high';
export type WarningSeverity = 'low' | 'medium' | 'high';
export type WarningStatus = 'open' | 'acknowledged' | 'resolved';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type NotificationType = 'info' | 'warning' | 'success' | 'error';
export type AttendanceTrend = 'improving' | 'declining' | 'stable' | 'irregular';

// ─── CORE ENTITIES ────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headFacultyId?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semester: number;
  facultyId: string;
  totalClassesHeld: number;
}

export interface Faculty {
  id: string;
  facultyId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  subjectIds: string[];
  status: UserStatus;
  joinedDate: string;
  qualification: string;
  experience: number;
}

export interface Student {
  id: string;
  studentId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  courseId: string;
  semester: number;
  rollNumber: string;
  status: UserStatus;
  joinedDate: string;
  gender?: string;
  dateOfBirth?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semesters: number[];
  subjectIds: string[];
  facultyIds: string[];
  studentIds: string[];
  description?: string;
}

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────
export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  markedAt: string;
}

export interface StudentSubjectAttendance {
  studentId: string;
  subjectId: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  lastUpdated: string;
}

export interface StudentOverallAttendance {
  studentId: string;
  overallPercentage: number;
  totalClasses: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  subjectAttendances: StudentSubjectAttendance[];
  trend: AttendanceTrend;
  weeklyData: { week: string; percentage: number }[];
}

// ─── RISK & WARNINGS ──────────────────────────────────────────────────────────
export interface RiskRecord {
  id: string;
  studentId: string;
  level: RiskLevel;
  score: number;
  reason: string;
  factors: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Warning {
  id: string;
  warningId: string;
  studentId: string;
  issuedByFacultyId: string;
  type: string;
  title: string;
  message: string;
  severity: WarningSeverity;
  status: WarningStatus;
  reason: string;
  riskFactors: string[];
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolvedNote?: string;
}

export interface Notification {
  id: string;
  targetUserId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SystemSettings {
  institutionName: string;
  academicYear: string;
  attendanceLowThreshold: number;
  attendanceMediumThreshold: number;
  workingDaysPerWeek: number;
  autoWarningEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  riskRecalculationFrequency: string;
  sessionTimeout: number;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  studentCount: number;
  avgAttendance: number;
  highRiskCount: number;
  mediumRiskCount: number;
  openWarnings: number;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Notification } from '../types';
import {
  warnings as mockWarnings,
  notifications as mockNotifications,
  students as mockStudents,
  riskRecords as mockRiskRecords,
  studentOverallAttendances as mockStudentAttendances,
} from '../data/mockData';
import { api } from '../services/api';

type StudentOverallAttendance = (typeof mockStudentAttendances)[number];

interface AppContextType {
  warnings: typeof mockWarnings;
  notifications: Notification[];
  students: Student[];
  riskRecords: typeof mockRiskRecords;
  studentAttendances: StudentOverallAttendance[];

  // helpers
  getUnreadCount: (userId: string) => number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  // mutations
  addStudent: (student: Student, password?: string) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  updateAttendance: (studentId: string, percentage: number) => void;
  issueManualWarning: (studentId: string, title: string, message: string, severity: 'low'|'medium'|'high') => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const customStudentsRaw = localStorage.getItem('custom_students');
  const customStudents = customStudentsRaw ? JSON.parse(customStudentsRaw) : [];
  
  const customWarningsRaw = localStorage.getItem('custom_warnings');
  const customWarnings = customWarningsRaw ? JSON.parse(customWarningsRaw) : [];
  
  const customNotifsRaw = localStorage.getItem('custom_notifications');
  const customNotifs = customNotifsRaw ? JSON.parse(customNotifsRaw) : [];
  
  const [warnings, setWarnings] = useState([...mockWarnings, ...customWarnings]);
  const [notifications, setNotifications] = useState<Notification[]>([...mockNotifications, ...customNotifs]);
  const [students, setStudents] = useState<Student[]>([...mockStudents, ...customStudents]);
  const [riskRecords] = useState(mockRiskRecords);
  
  // Custom attendances from local storage
  const customAttRaw = localStorage.getItem('custom_attendances');
  const customAtt = customAttRaw ? JSON.parse(customAttRaw) : {};
  const [studentAttendances, setStudentAttendances] = useState<StudentOverallAttendance[]>(
    mockStudentAttendances.map(a => 
      customAtt[a.studentId] ? { ...a, overallPercentage: customAtt[a.studentId] } : a
    )
  );

  // Sync with backend API if token is present
  const refreshData = async () => {
    const token = localStorage.getItem('campusguard_token');
    if (!token) return;

    try {
      const [stuRes, warnRes, notifRes] = await Promise.allSettled([
        api.students.list({ limit: 100 }),
        api.warnings.list(),
        api.notifications.list(),
      ]);

      if (stuRes.status === 'fulfilled' && stuRes.value.success && stuRes.value.data.length > 0) {
        // Merge backend data with local data so we don't lose the 200 mock students
        setStudents(prev => {
           const backendIds = new Set(stuRes.value.data.map((s: any) => s.id));
           const filteredPrev = prev.filter(s => !backendIds.has(s.id));
           return [...filteredPrev, ...(stuRes.value.data as Student[])];
        });
      }

      if (warnRes.status === 'fulfilled' && warnRes.value.success && warnRes.value.data.length > 0) {
        setWarnings(prev => {
           const backendIds = new Set(warnRes.value.data.map((w: any) => w.id));
           const filteredPrev = prev.filter(w => !backendIds.has(w.id));
           return [...filteredPrev, ...(warnRes.value.data as any)];
        });
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.success && notifRes.value.data.length > 0) {
        setNotifications(prev => {
           const backendIds = new Set(notifRes.value.data.map((n: any) => n.id));
           const filteredPrev = prev.filter(n => !backendIds.has(n.id));
           return [...filteredPrev, ...(notifRes.value.data as any)];
        });
      }
    } catch (e) {
      console.warn('Could not sync with backend data:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getUnreadCount = (userId: string) =>
    notifications.filter((n) => (!n.targetUserId || n.targetUserId === userId) && !n.read).length;

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.notifications.markRead(id);
    } catch {
      // offline fallback
    }
  };

  const markAllNotificationsRead = async (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (!n.targetUserId || n.targetUserId === userId ? { ...n, read: true } : n))
    );
    try {
      await api.notifications.markAllRead();
    } catch {
      // offline fallback
    }
  };

  const addStudent = async (student: Student, password?: string) => {
    setStudents((prev) => [student, ...prev]);
    const customStudentsRaw = localStorage.getItem('custom_students');
    const customStudents = customStudentsRaw ? JSON.parse(customStudentsRaw) : [];
    customStudents.push(student);
    localStorage.setItem('custom_students', JSON.stringify(customStudents));
    
    try {
      // Map frontend fields to backend schema
      const backendPayload = {
        ...student,
        rollNo: student.rollNumber,
        department: student.departmentId || 'Unknown',
        section: student.courseId || 'A',
        password // pass the password for user provisioning!
      };
      await api.students.create(backendPayload);
    } catch (e) {
      console.warn('Failed to persist student to backend:', e);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    // Also save to localStorage
    const customStudentsRaw = localStorage.getItem('custom_students');
    if (customStudentsRaw) {
      let customStudents = JSON.parse(customStudentsRaw);
      const index = customStudents.findIndex((s: any) => s.id === id);
      if (index !== -1) {
        customStudents[index] = { ...customStudents[index], ...updates };
        localStorage.setItem('custom_students', JSON.stringify(customStudents));
      }
    }
    try {
      await api.students.update(id, updates);
    } catch (e) {
      console.warn('Failed to persist student updates to backend:', e);
    }
  };

  const updateAttendance = (studentId: string, percentage: number) => {
    setStudentAttendances(prev => {
      const next = prev.map(a => a.studentId === studentId ? { ...a, overallPercentage: percentage } : a);
      if (!next.find(a => a.studentId === studentId)) {
        next.push({
          studentId, overallPercentage: percentage, totalClasses: 100, totalPresent: percentage,
          totalAbsent: 100 - percentage, totalLate: 0, subjectAttendances: [], trend: 'stable', weeklyData: []
        });
      }
      return next;
    });

    const customAttRaw = localStorage.getItem('custom_attendances');
    const customAtt = customAttRaw ? JSON.parse(customAttRaw) : {};
    customAtt[studentId] = percentage;
    localStorage.setItem('custom_attendances', JSON.stringify(customAtt));

    // Automated Warning Generation for Medium/High Risk (< 75%)
    if (percentage < 75) {
      setWarnings(prev => {
        // Avoid duplicate active warnings for the same student
        if (prev.some(w => w.studentId === studentId && w.status === 'open')) {
          return prev;
        }

        const severity = percentage < 65 ? 'high' : 'medium';
        const newWarning = {
          id: `warn-auto-${Date.now()}`,
          warningId: `WRN-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId,
          issuedByFacultyId: 'system',
          type: 'critical_attendance',
          title: `Automated ${severity === 'high' ? 'High' : 'Medium'} Risk Alert`,
          message: `System automatically detected attendance drop to ${percentage}%.`,
          severity,
          status: 'open' as const,
          reason: `Attendance threshold breached. Current: ${percentage}%`,
          riskFactors: [`Attendance dropped to ${percentage}%`],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Push the warning to the real backend asynchronously
        api.warnings.create({
          studentId,
          title: newWarning.title,
          message: newWarning.message,
          level: severity,
          category: 'attendance'
        }).then(res => {
          if (res.emailPreviewUrl) {
            alert(`[SYSTEM AUTOMATION]\n\nA real ${severity.toUpperCase()} warning email was dispatched!\n\nView Email Preview:\n${res.emailPreviewUrl}`);
          }
        }).catch(e => console.error("Failed to push auto-warning to API:", e));

        const nextWarnings = [newWarning, ...prev];
        const localWarnings = nextWarnings.filter(w => String(w.id).startsWith('warn-'));
        localStorage.setItem('custom_warnings', JSON.stringify(localWarnings));
        return nextWarnings;
      });
      
      setNotifications(prev => {
        const severity = percentage < 65 ? 'high' : 'medium';
        const baseNotif = {
          title: `Automated ${severity === 'high' ? 'High' : 'Medium'} Risk Alert`,
          message: `System automatically generated warning for student due to attendance dropping to ${percentage}%.`,
          type: severity === 'high' ? 'alert' : 'warning' as const,
          read: false,
          date: new Date().toISOString()
        };
        
        // Generate for Admin
        const adminNotif = { ...baseNotif, id: `notif-admin-${Date.now()}`, targetUserId: 'u-admin-1' };
        
        // Generate for Student (try multiple ID formats to ensure they see it regardless of how they logged in)
        const studentNotif1 = { ...baseNotif, id: `notif-stu1-${Date.now()}`, targetUserId: studentId };
        const studentNotif2 = { ...baseNotif, id: `notif-stu2-${Date.now()}`, targetUserId: `u-${studentId}` };
        
        const nextNotifs = [adminNotif, studentNotif1, studentNotif2, ...prev];
        const localNotifs = nextNotifs.filter(n => String(n.id).startsWith('notif-'));
        localStorage.setItem('custom_notifications', JSON.stringify(localNotifs));
        return nextNotifs;
      });
    }
  };

  const issueManualWarning = (studentId: string, title: string, message: string, severity: 'low'|'medium'|'high') => {
    const newWarning = {
      id: `warn-manual-${Date.now()}`,
      warningId: `WRN-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId,
      issuedByFacultyId: 'u-admin-1',
      type: 'attendance',
      title,
      message,
      severity,
      status: 'open' as const,
      reason: title,
      riskFactors: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // API Push
    api.warnings.create({
      studentId,
      title,
      message,
      level: severity,
      category: 'attendance'
    }).then(res => {
      if (res.emailPreviewUrl) {
        alert(`[MANUAL WARNING]\n\nA real ${severity.toUpperCase()} warning email was dispatched!\n\nView Email Preview:\n${res.emailPreviewUrl}`);
      }
    }).catch(e => console.error("Failed to push warning to API:", e));

    setWarnings(prev => {
      const nextWarnings = [newWarning, ...prev];
      const localWarnings = nextWarnings.filter(w => String(w.id).startsWith('warn-'));
      localStorage.setItem('custom_warnings', JSON.stringify(localWarnings));
      return nextWarnings;
    });

    // Create Notification
    setNotifications(prev => {
      const baseNotif = {
        title: `Manual ${severity === 'high' ? 'High' : 'Medium'} Risk Warning`,
        message: `Admin issued a manual warning: ${title}`,
        type: severity === 'high' ? 'alert' : 'warning' as const,
        read: false,
        date: new Date().toISOString()
      };
      const adminNotif = { ...baseNotif, id: `notif-admin-${Date.now()}`, targetUserId: 'u-admin-1' };
      const studentNotif1 = { ...baseNotif, id: `notif-stu1-${Date.now()}`, targetUserId: studentId };
      const studentNotif2 = { ...baseNotif, id: `notif-stu2-${Date.now()}`, targetUserId: `u-${studentId}` };
      
      const nextNotifs = [adminNotif, studentNotif1, studentNotif2, ...prev];
      const localNotifs = nextNotifs.filter(n => String(n.id).startsWith('notif-'));
      localStorage.setItem('custom_notifications', JSON.stringify(localNotifs));
      return nextNotifs;
    });
  };

  return (
    <AppContext.Provider
      value={{
        warnings,
        notifications,
        students,
        riskRecords,
        studentAttendances,
        getUnreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        addStudent,
        updateStudent,
        updateAttendance,
        issueManualWarning,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

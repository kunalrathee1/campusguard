import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboard from './pages/admin/Dashboard';
import StudentsPage from './pages/admin/StudentsPage';
import StudentNewPage from './pages/admin/StudentNewPage';
import StudentDetailPage from './pages/admin/StudentDetailPage';
import FacultyPage from './pages/admin/FacultyPage';
import CoursesPage from './pages/admin/CoursesPage';
import AttendancePage from './pages/admin/AttendancePage';
import RiskOverviewPage from './pages/admin/RiskOverviewPage';
import WarningsPage from './pages/admin/WarningsPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import ReportsPage from './pages/admin/ReportsPage';
import UsersPage from './pages/admin/UsersPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

import FacultyDashboard from './pages/faculty/Dashboard';
import ClassesPage from './pages/faculty/ClassesPage';
import FacultyStudentsPage from './pages/faculty/StudentsPage';
import FacultyAttendancePage from './pages/faculty/AttendancePage';
import FacultyRiskPage from './pages/faculty/RiskPage';
import FacultyWarningsPage from './pages/faculty/WarningsPage';
import FacultyNotificationsPage from './pages/faculty/NotificationsPage';
import FacultyReportsPage from './pages/faculty/ReportsPage';
import FacultyProfilePage from './pages/faculty/ProfilePage';

import StudentDashboard from './pages/student/Dashboard';
import StudentAttendancePage from './pages/student/AttendancePage';
import StudentRiskPage from './pages/student/RiskPage';
import StudentWarningsPage from './pages/student/WarningsPage';
import StudentNotificationsPage from './pages/student/NotificationsPage';
import StudentProfilePage from './pages/student/ProfilePage';
import { NotFound } from './pages/errors/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            <Route element={<Layout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsPage />} />
              <Route path="/admin/students/new" element={<StudentNewPage />} />
              <Route path="/admin/students/:id" element={<StudentDetailPage />} />
              <Route path="/admin/faculty" element={<FacultyPage />} />
              <Route path="/admin/courses" element={<CoursesPage />} />
              <Route path="/admin/attendance" element={<AttendancePage />} />
              <Route path="/admin/risk" element={<RiskOverviewPage />} />
              <Route path="/admin/warnings" element={<WarningsPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
              
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              <Route path="/faculty/classes" element={<ClassesPage />} />
              <Route path="/faculty/classes/:id" element={<ClassesPage />} />
              <Route path="/faculty/students" element={<FacultyStudentsPage />} />
              <Route path="/faculty/students/:id" element={<StudentDetailPage />} />
              <Route path="/faculty/attendance" element={<FacultyAttendancePage />} />
              <Route path="/faculty/attendance/new" element={<FacultyAttendancePage />} />
              <Route path="/faculty/risk" element={<FacultyRiskPage />} />
              <Route path="/faculty/warnings" element={<FacultyWarningsPage />} />
              <Route path="/faculty/notifications" element={<FacultyNotificationsPage />} />
              <Route path="/faculty/reports" element={<FacultyReportsPage />} />
              <Route path="/faculty/profile" element={<FacultyProfilePage />} />
              
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/attendance" element={<StudentAttendancePage />} />
              <Route path="/student/risk" element={<StudentRiskPage />} />
              <Route path="/student/warnings" element={<StudentWarningsPage />} />
              <Route path="/student/notifications" element={<StudentNotificationsPage />} />
              <Route path="/student/profile" element={<StudentProfilePage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

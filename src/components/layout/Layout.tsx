import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/students/new': 'Add Student',
  '/admin/faculty': 'Faculty',
  '/admin/faculty/new': 'Add Faculty',
  '/admin/courses': 'Courses',
  '/admin/attendance': 'Attendance Overview',
  '/admin/attendance/import': 'Import Attendance',
  '/admin/risk': 'Risk Overview',
  '/admin/warnings': 'Warnings',
  '/admin/notifications': 'Notifications',
  '/admin/reports': 'Reports',
  '/admin/users': 'User Management',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/settings': 'Settings',
  '/faculty/dashboard': 'Dashboard',
  '/faculty/classes': 'My Classes',
  '/faculty/students': 'My Students',
  '/faculty/attendance': 'Attendance',
  '/faculty/attendance/new': 'Take Attendance',
  '/faculty/risk': 'Risk Overview',
  '/faculty/warnings': 'Warnings',
  '/faculty/notifications': 'Notifications',
  '/faculty/reports': 'Reports',
  '/faculty/profile': 'Profile',
  '/student/dashboard': 'Dashboard',
  '/student/attendance': 'My Attendance',
  '/student/risk': 'My Risk',
  '/student/warnings': 'My Warnings',
  '/student/notifications': 'Notifications',
  '/student/profile': 'Profile',
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Dynamic routes
  if (pathname.match(/\/admin\/students\/[^/]+/)) return 'Student Details';
  if (pathname.match(/\/admin\/faculty\/[^/]+/)) return 'Faculty Details';
  if (pathname.match(/\/admin\/courses\/[^/]+/)) return 'Course Details';
  if (pathname.match(/\/admin\/warnings\/[^/]+/)) return 'Warning Details';
  if (pathname.match(/\/faculty\/classes\/[^/]+/)) return 'Class Details';
  if (pathname.match(/\/faculty\/students\/[^/]+/)) return 'Student Details';
  return 'CampusGuard';
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

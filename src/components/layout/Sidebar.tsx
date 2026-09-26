import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  AlertTriangle, Bell, BarChart3, Settings, UserCheck, ClipboardCheck,
  ChevronLeft, ChevronRight, LogOut, Presentation, BookMarked,
  Shield, ScrollText, X
} from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

function getNavConfig(role: string, unreadCount: number): NavGroup[] {
  if (role === 'admin') {
    return [
      {
        items: [
          { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        ]
      },
      {
        title: 'People',
        items: [
          { to: '/admin/students', icon: <GraduationCap size={18} />, label: 'Students' },
          { to: '/admin/faculty', icon: <UserCheck size={18} />, label: 'Faculty' },
        ]
      },
      {
        title: 'Academic',
        items: [
          { to: '/admin/courses', icon: <BookOpen size={18} />, label: 'Courses' },
          { to: '/admin/attendance', icon: <ClipboardList size={18} />, label: 'Attendance' },
        ]
      },
      {
        title: 'Risk & Warnings',
        items: [
          { to: '/admin/risk', icon: <Shield size={18} />, label: 'Risk Overview' },
          { to: '/admin/warnings', icon: <AlertTriangle size={18} />, label: 'Warnings' },
        ]
      },
      {
        title: 'System',
        items: [
          { to: '/admin/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: unreadCount },
          { to: '/admin/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
          { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
          { to: '/admin/audit-logs', icon: <ScrollText size={18} />, label: 'Audit Logs' },
          { to: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
        ]
      },
    ];
  }

  if (role === 'faculty') {
    return [
      {
        items: [
          { to: '/faculty/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        ]
      },
      {
        title: 'Teaching',
        items: [
          { to: '/faculty/classes', icon: <Presentation size={18} />, label: 'My Classes' },
          { to: '/faculty/students', icon: <GraduationCap size={18} />, label: 'My Students' },
          { to: '/faculty/attendance', icon: <ClipboardCheck size={18} />, label: 'Attendance' },
        ]
      },
      {
        title: 'Monitoring',
        items: [
          { to: '/faculty/risk', icon: <Shield size={18} />, label: 'Risk' },
          { to: '/faculty/warnings', icon: <AlertTriangle size={18} />, label: 'Warnings' },
        ]
      },
      {
        title: 'Other',
        items: [
          { to: '/faculty/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: unreadCount },
          { to: '/faculty/reports', icon: <BarChart3 size={18} />, label: 'Reports' },
          { to: '/faculty/profile', icon: <Users size={18} />, label: 'Profile' },
        ]
      },
    ];
  }

  // student
  return [
    {
      items: [
        { to: '/student/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/student/attendance', icon: <ClipboardList size={18} />, label: 'My Attendance' },
        { to: '/student/risk', icon: <Shield size={18} />, label: 'My Risk' },
        { to: '/student/warnings', icon: <AlertTriangle size={18} />, label: 'My Warnings' },
        { to: '/student/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: unreadCount },
        { to: '/student/profile', icon: <BookMarked size={18} />, label: 'Profile' },
      ]
    }
  ];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { currentUser, role, logout } = useAuth();
  const { getUnreadCount } = useAppContext();
  const navigate = useNavigate();
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;
  const navGroups = role ? getNavConfig(role, unreadCount) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/60 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>CampusGuard</span>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Attendance System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 sidebar-scroll">
        {navGroups.map((group, gi) => (
          <div key={gi} className="mb-1">
            {group.title && !collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{group.title}</p>
            )}
            {group.title && collapsed && <div className="mx-3 my-1 h-px bg-slate-800" />}
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
                {!collapsed && item.badge ? (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
                {collapsed && item.badge ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                ) : null}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="shrink-0 border-t border-slate-800/60 p-3 space-y-1">
        {!collapsed && currentUser && (
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition">
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button onClick={onToggle} className="hidden lg:flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={onMobileClose} />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={onMobileClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col bg-slate-900 transition-sidebar shrink-0 ${collapsed ? 'w-16' : 'w-60'}`} style={{ minHeight: '100vh' }}>
        <NavContent />
      </div>
    </>
  );
}

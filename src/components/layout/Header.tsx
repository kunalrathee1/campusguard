import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import { Avatar } from '../ui';

interface HeaderProps {
  title: string;
  onMobileMenuOpen: () => void;
}

export function Header({ title, onMobileMenuOpen }: HeaderProps) {
  const { currentUser, role, logout } = useAuth();
  const { notifications, getUnreadCount, markAllNotificationsRead } = useAppContext();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;
  const myNotifs = currentUser
    ? notifications.filter(n => n.targetUserId === currentUser.id).slice(0, 6)
    : [];

  const profilePath = role === 'admin' ? '/admin/settings' : role === 'faculty' ? '/faculty/profile' : '/student/profile';
  const notifPath = `/${role}/notifications`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shrink-0 z-30 relative">
      {/* Mobile menu toggle */}
      <button onClick={onMobileMenuOpen} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500">
        <Menu size={20} />
      </button>

      {/* Title */}
      <h2 className="text-base font-semibold text-slate-800 truncate hidden sm:block" style={{ fontFamily: 'DM Sans, sans-serif' }}>{title}</h2>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => currentUser && markAllNotificationsRead(currentUser.id)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {myNotifs.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-8">No notifications</p>
                  ) : (
                    myNotifs.map(n => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${!n.read ? 'bg-indigo-50/30' : ''}`} onClick={() => { navigate(notifPath); setNotifOpen(false); }}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'} ${n.read ? 'opacity-0' : ''}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100">
                  <button onClick={() => { navigate(notifPath); setNotifOpen(false); }} className="text-xs text-indigo-600 hover:underline w-full text-center">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-slate-100 transition"
          >
            {currentUser && <Avatar name={currentUser.name} size="sm" />}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser?.name}</p>
              <p className="text-xs text-slate-400 capitalize leading-tight">{currentUser?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                <button onClick={() => { navigate(profilePath); setProfileOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <User size={15} /> Profile
                </button>
                {role === 'admin' && (
                  <button onClick={() => { navigate('/admin/settings'); setProfileOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Settings size={15} /> Settings
                  </button>
                )}
                <div className="my-1 border-t border-slate-100" />
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

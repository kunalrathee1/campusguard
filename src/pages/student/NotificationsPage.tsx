import React from 'react';
import { PageHeader, Card, NotificationItem, LoadingSpinner } from '../../components/ui';
import { Bell } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentNotificationsPage() {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead, students } = useAppContext();
  const student = students.find(s => s.email === currentUser?.email);

  const myNotifications = notifications
    .filter(n => n.targetUserId === currentUser?.id || (student && n.targetUserId === student.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!currentUser) {
    return <LoadingSpinner message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your attendance, risks, and important announcements"
        breadcrumb={['Student', 'Notifications']}
      />

      <Card padding="none">
        {myNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Bell className="w-10 h-10 opacity-30" />
            <p className="text-sm">You have no notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myNotifications.map(notification => (
              <div key={notification.id} className="p-4 hover:bg-slate-50 transition-colors">
                <NotificationItem
                  notification={notification}
                  onRead={() => markNotificationRead(notification.id)}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

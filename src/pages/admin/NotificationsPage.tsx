import React, { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';
import { PageHeader, Card, Button, Badge } from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, students } = useAppContext();
  const { currentUser } = useAuth();
  const [sendingId, setSendingId] = useState<string | null>(null);
  

  const handleMarkAll = () => {
    if (currentUser) markAllNotificationsRead(currentUser.id);
  };

  const handleForward = (notifId: string, studentName: string, email: string, phone: string, parentPhone: string) => {
    setSendingId(notifId);
    setTimeout(() => {
      setSendingId(null);
      alert(`Successfully sent Notification via Email to ${email} and via SMS to ${phone} (Student) & ${parentPhone} (Parent).`);
    }, 1000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <PageHeader
        title="Notifications Center"
        subtitle="System alerts, warning updates, and operational activity"
        breadcrumb={['System', 'Notifications']}
        actions={
          <Button variant="outline" icon={<CheckCheck size={16} />} onClick={handleMarkAll}>
            Mark All as Read
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={`transition ${notif.read ? 'opacity-80 bg-white' : 'bg-indigo-50/40 border-indigo-200'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'warning'
                      ? 'bg-amber-100 text-amber-600'
                      : notif.type === 'error'
                      ? 'bg-rose-100 text-rose-600'
                      : notif.type === 'success'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {notif.type === 'warning' ? (
                    <AlertTriangle size={18} />
                  ) : notif.type === 'error' ? (
                    <XCircle size={18} />
                  ) : notif.type === 'success' ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Info size={18} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-slate-400 mt-2">{notif.createdAt}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!notif.read && (
                  <Button size="xs" variant="ghost" onClick={() => markNotificationRead(notif.id)}>
                    Mark Read
                  </Button>
                )}
                {(() => {
                  const match = notif.message.match(/\((STU-\d+)\)/);
                  if (match && match[1]) {
                    const student = students.find(s => s.studentId === match[1]);
                    if (student) {
                      return (
                        <Button 
                          size="xs" 
                          variant="outline" 
                          icon={<Mail size={14} />} 
                          onClick={() => handleForward(notif.id, student.name, student.email, student.phone, student.guardianPhone)}
                          disabled={sendingId === notif.id}
                        >
                          {sendingId === notif.id ? 'Sending...' : 'Forward to Student/Parent'}
                        </Button>
                      );
                    }
                  }
                  return null;
                })()}
              </div>
            </div>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <p className="text-sm text-slate-500 text-center py-6">No notifications to display.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

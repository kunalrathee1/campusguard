import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, Bell, AlertTriangle, BookOpen, TrendingUp, CheckCircle, Info
} from 'lucide-react';
import {
  StatCard, Card, PageHeader, Table, Tr, Td,
  RiskBadge, AttendanceBar, Avatar, NotificationItem, LoadingSpinner, Badge
} from '../../components/ui';
import { AttendanceTrendChart } from '../../components/charts';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { subjects, departments, courses } from '../../data/mockData';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { students, studentAttendances, riskRecords, warnings, notifications, markNotificationRead } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const student = students.find(s => s.email === currentUser?.email);
  const attendance = student ? studentAttendances.find(a => a.studentId === student.id) : null;
  const risk = student ? riskRecords.find(r => r.studentId === student.id) : null;
  const studentWarnings = student ? warnings.filter(w => w.studentId === student.id && w.status === 'open') : [];
  const myNotifications = notifications
    .filter(n => n.targetUserId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const dept = student ? departments.find(d => d.id === student.departmentId) : null;
  const course = student ? courses.find(c => c.id === student.courseId) : null;

  const subjectRows = attendance?.subjectAttendances.map(sa => {
    const sub = subjects.find(s => s.id === sa.subjectId);
    return { ...sa, subjectName: sub?.name ?? 'Unknown', subjectCode: sub?.code ?? '' };
  }) ?? [];

  const riskColors = {
    low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-500' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-500' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' },
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
  if (!student) {
    return (
      <div className="py-16 text-center text-slate-500">
        <p>Could not load your profile data. Please contact support.</p>
      </div>
    );
  }

  const currentAttendance = attendance || { overallPercentage: 100, trend: 'stable' as const, totalPresent: 0, totalAbsent: 0, weeklyData: [], subjectAttendances: [] };
  const currentRisk = risk || { level: 'low' as const, reason: 'No data available yet.', factors: [], score: 0 };
  const riskStyle = riskColors[currentRisk.level];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${student.name.split(' ')[0]}!`}
        subtitle={`${course?.name ?? 'B.Tech'} · Semester ${student.semester} · ${dept?.code ?? ''} · ${student.rollNumber}`}
        breadcrumb={['Student', 'Dashboard']}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Overall Attendance"
          value={`${currentAttendance.overallPercentage}%`}
          icon={<BarChart2 className="w-5 h-5" />}
          accent={currentAttendance.overallPercentage >= 75 ? 'bg-emerald-50 text-emerald-600' : currentAttendance.overallPercentage >= 65 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
          change={`${currentAttendance.totalPresent} present · ${currentAttendance.totalAbsent} absent`}
          changeType="neutral"
        />
        <StatCard
          label="Risk Level"
          value={currentRisk.level.charAt(0).toUpperCase() + currentRisk.level.slice(1)}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={currentRisk.level === 'low' ? 'bg-emerald-50 text-emerald-600' : currentRisk.level === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
          change={`Score: ${currentRisk.score}/100`}
          changeType={currentRisk.level === 'low' ? 'up' : currentRisk.level === 'medium' ? 'neutral' : 'down'}
        />
        <StatCard
          label="Open Warnings"
          value={studentWarnings.length}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={studentWarnings.length === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}
          change={studentWarnings.length === 0 ? 'All clear!' : 'Action required'}
          changeType={studentWarnings.length === 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Unread Notifications"
          value={unreadCount}
          icon={<Bell className="w-5 h-5" />}
          accent="bg-blue-50 text-blue-600"
          change="Click to view"
          changeType="neutral"
        />
      </div>

      {/* Attendance Trend + Subject Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Attendance Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Weekly attendance percentage</p>
            </div>
            <Badge variant={currentAttendance.trend === 'improving' ? 'success' : currentAttendance.trend === 'declining' ? 'danger' : currentAttendance.trend === 'stable' ? 'info' : 'warning'}>
              {currentAttendance.trend.charAt(0).toUpperCase() + currentAttendance.trend.slice(1)}
            </Badge>
          </div>
          <AttendanceTrendChart data={currentAttendance.weeklyData} height={220} />
        </Card>

        {/* Subject Attendance */}
        <Card padding="none">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Subject-wise Attendance</h2>
            <p className="text-xs text-slate-400 mt-0.5">Current semester performance</p>
          </div>
          <Table headers={['Subject', 'Present/Total', 'Attendance']}>
            {subjectRows.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-sm text-slate-400">No subject data available</td></tr>
            ) : (
              subjectRows.map(row => (
                <Tr key={row.subjectId}>
                  <Td>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{row.subjectName}</p>
                      <p className="text-xs text-slate-400">{row.subjectCode}</p>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm text-slate-600">{row.present}/{row.totalClasses}</span>
                    {row.late > 0 && <span className="ml-1 text-xs text-amber-500">+{row.late}L</span>}
                  </Td>
                  <Td className="w-32">
                    <AttendanceBar percentage={row.percentage} />
                  </Td>
                </Tr>
              ))
            )}
          </Table>
        </Card>
      </div>

      {/* Risk Card + Notifications */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Risk Explanation */}
        <Card className={`border ${riskStyle.border} ${riskStyle.bg}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskStyle.bg} border ${riskStyle.border}`}>
              {currentRisk.level === 'low'
                ? <CheckCircle className={`w-5 h-5 ${riskStyle.icon}`} />
                : <AlertTriangle className={`w-5 h-5 ${riskStyle.icon}`} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-sm font-semibold ${riskStyle.text}`}>Your Risk Status</h3>
                <RiskBadge level={currentRisk.level} />
              </div>
              <p className={`text-sm ${riskStyle.text} mb-3`}>{currentRisk.reason}</p>
              <div className="space-y-1">
                {currentRisk.factors.length > 0 ? currentRisk.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${riskStyle.icon.replace('text-', 'bg-')}`} />
                    {f}
                  </div>
                )) : <div className="text-xs text-slate-500">No factors recorded</div>}
              </div>
              <div className={`mt-3 p-2 rounded-lg text-xs font-medium ${riskStyle.text} ${riskStyle.bg}`}>
                {currentRisk.level === 'low' && 'Keep up the great work! Your attendance is on track.'}
                {currentRisk.level === 'medium' && 'Warning: Please improve your attendance to avoid penalties.'}
                {currentRisk.level === 'high' && 'Critical: Contact your faculty advisor immediately!'}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-800">Recent Notifications</h2>
            <button
              onClick={() => navigate('/student/notifications')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all
            </button>
          </div>
          {myNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-400">
              <Bell className="w-8 h-8 opacity-40" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {myNotifications.map(n => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={() => markNotificationRead(n.id)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

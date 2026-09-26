import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, TrendingUp, AlertTriangle, Bell, BookOpen } from 'lucide-react';
import {
  StatCard, Card, PageHeader, Table, Tr, Td, Button,
  RiskBadge, SeverityBadge, StatusBadge, Avatar, LoadingSpinner
} from '../../components/ui';
import {
  WeeklyAttendanceChart, RiskDistributionChart,
  DepartmentAttendanceChart, WarningTrendChart
} from '../../components/charts';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  faculty, auditLogs, weeklyAttendanceTrend, warningTrend, departmentStats, departments, students as staticStudents
} from '../../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { warnings, notifications, students, riskRecords, studentAttendances } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const avgAttendance = studentAttendances.length
    ? Math.round(studentAttendances.reduce((s, a) => s + a.overallPercentage, 0) / studentAttendances.length)
    : 0;

  const highRiskCount = riskRecords.filter(r => r.level === 'high').length;
  const mediumRiskCount = riskRecords.filter(r => r.level === 'medium').length;
  const lowRiskCount = riskRecords.filter(r => r.level === 'low').length;
  const openWarnings = warnings.filter(w => w.status === 'open').length;
  const unreadNotifications = notifications.filter(
    n => n.targetUserId === (currentUser?.id ?? 'u-admin-1') && !n.read
  ).length;

  const highRiskStudents = riskRecords
    .filter(r => r.level === 'high')
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => {
      const student = students.find(s => s.id === r.studentId);
      const attendance = studentAttendances.find(a => a.studentId === r.studentId);
      const dept = departments.find(d => d.id === student?.departmentId);
      return { risk: r, student, attendance, dept };
    })
    .filter(x => x.student);

  const recentWarnings = [...warnings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const recentActivity = [...auditLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const deptChartData = departmentStats.map(d => ({ name: d.departmentName.split(' ')[0], attendance: d.avgAttendance }));

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="CampusGuard — Smart Attendance & Early Warning System"
        breadcrumb={['Admin', 'Dashboard']}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Students"
          value={students.length}
          icon={<GraduationCap className="w-5 h-5" />}
          accent="bg-indigo-50 text-indigo-600"
          change="Across all departments"
          changeType="neutral"
        />
        <StatCard
          label="Total Faculty"
          value={faculty.length}
          icon={<Users className="w-5 h-5" />}
          accent="bg-purple-50 text-purple-600"
          change="Active members"
          changeType="neutral"
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          accent="bg-emerald-50 text-emerald-600"
          change={avgAttendance >= 75 ? "Above threshold" : "Below threshold"}
          changeType={avgAttendance >= 75 ? "up" : "down"}
        />
        <StatCard
          label="High Risk"
          value={highRiskCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent="bg-red-50 text-red-600"
          change={`${mediumRiskCount} medium risk`}
          changeType={highRiskCount > 0 ? "down" : "neutral"}
        />
        <StatCard
          label="Open Warnings"
          value={openWarnings}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent="bg-amber-50 text-amber-600"
          change={`${warnings.filter(w => w.status === 'acknowledged').length} acknowledged`}
          changeType={openWarnings > 0 ? "down" : "neutral"}
        />
        <StatCard
          label="Unread Alerts"
          value={unreadNotifications}
          icon={<Bell className="w-5 h-5" />}
          accent="bg-blue-50 text-blue-600"
          change="Pending review"
          changeType={unreadNotifications > 0 ? "down" : "neutral"}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Attendance Trend</h3>
          <WeeklyAttendanceChart data={weeklyAttendanceTrend} height={220} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Risk Distribution</h3>
          <RiskDistributionChart low={lowRiskCount} medium={mediumRiskCount} high={highRiskCount} height={220} />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Department Attendance</h3>
          <DepartmentAttendanceChart data={deptChartData} height={200} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Warning Trend</h3>
          <WarningTrendChart data={warningTrend} height={200} />
        </Card>
      </div>

      {/* High Risk Students */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">High Risk Students</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/risk')}>View All</Button>
        </div>
        {highRiskStudents.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No high risk students</p>
        ) : (
          <Table headers={['Student', 'Department', 'Attendance', 'Risk Level', 'Action']}>
            {highRiskStudents.map(({ risk, student, attendance, dept }) => (
              <Tr key={risk.id} onClick={() => navigate(`/admin/students/${student!.id}`)}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={student!.name} size="sm" />
                    <div>
                      <p className="font-medium text-slate-800">{student!.name}</p>
                      <p className="text-xs text-slate-400">{student!.studentId}</p>
                    </div>
                  </div>
                </Td>
                <Td>{dept?.code ?? '—'}</Td>
                <Td>
                  <span className={`text-sm font-semibold ${(attendance?.overallPercentage ?? 0) < 65 ? 'text-red-600' : 'text-amber-600'}`}>
                    {attendance?.overallPercentage ?? 0}%
                  </span>
                </Td>
                <Td><RiskBadge level={risk.level} /></Td>
                <Td>
                  <Button variant="ghost" size="xs" onClick={e => { e.stopPropagation(); navigate(`/admin/students/${student!.id}`); }}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Warnings */}
        <Card padding="none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Recent Warnings</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/warnings')}>View All</Button>
          </div>
          <Table headers={['Warning ID', 'Student', 'Severity', 'Status']}>
            {recentWarnings.map(w => {
              const student = students.find(s => s.id === w.studentId);
              return (
                <Tr key={w.id} onClick={() => navigate(`/admin/warnings/${w.id}`)}>
                  <Td><span className="font-mono text-xs">{w.warningId}</span></Td>
                  <Td>{student?.name ?? 'Unknown'}</Td>
                  <Td><SeverityBadge severity={w.severity} /></Td>
                  <Td><StatusBadge status={w.status} /></Td>
                </Tr>
              );
            })}
          </Table>
        </Card>

        {/* Recent Activity */}
        <Card padding="none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-logs')}>View All</Button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map(log => (
              <div key={log.id} className="px-5 py-3 flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  log.action === 'CREATE' ? 'bg-emerald-500' :
                  log.action === 'UPDATE' ? 'bg-blue-500' :
                  log.action === 'DELETE' || log.action === 'DEACTIVATE' ? 'bg-red-500' :
                  log.action === 'RESOLVE' ? 'bg-emerald-500' :
                  log.action === 'ACKNOWLEDGE' ? 'bg-amber-500' :
                  'bg-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 line-clamp-1">{log.details}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {log.userName} · {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, ClipboardCheck, AlertTriangle, Bell,
  ChevronRight, CheckCircle, Clock, TrendingUp,
} from 'lucide-react';
import {
  StatCard, Card, PageHeader, LoadingSpinner, RiskBadge, SeverityBadge,
  StatusBadge, AttendanceBar, Avatar, NotificationItem, Badge,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import {
  faculty, subjects, students, departments,
  studentSubjectAttendances, getStudentRisk,
  FACULTY_STUDENT_IDS
} from '../../data/mockData';

// Simulated "today" taken subjects (DBMS taken, OS pending, Cloud taken, ML pending)
const TODAY_TAKEN: Record<string, boolean> = {
  'sub-001': true,
  'sub-002': false,
  'sub-009': true,
  'sub-014': false,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { warnings, notifications, riskRecords, markNotificationRead } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!currentUser) return null;
  
  const customFacRaw = localStorage.getItem('custom_faculty');
  const customFac = customFacRaw ? JSON.parse(customFacRaw) : [];
  const allFaculty = [...faculty, ...customFac];

  let fac = allFaculty.find(f => f.email === currentUser.email);
  if (!fac) {
    fac = {
      id: `fac-fallback-${currentUser.id}`,
      facultyId: 'FAC-UNKNOWN',
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: '',
      departmentId: 'dept-cse',
      designation: 'Faculty',
      qualification: '',
      experience: 1,
      status: 'active',
      joinedDate: '2024-01-01',
      subjectIds: []
    };
  }

  const mySubjects = subjects.filter(s => fac.subjectIds.includes(s.id));
  const myStudents = students.filter(s => FACULTY_STUDENT_IDS.includes(s.id));
  const myDept = departments.find(d => d.id === fac.departmentId);

  // Today's attendance stats
  const takenToday = Object.values(TODAY_TAKEN).filter(Boolean).length;
  const notTakenToday = mySubjects.length - takenToday;

  // At-risk students (medium + high) from faculty's students
  const atRiskStudents = myStudents.filter(s => {
    const risk = riskRecords.find(r => r.studentId === s.id);
    return risk && (risk.level === 'medium' || risk.level === 'high');
  });

  // Open warnings for faculty's students
  const myOpenWarnings = warnings.filter(
    w => FACULTY_STUDENT_IDS.includes(w.studentId) && w.status === 'open'
  );

  // All warnings for my students (for recent section)
  const myWarnings = warnings
    .filter(w => FACULTY_STUDENT_IDS.includes(w.studentId))
    .slice(0, 5);

  // Recent notifications for this faculty
  const myNotifications = notifications
    .filter(n => n.targetUserId === currentUser.id)
    .slice(0, 5);

  if (loading) return <LoadingSpinner message="Loading dashboard…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${fac.name}`}
        subtitle={`${fac.designation} · ${myDept?.name ?? ''} · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}`}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Classes"
          value={mySubjects.length}
          icon={<BookOpen className="w-5 h-5" />}
          accent="bg-indigo-50 text-indigo-600"
          change="4 active subjects"
          changeType="neutral"
        />
        <StatCard
          label="My Students"
          value={myStudents.length}
          icon={<Users className="w-5 h-5" />}
          accent="bg-blue-50 text-blue-600"
          change="CSE department"
          changeType="neutral"
        />
        <StatCard
          label="Today's Attendance"
          value={`${takenToday}/${mySubjects.length}`}
          icon={<ClipboardCheck className="w-5 h-5" />}
          accent={notTakenToday > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}
          change={notTakenToday > 0 ? `${notTakenToday} pending` : 'All recorded'}
          changeType={notTakenToday > 0 ? 'down' : 'up'}
        />
        <StatCard
          label="Students At Risk"
          value={atRiskStudents.length}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent={atRiskStudents.length > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}
          change={`${myOpenWarnings.length} open warning${myOpenWarnings.length !== 1 ? 's' : ''}`}
          changeType={myOpenWarnings.length > 0 ? 'down' : 'neutral'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Today's Classes</h2>
            <button
              onClick={() => navigate('/faculty/classes')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {mySubjects.map(sub => {
              const taken = TODAY_TAKEN[sub.id];
              return (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => navigate(`/faculty/classes/${sub.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${taken ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                      {taken
                        ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                        : <Clock className="w-4 h-4 text-amber-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{sub.name}</p>
                      <p className="text-xs text-slate-500">{sub.code} · Sem {sub.semester}</p>
                    </div>
                  </div>
                  <Badge variant={taken ? 'success' : 'warning'}>
                    {taken ? 'Taken' : 'Pending'}
                  </Badge>
                </div>
              );
            })}
          </div>
          {notTakenToday > 0 && (
            <button
              onClick={() => navigate('/faculty/attendance/new')}
              className="mt-3 w-full py-2 text-sm text-center text-indigo-600 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Take Attendance Now
            </button>
          )}
        </Card>

        {/* Students Requiring Attention */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Students Requiring Attention</h2>
            <button
              onClick={() => navigate('/faculty/risk')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {atRiskStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mb-2" />
              <p className="text-sm font-medium text-slate-600">All students are on track</p>
              <p className="text-xs text-slate-400 mt-1">No students require immediate attention</p>
            </div>
          ) : (
            <div className="space-y-3">
              {atRiskStudents.slice(0, 5).map(stu => {
                const risk = getStudentRisk(stu.id);
                const overallAtt = (() => {
                  const allAtt = studentSubjectAttendances.filter(a => a.studentId === stu.id);
                  if (!allAtt.length) return 0;
                  const totalP = allAtt.reduce((s, a) => s + a.present, 0);
                  const totalC = allAtt.reduce((s, a) => s + a.totalClasses, 0);
                  return totalC > 0 ? Math.round((totalP / totalC) * 100) : 0;
                })();
                return (
                  <div
                    key={stu.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/faculty/students/${stu.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={stu.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{stu.name}</p>
                        <p className="text-xs text-slate-500">{stu.studentId} · Sem {stu.semester}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {risk && <RiskBadge level={risk.level} />}
                      <span className="text-xs text-slate-500">{overallAtt}% attendance</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Warnings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Warnings</h2>
            <button
              onClick={() => navigate('/faculty/warnings')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {myWarnings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No warnings for your students</p>
          ) : (
            <div className="space-y-3">
              {myWarnings.map(w => {
                const stu = students.find(s => s.id === w.studentId);
                return (
                  <div key={w.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-50">
                    <div className="flex items-start gap-3">
                      {stu && <Avatar name={stu.name} size="sm" />}
                      <div>
                        <p className="text-sm font-medium text-slate-800">{w.title}</p>
                        <p className="text-xs text-slate-500">{stu?.name} · {new Date(w.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <SeverityBadge severity={w.severity} />
                      <StatusBadge status={w.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Notifications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Notifications</h2>
            <button
              onClick={() => navigate('/faculty/notifications')}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {myNotifications.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <Bell className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-400">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
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

      {/* Quick Attendance Stats */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">My Students — Attendance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {myStudents.map(stu => {
            const allAtt = studentSubjectAttendances.filter(a => a.studentId === stu.id);
            const totalP = allAtt.reduce((s, a) => s + a.present, 0);
            const totalC = allAtt.reduce((s, a) => s + a.totalClasses, 0);
            const pct = totalC > 0 ? Math.round((totalP / totalC) * 100) : 0;
            const risk = getStudentRisk(stu.id);
            return (
              <div
                key={stu.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all"
                onClick={() => navigate(`/faculty/students/${stu.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={stu.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{stu.name}</p>
                    <p className="text-xs text-slate-500">Sem {stu.semester}</p>
                  </div>
                  {risk && <RiskBadge level={risk.level} />}
                </div>
                <AttendanceBar percentage={pct} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

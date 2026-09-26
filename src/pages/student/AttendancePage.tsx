import React from 'react';
import { PageHeader, Card, Table, Tr, Td, AttendanceBar, LoadingSpinner } from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { subjects } from '../../data/mockData';

export default function StudentAttendancePage() {
  const { currentUser } = useAuth();
  const { students, studentAttendances } = useAppContext();

  const student = students.find(s => s.userId === currentUser?.id);
  const attendance = student ? studentAttendances.find(a => a.studentId === student.id) : null;

  if (!student) {
    return <LoadingSpinner message="Loading attendance data..." />;
  }
  
  const currentAttendance = attendance || { overallPercentage: 100, subjectAttendances: [] };

  const subjectRows = currentAttendance.subjectAttendances.map(sa => {
    const sub = subjects.find(s => s.id === sa.subjectId);
    return { ...sa, subjectName: sub?.name ?? 'Unknown', subjectCode: sub?.code ?? '' };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        subtitle="Detailed breakdown of your attendance across all subjects"
        breadcrumb={['Student', 'Attendance']}
      />

      <Card padding="none">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Subject-wise Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">Your attendance per subject for the current semester</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-slate-800">Overall: {currentAttendance.overallPercentage}%</span>
          </div>
        </div>
        <Table headers={['Subject', 'Present', 'Absent', 'Late', 'Percentage']}>
          {subjectRows.length === 0 ? (
            <tr><td colSpan={5} className="py-8 text-center text-sm text-slate-400">No subject data available</td></tr>
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
                  <span className="text-sm text-emerald-600 font-medium">{row.present}</span>
                </Td>
                <Td>
                  <span className="text-sm text-red-600 font-medium">{row.absent}</span>
                </Td>
                <Td>
                  <span className="text-sm text-amber-500 font-medium">{row.late}</span>
                </Td>
                <Td className="w-48">
                  <AttendanceBar percentage={row.percentage} />
                </Td>
              </Tr>
            ))
          )}
        </Table>
      </Card>
    </div>
  );
}

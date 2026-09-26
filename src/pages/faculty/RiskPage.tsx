import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ArrowRight, User, TrendingDown, CheckCircle } from 'lucide-react';
import {
  PageHeader, Card, Button, RiskBadge, AttendanceBar, Avatar, Select, Table, Tr, Td, Badge
} from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { departments, FACULTY_STUDENT_IDS } from '../../data/mockData';

export default function FacultyRiskPage() {
  const navigate = useNavigate();
  const { students, riskRecords, studentAttendances } = useAppContext();
  const [riskFilter, setRiskFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Only include students that belong to this faculty
  const facultyStudents = students.filter(s => FACULTY_STUDENT_IDS.includes(s.id));

  const riskStudents = facultyStudents.map((student) => {
    const risk = riskRecords.find((r) => r.studentId === student.id);
    const att = studentAttendances.find((a) => a.studentId === student.id);
    return {
      student,
      risk: risk || { level: 'low' as const, score: 15, reason: 'Regular attendance', factors: [] },
      attendance: att?.overallPercentage ?? 85,
    };
  });

  const filtered = riskStudents.filter((item) => {
    if (riskFilter && item.risk.level !== riskFilter) return false;
    if (deptFilter && item.student.departmentId !== deptFilter) return false;
    return true;
  });

  const criticalCount = riskStudents.filter((r) => r.risk.level === 'high' || r.risk.score >= 70).length;
  const mediumCount = riskStudents.filter((r) => r.risk.level === 'medium').length;
  const lowCount = riskStudents.filter((r) => r.risk.level === 'low').length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Students' Risk Overview"
        subtitle="AI-assisted risk scoring and predictive intervention for your students"
        breadcrumb={['Faculty', 'Risk Overview']}
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-rose-500">
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Critical Risk Students</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{criticalCount}</p>
          <p className="text-xs text-slate-500 mt-1">Requires immediate counselor outreach</p>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Moderate Risk</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{mediumCount}</p>
          <p className="text-xs text-slate-500 mt-1">Attendance between 75% – 80%</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Low Risk / In Good Standing</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{lowCount}</p>
          <p className="text-xs text-slate-500 mt-1">Healthy attendance patterns</p>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap gap-3">
          <Select
            options={[
              { value: '', label: 'All Risk Levels' },
              { value: 'high', label: 'High / Critical Risk' },
              { value: 'medium', label: 'Medium Risk' },
              { value: 'low', label: 'Low Risk' },
            ]}
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-44"
          />
        </div>

        <Table headers={['Student', 'Risk Assessment', 'Score', 'Attendance', 'Primary Risk Factors', 'Action']}>
          {filtered.length === 0 ? (
            <Tr>
              <Td colSpan={6} className="text-center py-8 text-slate-500">
                No students match the current filters.
              </Td>
            </Tr>
          ) : (
            filtered.map(({ student, risk, attendance }) => {
              const dept = departments.find((d) => d.id === student.departmentId);
              return (
                <Tr key={student.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={student.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.studentId} • {dept?.code}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <RiskBadge level={risk.level} />
                  </Td>
                  <Td>
                    <span className="font-bold text-slate-700">{risk.score}/100</span>
                  </Td>
                  <Td>
                    <div className="w-28">
                      <AttendanceBar percentage={attendance} />
                    </div>
                  </Td>
                  <Td>
                    <p className="text-xs text-slate-600 max-w-xs truncate">{risk.reason || 'Pattern analysis active'}</p>
                  </Td>
                  <Td>
                    <Button
                      size="xs"
                      variant="outline"
                      icon={<ArrowRight size={14} />}
                      onClick={() => navigate(`/faculty/students/${student.id}`)}
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              );
            })
          )}
        </Table>
      </Card>
    </div>
  );
}

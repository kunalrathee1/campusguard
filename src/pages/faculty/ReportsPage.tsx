import React from 'react';
import { Download, BookOpen, Users, TrendingUp } from 'lucide-react';
import { PageHeader, Card, Button } from '../../components/ui';
import { AttendanceTrendChart, RiskDistributionChart } from '../../components/charts';
import { weeklyAttendanceTrend, FACULTY_STUDENT_IDS } from '../../data/mockData';
import { useAppContext } from '../../context/AppContext';

export default function FacultyReportsPage() {
  const { students, riskRecords } = useAppContext();

  // Filter risk down to this faculty's students
  const myRiskRecords = riskRecords.filter(r => FACULTY_STUDENT_IDS.includes(r.studentId));
  const lowCount = myRiskRecords.filter(r => r.level === 'low').length;
  const mediumCount = myRiskRecords.filter(r => r.level === 'medium').length;
  const highCount = myRiskRecords.filter(r => r.level === 'high').length;
  const inGoodStanding = FACULTY_STUDENT_IDS.length - mediumCount - highCount; // approximation

  const handleExport = (reportName: string) => {
    alert(`Exporting ${reportName} report to CSV...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Analytical Reports"
        subtitle="Insights and trends across the subjects you teach"
        breadcrumb={['Faculty', 'Reports']}
        actions={
          <Button icon={<Download size={16} />} onClick={() => handleExport('My Students Full')}>
            Export Full Dataset
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="My Classes Attendance Trajectory (8-Week Trend)">
          <div className="h-64">
            <AttendanceTrendChart data={weeklyAttendanceTrend} />
          </div>
        </Card>

        <Card title="Student Risk Distribution">
          <div className="h-64">
            <RiskDistributionChart
              low={inGoodStanding}
              medium={mediumCount}
              high={highCount}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="Ready-to-Download Audit Reports">
          <div className="space-y-3">
            {[
              { title: 'Weekly Class Attendance Audit (PDF/CSV)', desc: 'Full log of all marked sessions and absentee rates for your subjects', size: '1.2 MB' },
              { title: 'Shortage & Exam Ineligibility List', desc: 'Your students with attendance under the 75% threshold', size: '420 KB' },
              { title: 'Medical Exceptions Summary', desc: 'Log of all uploaded doctor notes and excused absences', size: '890 KB' },
            ].map((r, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.desc} • {r.size}</p>
                </div>
                <Button size="xs" variant="outline" icon={<Download size={14} />} onClick={() => handleExport(r.title)}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

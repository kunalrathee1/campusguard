import React from 'react';
import { Download, FileText, TrendingUp, Users, ShieldAlert, BarChart3 } from 'lucide-react';
import { PageHeader, Card, Button } from '../../components/ui';
import { AttendanceTrendChart, DepartmentAttendanceChart, RiskDistributionChart } from '../../components/charts';
import { weeklyAttendanceTrend, departmentStats } from '../../data/mockData';

export default function ReportsPage() {
  const handleExport = (reportName: string) => {
    alert(`Exporting ${reportName} report to CSV...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytical Reports"
        subtitle="Institutional attendance trends, department benchmarks, and audit summaries"
        breadcrumb={['Admin', 'Reports']}
        actions={
          <Button icon={<Download size={16} />} onClick={() => handleExport('Comprehensive')}>
            Export Full Dataset
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Campus Attendance Trajectory (8-Week Trend)">
          <div className="h-64">
            <AttendanceTrendChart data={weeklyAttendanceTrend} />
          </div>
        </Card>

        <Card title="Department Attendance Breakdown">
          <div className="h-64">
            <DepartmentAttendanceChart data={departmentStats} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Risk Distribution Matrix" className="lg:col-span-1">
          <div className="h-56">
            <RiskDistributionChart
              low={12}
              medium={5}
              high={3}
            />
          </div>
        </Card>

        <Card title="Ready-to-Download Audit Reports" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { title: 'Weekly Attendance Audit (PDF/CSV)', desc: 'Full log of all marked sessions and absentee rates', size: '2.4 MB' },
              { title: 'Shortage & Exam Ineligibility List', desc: 'Students with attendance under 75% threshold', size: '840 KB' },
              { title: 'Department Faculty Engagement Report', desc: 'Class coverage and attendance submission regularity', size: '1.2 MB' },
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

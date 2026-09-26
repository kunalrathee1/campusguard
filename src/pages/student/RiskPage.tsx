import React from 'react';
import { PageHeader, Card, RiskBadge, LoadingSpinner } from '../../components/ui';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentRiskPage() {
  const { currentUser } = useAuth();
  const { students, riskRecords } = useAppContext();

  const student = students.find(s => s.userId === currentUser?.id);
  const risk = student ? riskRecords.find(r => r.studentId === student.id) : null;

  if (!student) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const riskColors = {
    low: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-500' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-500' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' },
  };

  const currentRisk = risk || { level: 'low' as const, reason: 'No data available yet.', factors: [], score: 0 };
  const riskStyle = riskColors[currentRisk.level];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Risk Assessment"
        subtitle="Understand your current academic standing and attendance risk"
        breadcrumb={['Student', 'Risk Assessment']}
      />

      <Card className={`border ${riskStyle.border} ${riskStyle.bg} p-6`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${riskStyle.bg} border ${riskStyle.border}`}>
            {currentRisk.level === 'low'
              ? <CheckCircle className={`w-6 h-6 ${riskStyle.icon}`} />
              : <AlertTriangle className={`w-6 h-6 ${riskStyle.icon}`} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-lg font-semibold ${riskStyle.text}`}>Current Risk Level</h3>
              <RiskBadge level={currentRisk.level} />
            </div>
            <p className={`text-sm ${riskStyle.text} mb-4`}>{currentRisk.reason}</p>
            
            <h4 className={`text-sm font-semibold ${riskStyle.text} mb-2`}>Contributing Factors:</h4>
            <ul className="space-y-2 mb-4">
              {currentRisk.factors.length > 0 ? currentRisk.factors.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className={`w-2 h-2 rounded-full ${riskStyle.icon.replace('text-', 'bg-')}`} />
                  {f}
                </li>
              )) : <li className="text-sm text-slate-500">None</li>}
            </ul>
            
            <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${riskStyle.text} ${riskStyle.bg} border ${riskStyle.border}`}>
              {currentRisk.level === 'low' && 'Keep up the great work! Your attendance is on track.'}
              {currentRisk.level === 'medium' && 'Warning: Please improve your attendance to avoid penalties.'}
              {currentRisk.level === 'high' && 'Critical: Contact your faculty advisor immediately!'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

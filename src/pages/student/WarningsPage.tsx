import React from 'react';
import { PageHeader, Card, Table, Tr, Td, Badge, LoadingSpinner } from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function StudentWarningsPage() {
  const { currentUser } = useAuth();
  const { students, warnings } = useAppContext();

  const student = students.find(s => s.email === currentUser?.email);
  const myWarnings = student ? warnings.filter(w => w.studentId === student.id) : [];

  if (!student) {
    return <LoadingSpinner message="Loading warnings..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Warnings"
        subtitle="Official attendance warnings and disciplinary notices"
        breadcrumb={['Student', 'Warnings']}
      />

      <Card padding="none">
        <Table headers={['Date', 'Type', 'Severity', 'Status', 'Message']}>
          {myWarnings.length === 0 ? (
            <tr><td colSpan={5} className="py-12 text-center text-slate-500">You have no warnings on record. Great job!</td></tr>
          ) : (
            myWarnings.map(warning => (
              <Tr key={warning.id}>
                <Td className="whitespace-nowrap">
                  <span className="text-sm text-slate-600">{new Date(warning.issuedAt).toLocaleDateString()}</span>
                </Td>
                <Td>
                  <span className="text-sm font-medium text-slate-800 capitalize">{warning.type}</span>
                </Td>
                <Td>
                  <Badge variant={warning.severity === 'critical' ? 'danger' : warning.severity === 'moderate' ? 'warning' : 'info'}>
                    {warning.severity}
                  </Badge>
                </Td>
                <Td>
                  <Badge variant={warning.status === 'open' ? 'danger' : warning.status === 'acknowledged' ? 'warning' : 'success'}>
                    {warning.status}
                  </Badge>
                </Td>
                <Td>
                  <p className="text-sm text-slate-600 max-w-md truncate">{warning.message}</p>
                </Td>
              </Tr>
            ))
          )}
        </Table>
      </Card>
    </div>
  );
}

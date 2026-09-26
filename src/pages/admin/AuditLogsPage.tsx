import React from 'react';
import { PageHeader, Card, Table, Tr, Td, Badge } from '../../components/ui';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        subtitle="Track system actions and security events"
        breadcrumb={['Admin', 'Audit Logs']}
      />

      <Card padding="none">
        <Table headers={['Timestamp', 'User', 'Action', 'Status', 'Details']}>
          <Tr>
            <Td><span className="text-sm text-slate-600">2026-09-26 10:23 AM</span></Td>
            <Td><span className="text-sm font-medium text-slate-800">Admin User</span></Td>
            <Td><span className="text-sm text-slate-600">Updated Attendance Settings</span></Td>
            <Td><Badge variant="success">Success</Badge></Td>
            <Td><span className="text-sm text-slate-500">Changed late penalty threshold</span></Td>
          </Tr>
          <Tr>
            <Td><span className="text-sm text-slate-600">2026-09-26 09:15 AM</span></Td>
            <Td><span className="text-sm font-medium text-slate-800">Faculty Smith</span></Td>
            <Td><span className="text-sm text-slate-600">Marked Attendance</span></Td>
            <Td><Badge variant="success">Success</Badge></Td>
            <Td><span className="text-sm text-slate-500">Class CS-101 (35 Present, 2 Absent)</span></Td>
          </Tr>
          <Tr>
            <Td><span className="text-sm text-slate-600">2026-09-25 04:30 PM</span></Td>
            <Td><span className="text-sm font-medium text-slate-800">System</span></Td>
            <Td><span className="text-sm text-slate-600">Generated Weekly Reports</span></Td>
            <Td><Badge variant="success">Success</Badge></Td>
            <Td><span className="text-sm text-slate-500">Sent to all department heads</span></Td>
          </Tr>
        </Table>
      </Card>
    </div>
  );
}

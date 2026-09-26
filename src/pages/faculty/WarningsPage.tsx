import React, { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Badge, Modal, Input, Alert
} from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { warnings as initialWarnings, FACULTY_STUDENT_IDS } from '../../data/mockData';
import type { Warning } from '../../types';

export default function FacultyWarningsPage() {
  const { students } = useAppContext();
  const [warningsList, setWarningsList] = useState<Warning[]>(initialWarnings.filter(w => FACULTY_STUDENT_IDS.includes(w.studentId)));
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  
  const facultyStudents = students.filter(s => FACULTY_STUDENT_IDS.includes(s.id));

  const [form, setForm] = useState({
    studentId: '',
    title: '',
    message: '',
    severity: 'medium' as const,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const filtered = warningsList.filter((w) => {
    const student = students.find((s) => s.id === w.studentId);
    const q = search.toLowerCase();
    if (q && !w.title.toLowerCase().includes(q) && !(student?.name.toLowerCase().includes(q))) return false;
    if (severityFilter && w.severity !== severityFilter) return false;
    if (statusFilter && w.status !== statusFilter) return false;
    return true;
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.studentId) e.studentId = 'Select a student to issue warning to';
    if (!form.title.trim()) e.title = 'Warning title is required';
    if (!form.message.trim()) e.message = 'Warning description is required';
    return e;
  };

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newWarn: Warning = {
      id: `w-${Date.now()}`,
      warningId: `WARN-${Date.now()}`,
      studentId: form.studentId,
      issuedByFacultyId: 'u-fac-1',
      type: 'attendance',
      title: form.title.trim(),
      message: form.message.trim(),
      severity: form.severity,
      status: 'open',
      reason: form.title.trim(),
      riskFactors: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setWarningsList((prev) => [newWarn, ...prev]);
    setIsIssueOpen(false);
    setForm({ studentId: '', title: '', message: '', severity: 'medium' });
    setErrors({});
    setSuccess('Warning issued and student notified.');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleAcknowledge = (id: string) => {
    setWarningsList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'acknowledged' as const, acknowledgedAt: new Date().toISOString().split('T')[0] } : w))
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Students' Warnings"
        subtitle="Manage and issue attendance and academic warning notices for your students"
        breadcrumb={['Faculty', 'Warnings']}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsIssueOpen(true)}>
            Issue Warning
          </Button>
        }
      />

      {success && <Alert type="success" title="Success" message={success} />}

      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by warning title or student name..."
              className="flex-1"
            />
          </div>
          <FilterRow>
            <Select
              options={[
                { value: '', label: 'All Severities' },
                { value: 'high', label: 'High / Critical' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low / Info' },
              ]}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-44"
            />
            <Select
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'open', label: 'Open' },
                { value: 'acknowledged', label: 'Resolved' },
                { value: 'resolved', label: 'Resolved' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            />
          </FilterRow>
        </div>

        <Table headers={['Student', 'Notice Title', 'Severity', 'Issued Date', 'Status', 'Action']}>
          {filtered.length === 0 ? (
            <Tr>
              <Td colSpan={6} className="text-center py-8 text-slate-500">
                You have no warnings on record for your students. Great job!
              </Td>
            </Tr>
          ) : (
            filtered.map((w) => {
              const student = students.find((s) => s.id === w.studentId);
              return (
                <Tr key={w.id}>
                  <Td>
                    <p className="font-semibold text-slate-800">{student?.name || 'Student'}</p>
                    <p className="text-xs text-slate-400">{student?.studentId}</p>
                  </Td>
                  <Td>
                    <p className="font-medium text-slate-700">{w.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{w.message}</p>
                  </Td>
                  <Td>
                    {w.severity === 'high' ? (
                      <Badge variant="danger">High</Badge>
                    ) : w.severity === 'medium' ? (
                      <Badge variant="warning">Medium</Badge>
                    ) : (
                      <Badge variant="secondary">Low</Badge>
                    )}
                  </Td>
                  <Td>{w.createdAt}</Td>
                  <Td>
                    {w.status === 'acknowledged' ? (
                      <Badge variant="success">Resolved</Badge>
                    ) : w.status === 'resolved' ? (
                      <Badge variant="primary">Resolved</Badge>
                    ) : (
                      <Badge variant="warning">Open</Badge>
                    )}
                  </Td>
                  <Td>
                    {w.status === 'open' && (
                      <Button size="xs" variant="outline" onClick={() => handleAcknowledge(w.id)}>
                        Mark Resolved
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })
          )}
        </Table>
      </Card>

      <Modal open={isIssueOpen} onClose={() => setIsIssueOpen(false)} title="Issue Warning Notice">
        <form onSubmit={handleIssue} className="space-y-4">
          <Select
            label="Target Student"
            value={form.studentId}
            onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
            options={[
              { value: '', label: 'Select student' },
              ...facultyStudents.map((s) => ({ value: s.id, label: `${s.name} (${s.studentId})` })),
            ]}
            error={errors.studentId}
          />
          <Input
            label="Warning Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Attendance Shortage in Database Management"
            error={errors.title}
            required
          />
          <Input
            label="Warning Description / Instructions"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Attendance has fallen below 75%. Please contact your faculty advisor."
            error={errors.message}
            required
          />
          <Select
            label="Severity Level"
            value={form.severity}
            onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as any }))}
            options={[
              { value: 'low', label: 'Low (Advisory)' },
              { value: 'medium', label: 'Medium (Warning)' },
              { value: 'high', label: 'High (Critical / Action Required)' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsIssueOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Issue Notice</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

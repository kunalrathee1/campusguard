import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, UserX } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Pagination, Avatar, AttendanceBar,
  RiskBadge, StatusBadge, ConfirmDialog, LoadingSpinner, EmptyState
} from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { departments } from '../../data/mockData';

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const navigate = useNavigate();
  const { students, riskRecords, studentAttendances, updateStudent } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
      if (deptFilter && s.departmentId !== deptFilter) return false;
      if (semFilter && s.semester !== parseInt(semFilter)) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (riskFilter) {
        const risk = riskRecords.find(r => r.studentId === s.id);
        if (!risk || risk.level !== riskFilter) return false;
      }
      return true;
    });
  }, [students, search, deptFilter, semFilter, riskFilter, statusFilter, riskRecords]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeactivate = () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    setTimeout(() => {
      updateStudent(deactivateTarget, { status: 'inactive' });
      setDeactivating(false);
      setDeactivateTarget(null);
    }, 400);
  };

  const deactivateStudent = students.find(s => s.id === deactivateTarget);

  if (loading) return <LoadingSpinner message="Loading students..." />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Students"
        subtitle={`${students.length} students enrolled`}
        breadcrumb={['Admin', 'Students']}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/admin/students/new')}>
            Add Student
          </Button>
        }
      />

      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={v => { setSearch(v); setPage(1); }}
              placeholder="Search by name, ID, email..."
              className="flex-1"
            />
          </div>
          <FilterRow>
            <Select
              options={[{ value: '', label: 'All Departments' }, ...departments.map(d => ({ value: d.id, label: d.code }))]}
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
              className="w-40"
            />
            <Select
              options={[{ value: '', label: 'All Semesters' }, ...[1,2,3,4,5,6,7,8].map(s => ({ value: String(s), label: `Semester ${s}` }))]}
              value={semFilter}
              onChange={e => { setSemFilter(e.target.value); setPage(1); }}
              className="w-36"
            />
            <Select
              options={[{ value: '', label: 'All Risk Levels' }, { value: 'low', label: 'Low Risk' }, { value: 'medium', label: 'Medium Risk' }, { value: 'high', label: 'High Risk' }]}
              value={riskFilter}
              onChange={e => { setRiskFilter(e.target.value); setPage(1); }}
              className="w-36"
            />
            <Select
              options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-32"
            />
          </FilterRow>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <Table headers={['Student ID', 'Name', 'Department', 'Semester', 'Attendance', 'Risk', 'Status', 'Actions']}>
              {paginated.map(student => {
                const risk = riskRecords.find(r => r.studentId === student.id);
                const attendance = studentAttendances.find(a => a.studentId === student.id);
                const dept = departments.find(d => d.id === student.departmentId);
                return (
                  <Tr key={student.id}>
                    <Td><span className="font-mono text-xs text-slate-500">{student.studentId}</span></Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Avatar name={student.name} size="sm" />
                        <div>
                          <p className="font-medium text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>{dept?.code ?? '—'}</Td>
                    <Td>Sem {student.semester}</Td>
                    <Td>
                      <div className="w-32">
                        <AttendanceBar percentage={attendance?.overallPercentage ?? 0} />
                      </div>
                    </Td>
                    <Td>{risk ? <RiskBadge level={risk.level} /> : '—'}</Td>
                    <Td><StatusBadge status={student.status} /></Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={<UserX className="w-3.5 h-3.5" />}
                          onClick={() => setDeactivateTarget(student.id)}
                          disabled={student.status === 'inactive'}
                          className="text-red-500 hover:text-red-600"
                        >
                          Deactivate
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Table>
            <div className="px-4 border-t border-slate-100">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={PAGE_SIZE}
                totalItems={filtered.length}
              />
            </div>
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="Deactivate Student"
        message={`Are you sure you want to deactivate ${deactivateStudent?.name}? They will lose access to the system.`}
        confirmLabel="Deactivate"
        variant="danger"
        loading={deactivating}
      />
    </div>
  );
}

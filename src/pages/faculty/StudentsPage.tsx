import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, GraduationCap, ArrowRight } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Pagination, Avatar, AttendanceBar,
  RiskBadge, StatusBadge, LoadingSpinner, EmptyState
} from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { departments, FACULTY_STUDENT_IDS } from '../../data/mockData';

const PAGE_SIZE = 10;

export default function FacultyStudentsPage() {
  const navigate = useNavigate();
  const { students, riskRecords, studentAttendances } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [page, setPage] = useState(1);

  // Pre-filter students to only those in the faculty's classes
  const myStudents = useMemo(() => students.filter(s => FACULTY_STUDENT_IDS.includes(s.id)), [students]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return myStudents.filter(s => {
      const q = search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q) && !s.email.toLowerCase().includes(q)) return false;
      if (deptFilter && s.departmentId !== deptFilter) return false;
      if (semFilter && s.semester !== parseInt(semFilter)) return false;
      if (riskFilter) {
        const risk = riskRecords.find(r => r.studentId === s.id);
        if (!risk || risk.level !== riskFilter) return false;
      }
      return true;
    });
  }, [myStudents, search, deptFilter, semFilter, riskFilter, riskRecords]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <LoadingSpinner message="Loading your students..." />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="My Students"
        subtitle={`Managing ${myStudents.length} students across your classes`}
        breadcrumb={['Faculty', 'My Students']}
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
          </FilterRow>
        </div>

        {paginated.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            <Table headers={['Student ID', 'Name', 'Department', 'Semester', 'Attendance', 'Risk', 'Actions']}>
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
                    <Td>
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/faculty/students/${student.id}`)}
                      >
                        Profile
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Table>
            {totalPages > 1 && (
              <div className="px-4 border-t border-slate-100">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  pageSize={PAGE_SIZE}
                  totalItems={filtered.length}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

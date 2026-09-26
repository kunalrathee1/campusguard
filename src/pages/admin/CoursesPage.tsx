import React, { useState } from 'react';
import { Plus, BookOpen, Layers, Users } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Badge, Modal, Input, Alert
} from '../../components/ui';
import { courses as initialCourses, departments, subjects } from '../../data/mockData';
import type { Course } from '../../types';

export default function CoursesPage() {
  const [coursesList, setCoursesList] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    departmentId: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const filtered = coursesList.filter((c) => {
    const q = search.toLowerCase();
    if (q && !c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
    if (deptFilter && c.departmentId !== deptFilter) return false;
    return true;
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Course name is required';
    if (!form.code.trim()) e.code = 'Course code is required (e.g. BTECH-CSE)';
    if (!form.departmentId) e.departmentId = 'Department is required';
    return e;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      departmentId: form.departmentId,
      description: form.description,
      semesters: [1, 2, 3, 4, 5, 6, 7, 8],
      subjectIds: [],
      facultyIds: [],
      studentIds: [],
    };

    setCoursesList((prev) => [newCourse, ...prev]);
    setIsAddOpen(false);
    setForm({ name: '', code: '', departmentId: '', description: '' });
    setErrors({});
    setSuccess(`Course ${newCourse.name} added successfully.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Courses & Curriculum"
        subtitle={`${coursesList.length} academic programs offered`}
        breadcrumb={['Admin', 'Courses']}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>
            Add Course
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
              placeholder="Search courses by code or title..."
              className="flex-1"
            />
          </div>
          <FilterRow>
            <Select
              options={[{ value: '', label: 'All Departments' }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-56"
            />
          </FilterRow>
        </div>

        <Table headers={['Course Program', 'Code', 'Department', 'Duration', 'Subjects', 'Enrolled']}>
          {filtered.map((c) => {
            const dept = departments.find((d) => d.id === c.departmentId);
            const courseSubs = subjects.filter((s) => s.departmentId === c.departmentId);
            return (
              <Tr key={c.id}>
                <Td>
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  {c.description && <p className="text-xs text-slate-400 line-clamp-1">{c.description}</p>}
                </Td>
                <Td>
                  <Badge variant="primary">{c.code}</Badge>
                </Td>
                <Td>{dept?.name || '—'}</Td>
                <Td>{c.semesters.length} Semesters (4 Yrs)</Td>
                <Td>{courseSubs.length} Subjects</Td>
                <Td>
                  <span className="font-medium text-slate-700">{c.studentIds?.length || 40}+ Students</span>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Card>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Course Program">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Course Program Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Bachelor of Technology in Computer Science"
            error={errors.name}
            required
          />
          <Input
            label="Course Code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="BTECH-CSE"
            error={errors.code}
            required
          />
          <Select
            label="Department"
            value={form.departmentId}
            onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
            options={[{ value: '', label: 'Select department' }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
            error={errors.departmentId}
          />
          <Input
            label="Description (Optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Comprehensive undergraduate degree program in computer systems."
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

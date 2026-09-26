import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, Card, Input, Select, Button, Alert } from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { departments, courses } from '../../data/mockData';
import type { Student, User } from '../../types';

function generateStudentId(existing: Student[]) {
  const max = existing.reduce((m, s) => {
    const n = parseInt(s.studentId.replace('STU-', '')) || 0;
    return Math.max(m, n);
  }, 1000);
  return `STU-${max + 1}`;
}

export default function StudentNewPage() {
  const navigate = useNavigate();
  const { students, addStudent } = useAppContext();
  const { registerUser } = useAuth();

  const [form, setForm] = useState({
    studentId: generateStudentId(students),
    password: '',
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    courseId: '',
    semester: '1',
    rollNumber: '',
    status: 'active' as 'active' | 'inactive',
    gender: '',
    dateOfBirth: '',
    guardianName: '',
    guardianPhone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredCourses = courses.filter(c => !form.departmentId || c.departmentId === form.departmentId);

  const set = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => { const next = { ...e }; delete next[key]; return next; });
    if (key === 'departmentId') setForm(f => ({ ...f, [key]: value, courseId: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.password.trim()) e.password = 'Password is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (!form.departmentId) e.departmentId = 'Department is required';
    if (!form.courseId) e.courseId = 'Course is required';
    if (!form.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setTimeout(() => {
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        studentId: form.studentId,
        userId: `u-stu-${Date.now()}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        departmentId: form.departmentId,
        courseId: form.courseId,
        semester: parseInt(form.semester),
        rollNumber: form.rollNumber.trim(),
        status: form.status,
        joinedDate: new Date().toISOString().split('T')[0],
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        guardianName: form.guardianName || undefined,
        guardianPhone: form.guardianPhone || undefined,
      };
      
      const newUserObj: User = {
        id: newStudent.userId,
        name: newStudent.name,
        email: newStudent.email,
        role: 'student',
        avatar: undefined
      };

      addStudent(newStudent);
      registerUser(newStudent.email, form.password, newUserObj);
      
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate('/admin/students'), 1200);
    }, 500);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <PageHeader
        title="Add New Student"
        subtitle="Create a new student record"
        breadcrumb={['Admin', 'Students', 'New']}
        actions={
          <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/admin/students')}>
            Back
          </Button>
        }
      />

      {success && <Alert type="success" title="Student Created" message="Student record created successfully. Redirecting..." />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student ID"
              value={form.studentId}
              readOnly
              hint="Auto-generated"
              className="bg-slate-50"
            />
            <Input
              label="Full Name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Aarav Mehta"
              error={errors.name}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="student@university.edu"
              error={errors.email}
              required
            />
            <Input
              label="Login Password"
              type="password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="Enter temporary password"
              error={errors.password}
              required
            />
            <Input
              label="Phone Number"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+91-9XXXXXXXXX"
              error={errors.phone}
              required
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={e => set('gender', e.target.value)}
              options={[{ value: '', label: 'Select gender' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={e => set('dateOfBirth', e.target.value)}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              value={form.departmentId}
              onChange={e => set('departmentId', e.target.value)}
              options={[{ value: '', label: 'Select department' }, ...departments.map(d => ({ value: d.id, label: d.name }))]}
              error={errors.departmentId}
            />
            <Select
              label="Course"
              value={form.courseId}
              onChange={e => set('courseId', e.target.value)}
              options={[{ value: '', label: 'Select course' }, ...filteredCourses.map(c => ({ value: c.id, label: c.name }))]}
              error={errors.courseId}
            />
            <Select
              label="Semester"
              value={form.semester}
              onChange={e => set('semester', e.target.value)}
              options={[1,2,3,4,5,6,7,8].map(s => ({ value: String(s), label: `Semester ${s}` }))}
            />
            <Input
              label="Roll Number"
              value={form.rollNumber}
              onChange={e => set('rollNumber', e.target.value)}
              placeholder="e.g. CSE-4-001"
              error={errors.rollNumber}
              required
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => set('status', e.target.value as 'active' | 'inactive')}
              options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Guardian Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Guardian Name"
              value={form.guardianName}
              onChange={e => set('guardianName', e.target.value)}
              placeholder="Guardian's full name"
            />
            <Input
              label="Guardian Phone"
              value={form.guardianPhone}
              onChange={e => set('guardianPhone', e.target.value)}
              placeholder="+91-9XXXXXXXXX"
            />
          </div>
        </Card>

        <div className="flex justify-end gap-3 pb-4">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/students')}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create Student</Button>
        </div>
      </form>
    </div>
  );
}

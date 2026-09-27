import React, { useState, useMemo } from 'react';
import { Plus, Mail, Phone, Award, BookOpen, Search, UserCheck } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Avatar, StatusBadge, Modal, Input, Alert
} from '../../components/ui';
import { faculty as initialFaculty, departments, subjects } from '../../data/mockData';
import type { Faculty } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>(initialFaculty);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { registerUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: 'Assistant Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: '5',
    password: '',
    subjectId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFacultyId, setEditingFacultyId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    qualification: '',
    experience: '',
    subjectId: '', // Added to allow assigning a specific subject
  });

  const filtered = useMemo(() => {
    return facultyList.filter((f) => {
      const q = search.toLowerCase();
      if (q && !f.name.toLowerCase().includes(q) && !f.email.toLowerCase().includes(q) && !f.designation.toLowerCase().includes(q)) {
        return false;
      }
      if (deptFilter && f.departmentId !== deptFilter) return false;
      return true;
    });
  }, [facultyList, search, deptFilter]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.departmentId) e.departmentId = 'Department selection is required';
    if (!form.password.trim()) e.password = 'Password is required to create a login account';
    return e;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    let realUserId = `u-fac-${Date.now()}`;

    // 1. Create User in Backend for real login access
    try {
      // dynamic import of api inside the component action to avoid top-level import conflicts if any
      const { api } = await import('../../services/api');
      const res = await api.auth.register({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        role: 'faculty',
        department: form.departmentId
      });
      if (res && res.success && res.user) {
        realUserId = res.user.id;
      }
    } catch (e) {
      console.warn("Failed to create faculty user in backend:", e);
    }

    const newFac: Faculty = {
      id: `fac-${Date.now()}`,
      facultyId: `FAC-${1000 + facultyList.length + 1}`,
      userId: realUserId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      departmentId: form.departmentId,
      designation: form.designation,
      qualification: form.qualification,
      experience: parseInt(form.experience) || 1,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      subjectIds: form.subjectId ? [form.subjectId] : [],
    };

    // 2. Register local storage fallback
    registerUser(form.email.trim(), form.password, {
      id: newFac.userId,
      name: newFac.name,
      email: newFac.email,
      role: 'faculty',
      avatar: '',
    });

    // Update global mock data array so they exist across pages in this session
    initialFaculty.push(newFac);
    try {
      const customFacRaw = localStorage.getItem('custom_faculty');
      const customFac = customFacRaw ? JSON.parse(customFacRaw) : [];
      customFac.push(newFac);
      localStorage.setItem('custom_faculty', JSON.stringify(customFac));
    } catch(e) {}

    setFacultyList((prev) => [newFac, ...prev]);
    setIsAddOpen(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      departmentId: '',
      designation: 'Assistant Professor',
      qualification: 'Ph.D.',
      experience: '5',
      password: '',
      subjectId: '',
    });
    setErrors({});
    setSuccessMsg(`Faculty member ${newFac.name} added successfully.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Faculty Directory"
        subtitle={`${facultyList.length} faculty members registered`}
        breadcrumb={['Admin', 'Faculty']}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>
            Add Faculty
          </Button>
        }
      />

      {successMsg && <Alert type="success" title="Success" message={successMsg} />}

      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search faculty by name, designation, email..."
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

        <Table headers={['Faculty Member', 'Department', 'Designation', 'Experience', 'Contact', 'Status', 'Action']}>
          {filtered.map((f) => {
            const dept = departments.find((d) => d.id === f.departmentId);
            // Display their assigned subject if they have one
            const assignedSubject = f.subjectIds?.[0] ? subjects.find(s => s.id === f.subjectIds[0]) : null;
            return (
              <Tr key={f.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={f.name} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-800">{f.name}</p>
                      <p className="text-xs text-slate-400">{f.facultyId}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <p className="font-medium text-slate-700">{dept?.name || '—'}</p>
                  {assignedSubject && (
                    <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1">
                      <BookOpen size={12} /> {assignedSubject.name}
                    </p>
                  )}
                </Td>
                <Td>
                  <span className="font-medium text-slate-700">{f.designation}</span>
                  <p className="text-[11px] text-slate-400">{f.qualification}</p>
                </Td>
                <Td>{f.experience} yrs</Td>
                <Td>
                  <p className="text-xs text-slate-700">{f.email}</p>
                  <p className="text-xs text-slate-400">{f.phone}</p>
                </Td>
                <Td>
                  <StatusBadge status={f.status} />
                </Td>
                <Td>
                  <Button size="xs" variant="outline" onClick={() => {
                    setEditingFacultyId(f.id);
                    setEditForm({
                      name: f.name,
                      email: f.email,
                      phone: f.phone,
                      departmentId: f.departmentId,
                      designation: f.designation,
                      qualification: f.qualification,
                      experience: String(f.experience),
                      subjectId: f.subjectIds?.[0] || '',
                    });
                    setIsEditOpen(true);
                  }}>
                    Edit Profile
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Card>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Faculty Member">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Dr. Sarah Connor"
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="sarah.c@campusguard.edu"
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            required
          />
          <Input
            label="Login Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Set a secure password"
            error={errors.password}
            required
          />
          <Select
            label="Department"
            value={form.departmentId}
            onChange={(e) => setForm((f) => ({ ...f, departmentId: e.target.value }))}
            options={[{ value: '', label: 'Select department' }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
            error={errors.departmentId}
          />
          <Select
            label="Assigned Subject"
            value={form.subjectId}
            onChange={(e) => setForm((f) => ({ ...f, subjectId: e.target.value }))}
            options={[{ value: '', label: 'No subject assigned' }, ...subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))]}
          />
          <Input
            label="Designation"
            value={form.designation}
            onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
            placeholder="Associate Professor"
          />
          <Input
            label="Qualification"
            value={form.qualification}
            onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
            placeholder="Ph.D. in CS"
          />
          <Input
            label="Experience (Years)"
            type="number"
            min="0"
            value={form.experience}
            onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
            placeholder="5"
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Faculty</Button>
          </div>
        </form>
      </Modal>

      {/* EDIT FACULTY MODAL */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Faculty Profile">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!editingFacultyId) return;
          
          setFacultyList(prev => {
            const updated = prev.map(f => {
              if (f.id === editingFacultyId) {
                const updatedFac = {
                  ...f,
                  name: editForm.name.trim(),
                  email: editForm.email.trim(),
                  phone: editForm.phone.trim(),
                  departmentId: editForm.departmentId,
                  designation: editForm.designation,
                  qualification: editForm.qualification,
                  experience: parseInt(editForm.experience) || 1,
                  subjectIds: editForm.subjectId ? [editForm.subjectId] : [],
                };
                
                // Update global array
                const globalIndex = initialFaculty.findIndex(fac => fac.id === editingFacultyId);
                if (globalIndex !== -1) initialFaculty[globalIndex] = updatedFac;

                // Update local storage
                try {
                  const customFacRaw = localStorage.getItem('custom_faculty');
                  const customFac = customFacRaw ? JSON.parse(customFacRaw) : [];
                  const localIndex = customFac.findIndex((fac: any) => fac.id === editingFacultyId);
                  if (localIndex !== -1) {
                    customFac[localIndex] = updatedFac;
                  } else {
                    customFac.push(updatedFac);
                  }
                  localStorage.setItem('custom_faculty', JSON.stringify(customFac));
                } catch(e) {}

                return updatedFac;
              }
              return f;
            });
            return updated;
          });
          
          setIsEditOpen(false);
          setSuccessMsg(`Faculty profile updated successfully.`);
          setTimeout(() => setSuccessMsg(''), 4000);
        }} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <Select
            label="Department"
            value={editForm.departmentId}
            onChange={(e) => setEditForm((f) => ({ ...f, departmentId: e.target.value }))}
            options={[{ value: '', label: 'Select department' }, ...departments.map((d) => ({ value: d.id, label: d.name }))]}
            required
          />
          <Select
            label="Assigned Subject"
            value={editForm.subjectId}
            onChange={(e) => setEditForm((f) => ({ ...f, subjectId: e.target.value }))}
            options={[{ value: '', label: 'No subject assigned' }, ...subjects.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` }))]}
            // Optional instruction field
          />
          <Input
            label="Designation"
            value={editForm.designation}
            onChange={(e) => setEditForm((f) => ({ ...f, designation: e.target.value }))}
          />
          <Input
            label="Qualification"
            value={editForm.qualification}
            onChange={(e) => setEditForm((f) => ({ ...f, qualification: e.target.value }))}
          />
          <Input
            label="Experience (Years)"
            type="number"
            min="0"
            value={editForm.experience}
            onChange={(e) => setEditForm((f) => ({ ...f, experience: e.target.value }))}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

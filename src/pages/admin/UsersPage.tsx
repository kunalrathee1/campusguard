import React, { useState } from 'react';
import { Plus, User, Shield, UserCheck, GraduationCap } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Avatar, Badge, StatusBadge, Modal, Input, Alert
} from '../../components/ui';
import { users as initialUsers } from '../../data/mockData';
import type { User as UserType, UserRole } from '../../types';

export default function UsersPage() {
  const [usersList, setUsersList] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'faculty' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const filtered = usersList.filter((u) => {
    const q = search.toLowerCase();
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    return true;
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required';
    return e;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const newUser: UserType = {
      id: `u-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUsersList((prev) => [newUser, ...prev]);
    setIsAddOpen(false);
    setForm({ name: '', email: '', role: 'faculty' });
    setErrors({});
    setSuccess(`User account for ${newUser.name} created successfully.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Accounts & Access"
        subtitle="Manage system logins, roles, and administrative permissions"
        breadcrumb={['System', 'Users']}
        actions={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>
            Add User Account
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
              placeholder="Search users by name or email..."
              className="flex-1"
            />
          </div>
          <FilterRow>
            <Select
              options={[
                { value: '', label: 'All Roles' },
                { value: 'admin', label: 'Administrators' },
                { value: 'faculty', label: 'Faculty' },
                { value: 'student', label: 'Students' },
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-48"
            />
          </FilterRow>
        </div>

        <Table headers={['User', 'Email', 'Role', 'Status', 'Created Date']}>
          {filtered.map((u) => (
            <Tr key={u.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={u.name} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.id}</p>
                  </div>
                </div>
              </Td>
              <Td>{u.email}</Td>
              <Td>
                <Badge
                  variant={
                    u.role === 'admin' ? 'primary' : u.role === 'faculty' ? 'success' : 'secondary'
                  }
                >
                  {u.role.toUpperCase()}
                </Badge>
              </Td>
              <Td>
                <StatusBadge status={u.status} />
              </Td>
              <Td>{u.createdAt || '2024-01-10'}</Td>
            </Tr>
          ))}
        </Table>
      </Card>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create User Account">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="john@campusguard.edu"
            error={errors.email}
            required
          />
          <Select
            label="System Role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'faculty', label: 'Faculty' },
              { value: 'student', label: 'Student' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

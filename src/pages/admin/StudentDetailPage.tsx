import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, AlertTriangle,
  CheckCircle2, Clock, ShieldAlert, Award, User, BookOpen, Edit2
} from 'lucide-react';
import {
  PageHeader, Card, Button, Badge, RiskBadge, StatusBadge,
  AttendanceBar, Alert, Modal, Input, Select
} from '../../components/ui';
import { useAppContext } from '../../context/AppContext';
import { departments, courses, subjects } from '../../data/mockData';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, riskRecords, warnings, studentAttendances, updateStudent, updateAttendance } = useAppContext();

  const student = students.find((s) => s.id === id || s.studentId === id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    semester: String(student?.semester || 1),
    status: student?.status || 'active',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!student) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Student Not Found"
          breadcrumb={['Admin', 'Students', 'Not Found']}
          actions={
            <Button icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/students')}>
              Back to Students
            </Button>
          }
        />
        <Alert type="error" title="Record Not Found" message="The requested student record does not exist or has been removed." />
      </div>
    );
  }

  const dept = departments.find((d) => d.id === student.departmentId);
  const course = courses.find((c) => c.id === student.courseId);
  const attendance = studentAttendances.find((a) => a.studentId === student.id);
  
  const currentAttendance = attendance?.overallPercentage ?? 100;
  let dynamicRiskLevel = 'low';
  if (currentAttendance < 65) dynamicRiskLevel = 'high';
  else if (currentAttendance < 75) dynamicRiskLevel = 'medium';

  const risk = riskRecords.find((r) => r.studentId === student.id) || { level: dynamicRiskLevel as any };
  if (dynamicRiskLevel !== 'low') {
    risk.level = dynamicRiskLevel as any;
  }
  const studentWarnings = warnings.filter((w) => w.studentId === student.id);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(student.id, {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      semester: parseInt(editForm.semester),
      status: editForm.status as any,
    });
    setIsEditOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.name}
        subtitle={`${student.studentId} • Roll: ${student.rollNumber}`}
        breadcrumb={['Admin', 'Students', student.name]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/students')}>
              Back
            </Button>
            <Button icon={<Edit2 size={16} />} onClick={() => setIsEditOpen(true)}>
              Edit Profile
            </Button>
          </div>
        }
      />

      {saveSuccess && (
        <Alert type="success" title="Profile Updated" message="Student record has been successfully updated." />
      )}

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Status</p>
            <div className="mt-1">
              <StatusBadge status={student.status} />
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-500 font-medium">Overall Attendance</p>
              <p className="text-lg font-bold text-slate-800">{attendance?.overallPercentage ?? 0}%</p>
              <AttendanceBar percentage={attendance?.overallPercentage ?? 0} showLabel={false} />
            </div>
            <Button 
              size="xs" 
              variant="outline" 
              icon={<Edit2 size={12} />} 
              onClick={() => {
                const newVal = window.prompt("Enter new attendance percentage (0-100):", String(attendance?.overallPercentage ?? 0));
                if (newVal !== null) {
                  const parsed = parseInt(newVal);
                  if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
                    updateAttendance(student.id, parsed);
                  }
                }
              }}
            >
              Edit
            </Button>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Risk Status</p>
            <div className="mt-1">
              {risk ? <RiskBadge level={risk.level} /> : <Badge variant="secondary">Low</Badge>}
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active Warnings</p>
            <p className="text-lg font-bold text-slate-800">{studentWarnings.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Academic Info */}
          <Card title="Academic Details">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400">Department</p>
                <p className="font-semibold text-slate-800 mt-0.5">{dept?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Course</p>
                <p className="font-semibold text-slate-800 mt-0.5">{course?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Current Semester</p>
                <p className="font-semibold text-slate-800 mt-0.5">Semester {student.semester}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Roll Number</p>
                <p className="font-semibold text-slate-800 mt-0.5">{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Joined Date</p>
                <p className="font-semibold text-slate-800 mt-0.5">{student.joinedDate || '2023-08-01'}</p>
              </div>
            </div>
          </Card>

          {/* Subject-Wise Attendance Breakdown */}
          <Card title="Subject Attendance Breakdown">
            <div className="space-y-3">
              {(attendance?.subjectAttendances || []).map((sa) => {
                const sub = subjects.find((s) => s.id === sa.subjectId);
                return (
                  <div key={sa.subjectId} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{sub?.name || 'Subject'}</p>
                      <p className="text-xs text-slate-500">
                        {sa.present} Present • {sa.absent} Absent • {sa.totalClasses} Total Classes
                      </p>
                    </div>
                    <div className="w-36 text-right">
                      <AttendanceBar percentage={sa.percentage} />
                    </div>
                  </div>
                );
              })}
              {(!attendance?.subjectAttendances || attendance.subjectAttendances.length === 0) && (
                <p className="text-sm text-slate-500 text-center py-4">No subject attendance records found.</p>
              )}
            </div>
          </Card>

          {/* Warning Timeline */}
          <Card title="Warnings & Infractions">
            {studentWarnings.length === 0 ? (
              <p className="text-sm text-slate-500 py-2">No warnings issued for this student.</p>
            ) : (
              <div className="space-y-3">
                {studentWarnings.map((w) => (
                  <div key={w.id} className="p-3.5 border border-rose-100 bg-rose-50/50 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-rose-900">{w.title}</span>
                      <span className="text-xs font-medium text-slate-500">{w.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{w.message}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Contact & Guardian Info */}
        <div className="space-y-6">
          <Card title="Contact Information">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-700">{student.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-700">{student.phone}</span>
              </div>
              {student.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-700">DOB: {student.dateOfBirth}</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Guardian Details">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Guardian Name</p>
                <p className="font-semibold text-slate-800 mt-0.5">{student.guardianName || 'Parent / Guardian'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Guardian Phone</p>
                <p className="font-semibold text-slate-800 mt-0.5">{student.guardianPhone || '+1 (555) 987-6543'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Student Record">
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={editForm.phone}
            onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <Select
            label="Semester"
            value={editForm.semester}
            onChange={(e) => setEditForm((f) => ({ ...f, semester: e.target.value }))}
            options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: String(s), label: `Semester ${s}` }))}
          />
          <Select
            label="Status"
            value={editForm.status}
            onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as any }))}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4">
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

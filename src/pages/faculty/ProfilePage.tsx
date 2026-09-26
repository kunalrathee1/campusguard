import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, BookOpen, GraduationCap, Award } from 'lucide-react';
import { PageHeader, Card, Avatar, Badge, Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { faculty, departments, subjects } from '../../data/mockData';

export default function FacultyProfilePage() {
  const { currentUser } = useAuth();
  let fac = faculty.find(f => f.userId === currentUser?.id);
  if (!fac && currentUser) {
    fac = {
      id: `fac-fallback-${currentUser.id}`,
      facultyId: 'FAC-UNKNOWN',
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: 'Not provided',
      departmentId: 'dept-cse',
      designation: 'Faculty',
      qualification: 'Not provided',
      experience: 1,
      status: 'active',
      joinedDate: '2024-01-01',
      subjectIds: []
    };
  }
  
  const dept = departments.find(d => d.id === fac?.departmentId);
  const mySubjects = subjects.filter(s => fac?.subjectIds.includes(s.id));

  if (!fac) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Faculty Profile</h1>
        <p className="text-slate-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and academic credentials"
        breadcrumb={['Faculty', 'Profile']}
        actions={
          <Button variant="outline">Edit Profile</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center py-8">
            <div className="flex justify-center mb-4">
              <Avatar name={fac.name} size="lg" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{fac.name}</h2>
            <p className="text-sm text-indigo-600 font-medium mb-2">{fac.designation}</p>
            <Badge variant="primary" className="mb-6">{dept?.name || 'Department'}</Badge>

            <div className="space-y-3 text-left border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span>{fac.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <span>{fac.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400" />
                <span>Faculty Block A, Room 204</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Details & Subjects */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Academic Profile">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <Briefcase size={16} className="text-indigo-500" /> Employee ID
                </div>
                <p className="text-slate-600 pl-6">{fac.facultyId}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <GraduationCap size={16} className="text-indigo-500" /> Qualification
                </div>
                <p className="text-slate-600 pl-6">{fac.qualification}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <Award size={16} className="text-indigo-500" /> Experience
                </div>
                <p className="text-slate-600 pl-6">{fac.experience} Years</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  <User size={16} className="text-indigo-500" /> Joined Date
                </div>
                <p className="text-slate-600 pl-6">{new Date(fac.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card title="Assigned Subjects">
            {mySubjects.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No subjects assigned currently.</p>
            ) : (
              <div className="space-y-3">
                {mySubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <BookOpen size={20} className="text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{subject.name}</p>
                        <p className="text-xs text-slate-500">{subject.code} • Semester {subject.semester}</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

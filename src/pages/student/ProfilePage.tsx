import React from 'react';
import { PageHeader, Card, LoadingSpinner } from '../../components/ui';
import { User, Mail, Phone, MapPin, BookOpen, Building } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { departments, courses } from '../../data/mockData';

export default function StudentProfilePage() {
  const { currentUser } = useAuth();
  const { students } = useAppContext();

  const student = students.find(s => s.userId === currentUser?.id);
  const dept = student ? departments.find(d => d.id === student.departmentId) : null;
  const course = student ? courses.find(c => c.id === student.courseId) : null;

  if (!student) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal details and account settings"
        breadcrumb={['Student', 'Profile']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-t-4 border-t-indigo-600">
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 text-3xl font-bold">
              {student.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{student.rollNumber}</p>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              Student
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 py-4">
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <User size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Full Name</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">{student.name}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Mail size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Email Address</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">{student.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Phone size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Phone Number</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">{student.phone}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <MapPin size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Address</span>
              </div>
              <p className="text-sm text-slate-800 font-medium">{student.address || 'N/A'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Academic Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 py-4">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Building size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Department</span>
            </div>
            <p className="text-sm text-slate-800 font-medium">{dept?.name || 'Unknown'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <BookOpen size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Course</span>
            </div>
            <p className="text-sm text-slate-800 font-medium">{course?.name || 'Unknown'}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <User size={16} />
              <span className="text-xs uppercase tracking-wider font-semibold">Semester</span>
            </div>
            <p className="text-sm text-slate-800 font-medium">Semester {student.semester}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

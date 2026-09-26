import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BarChart2, ChevronRight } from 'lucide-react';
import { Card, PageHeader, LoadingSpinner, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { faculty, subjects, departments, students, studentSubjectAttendances, FACULTY_STUDENT_IDS } from '../../data/mockData';

// Simulated taken-today map
const TODAY_TAKEN: Record<string, boolean> = {
  'sub-001': true,
  'sub-002': false,
  'sub-009': true,
  'sub-014': false,
};

// Map subject → student IDs
const SUBJECT_STUDENTS: Record<string, string[]> = {
  'sub-001': ['stu-001', 'stu-002', 'stu-003'],
  'sub-002': ['stu-001', 'stu-002', 'stu-003'],
  'sub-009': ['stu-013'],
  'sub-014': ['stu-015'],
};

export default function ClassesPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (!currentUser) return null;
  const customFacRaw = localStorage.getItem('custom_faculty');
  const customFac = customFacRaw ? JSON.parse(customFacRaw) : [];
  const allFaculty = [...faculty, ...customFac];
  
  let fac = allFaculty.find(f => f.email === currentUser.email);
  if (!fac) {
    fac = {
      id: `fac-fallback-${currentUser.id}`,
      facultyId: 'FAC-UNKNOWN',
      userId: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      phone: '',
      departmentId: 'dept-cse',
      designation: 'Faculty',
      qualification: '',
      experience: 1,
      status: 'active',
      joinedDate: '2024-01-01',
      subjectIds: []
    };
  }

  const mySubjects = subjects.filter(s => fac.subjectIds.includes(s.id));

  if (loading) return <LoadingSpinner message="Loading classes…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        subtitle={`${mySubjects.length} assigned subjects`}
        breadcrumb={['Faculty', 'My Classes']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mySubjects.map(sub => {
          const dept = departments.find(d => d.id === sub.departmentId);
          const subStudentIds = SUBJECT_STUDENTS[sub.id] ?? [];
          const subStudents = students.filter(s => subStudentIds.includes(s.id));
          const taken = TODAY_TAKEN[sub.id];

          // Compute average attendance for this subject
          const attRecords = studentSubjectAttendances.filter(a => a.subjectId === sub.id);
          const avgAtt = attRecords.length
            ? Math.round(attRecords.reduce((sum, r) => sum + r.percentage, 0) / attRecords.length)
            : 0;

          return (
            <Card
              key={sub.id}
              onClick={() => navigate(`/faculty/classes/${sub.id}`)}
              className="group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">{sub.code}</p>
                  </div>
                </div>
                <Badge variant={taken ? 'success' : 'warning'}>
                  {taken ? 'Taken Today' : 'Pending'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-lg font-bold text-slate-900">{subStudents.length}</p>
                  <p className="text-xs text-slate-500">Students</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-lg font-bold text-slate-900">{sub.totalClassesHeld}</p>
                  <p className="text-xs text-slate-500">Classes Held</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className={`text-lg font-bold ${avgAtt >= 75 ? 'text-emerald-600' : avgAtt >= 65 ? 'text-amber-600' : 'text-red-600'}`}>
                    {avgAtt}%
                  </p>
                  <p className="text-xs text-slate-500">Avg Att.</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Sem {sub.semester}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart2 className="w-3.5 h-3.5" />
                    {dept?.code ?? ''}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

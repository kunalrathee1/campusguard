import React, { useState } from 'react';
import { PageHeader, Card, Table, Tr, Td, Avatar, Badge, Button, Select } from '../../components/ui';
import { FileUp, Check, X, FileText, Calendar } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { subjects, faculty, FACULTY_STUDENT_IDS } from '../../data/mockData';

export default function FacultyAttendancePage() {
  const { students, studentAttendances, updateAttendance } = useAppContext();
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | ''>>({});
  const [exceptions, setExceptions] = useState<Record<string, string>>({}); // studentId -> fileName
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isClassLoaded, setIsClassLoaded] = useState(false);

  const fac = faculty.find(f => f.userId === currentUser?.id);
  const mySubjects = subjects.filter(s => fac?.subjectIds.includes(s.id));
  const classStudents = students.filter(s => FACULTY_STUDENT_IDS.includes(s.id));

  const markStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleUpload = (studentId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setExceptions(prev => ({ ...prev, [studentId]: file.name }));
        alert(`Uploaded medical description: ${file.name}`);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark Attendance"
        subtitle="Record daily attendance and handle medical exceptions for specific lectures"
        breadcrumb={['Faculty', 'Attendance']}
      />

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Subject</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={selectedSubject}
              onChange={(e) => { setSelectedSubject(e.target.value); setIsClassLoaded(false); }}
            >
              <option value="">-- Choose a subject --</option>
              {mySubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Lecture Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setIsClassLoaded(false); }}
              />
            </div>
          </div>
          <Button onClick={() => {
            if (!selectedSubject) {
              alert('Please select a subject first.');
              return;
            }
            
            // Find the selected subject details
            const subject = mySubjects.find(s => s.id === selectedSubject);
            if (!subject) return;

            // Filter students who are actually in this subject's semester and department
            const relevantStudents = classStudents.filter(s => 
              s.semester === subject.semester && 
              s.departmentId === subject.departmentId
            );

            // Pre-fill attendance with present for relevant students only
            const initialAtt: Record<string, 'present'> = {};
            relevantStudents.forEach(s => initialAtt[s.id] = 'present');
            
            // Note: we can either store the filtered list in a new state variable
            // or just compute it in the render block. Let's just compute it in render block 
            // by setting a state for the currently active roster.
            setAttendance(initialAtt);
            setIsClassLoaded(true);
          }}>
            Load Class Roster
          </Button>
        </div>
      </Card>

      {isClassLoaded && (
        <Card padding="none">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <p className="font-semibold text-slate-800">Class Roster</p>
            <p className="text-sm text-slate-500">
              {classStudents.filter(s => {
                const sub = mySubjects.find(subj => subj.id === selectedSubject);
                return sub && s.semester === sub.semester && s.departmentId === sub.departmentId;
              }).length} Students
            </p>
          </div>
          <Table headers={['Student', 'Status', 'Medical Exception']}>
            {classStudents.filter(s => {
                const sub = mySubjects.find(subj => subj.id === selectedSubject);
                return sub && s.semester === sub.semester && s.departmentId === sub.departmentId;
              }).map(student => (
            <Tr key={student.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400">{student.studentId} · Sem {student.semester}</p>
                  </div>
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button onClick={() => markStatus(student.id, 'present')} className={`p-2 rounded-lg border ${attendance[student.id] === 'present' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-slate-50 hover:bg-emerald-50'}`}>
                    <Check size={16} />
                  </button>
                  <button onClick={() => markStatus(student.id, 'absent')} className={`p-2 rounded-lg border ${attendance[student.id] === 'absent' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-slate-50 hover:bg-red-50'}`}>
                    <X size={16} />
                  </button>
                </div>
              </Td>
              <Td>
                {exceptions[student.id] ? (
                  <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium">
                    <FileText size={16} />
                    {exceptions[student.id]}
                  </div>
                ) : (
                  <Button variant="outline" size="sm" icon={<FileUp size={14} />} onClick={() => handleUpload(student.id)}>
                    Upload Doctor Note
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <Button onClick={() => {
            Object.entries(attendance).forEach(([studentId, status]) => {
               const attRecord = studentAttendances.find(a => a.studentId === studentId);
               let currentPercent = attRecord?.overallPercentage ?? 100;
               if (status === 'absent') {
                 currentPercent = Math.max(0, currentPercent - 2);
               } else if (status === 'present') {
                 currentPercent = Math.min(100, currentPercent + 1);
               }
               updateAttendance(studentId, currentPercent);
            });
            alert(`Attendance successfully saved and synced for ${mySubjects.find(s => s.id === selectedSubject)?.name} on ${selectedDate}.`);
            setIsClassLoaded(false);
            setAttendance({});
          }}>
            Save Attendance Record
          </Button>
        </div>
      </Card>
      )}
    </div>
  );
}

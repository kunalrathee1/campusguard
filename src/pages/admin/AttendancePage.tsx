import React, { useState } from 'react';
import { Calendar, Download, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  PageHeader, Card, Button, SearchBar, FilterRow, Select,
  Table, Tr, Td, Avatar, AttendanceBar, Badge
} from '../../components/ui';
import { FileText, Edit2, UploadCloud, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { departments, subjects } from '../../data/mockData';
import { Student } from '../../types';

export default function AttendancePage() {
  const { students, studentAttendances } = useAppContext();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');
  
  // Attendance update modal state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('present');
  const [file, setFile] = useState<File | null>(null);
  
  // Local overrides for demonstration
  const [overrides, setOverrides] = useState<Record<string, { rate: number, doc: string | null }>>({});

  const avgAttendance = studentAttendances.length
    ? Math.round((studentAttendances.reduce((acc, curr) => acc + curr.overallPercentage, 0) / studentAttendances.length) * 10) / 10
    : 0;
    
  const criticalStudents = studentAttendances.filter(a => a.overallPercentage < 75).length;
  
  const totalClassesTracked = studentAttendances.reduce((acc, curr) => acc + (curr.totalClasses || 0), 0);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    if (q && !s.name.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q)) return false;
    if (deptFilter && s.departmentId !== deptFilter) return false;
    if (semFilter && s.semester !== parseInt(semFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Attendance Ledger"
        subtitle="Campus-wide student attendance tracking and audit"
        breadcrumb={['Admin', 'Attendance']}
      />

      {/* Summary metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Attendance</p>
            <p className="text-xl font-bold text-slate-800">{avgAttendance}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Critical Attendance (&lt;75%)</p>
            <p className="text-xl font-bold text-rose-600">{criticalStudents} Students</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Classes Tracked</p>
            <p className="text-xl font-bold text-slate-800">{totalClassesTracked > 0 ? `${totalClassesTracked}+` : '0'} Sessions</p>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-4 pt-4 pb-2 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search student by name, roll number, or ID..."
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
            <Select
              options={[{ value: '', label: 'All Semesters' }, ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({ value: String(s), label: `Semester ${s}` }))]}
              value={semFilter}
              onChange={(e) => setSemFilter(e.target.value)}
              className="w-36"
            />
          </FilterRow>
        </div>

        <Table headers={['Student', 'Department', 'Attendance Rate', 'Status', 'Medical Exception', 'Action']}>
          {filtered.map((student) => {
            const att = studentAttendances.find((a) => a.studentId === student.id);
            const dept = departments.find((d) => d.id === student.departmentId);
            const override = overrides[student.id];
            const rate = override ? override.rate : (att?.overallPercentage ?? 80);
            return (
              <Tr key={student.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={student.name} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.studentId} • {student.rollNumber}</p>
                    </div>
                  </div>
                </Td>
                <Td>{dept?.name || '—'}</Td>
                <Td>
                  <div className="w-32">
                    <AttendanceBar percentage={rate} />
                  </div>
                </Td>
                <Td>
                  {rate >= 75 ? (
                    <Badge variant="success">Eligible</Badge>
                  ) : (
                    <Badge variant="danger">Shortage</Badge>
                  )}
                </Td>
                <Td>
                  {override?.doc ? (
                     <a href="#" onClick={(e) => { e.preventDefault(); alert(`Viewing: ${override.doc}`); }} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer">
                       <FileText size={16} /> {override.doc}
                     </a>
                  ) : student.id.endsWith('1') ? (
                     <a href="#" onClick={(e) => { e.preventDefault(); alert('Viewing: doctor_note.pdf'); }} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer">
                       <FileText size={16} /> doctor_note.pdf
                     </a>
                  ) : (
                     <span className="text-slate-400 text-sm">None</span>
                  )}
                </Td>
                <Td>
                  <Button variant="outline" size="sm" icon={<Edit2 size={14} />} onClick={() => {
                    setSelectedStudent(student);
                    setSelectedSubject(subjects[0]?.id || '');
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setSelectedStatus('present');
                    setFile(null);
                  }}>
                    Change Attendance
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Card>

      {/* Attendance Change Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Change Attendance</h3>
                <p className="text-sm text-slate-500">For {selectedStudent.name}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attendance Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status" value="present" checked={selectedStatus === 'present'} onChange={() => setSelectedStatus('present')} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700">Present</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status" value="absent" checked={selectedStatus === 'absent'} onChange={() => setSelectedStatus('absent')} className="text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-slate-700">Absent</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supporting Document</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-2">
                        <FileText size={18} /> {file.name}
                      </div>
                      <button onClick={() => setFile(null)} className="text-xs text-slate-500 hover:text-red-500">
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 mb-1">Click to upload document</p>
                      <p className="text-xs text-slate-400 mb-3">PDF, JPG, PNG (Max 5MB)</p>
                      <input 
                        type="file" 
                        id="doc-upload" 
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      <label 
                        htmlFor="doc-upload" 
                        className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Browse Files
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>Cancel</Button>
              <Button onClick={() => {
                if (!file) {
                  alert('Supporting document is required to change a past lecture record.');
                  return;
                }
                
                // Simulate calculating a new rate by modifying the current overall percentage
                const att = studentAttendances.find((a) => a.studentId === selectedStudent.id);
                const baseRate = att?.overallPercentage ?? 80;
                
                // If they are marked present, we simulate a slight increase in their overall percentage
                // If marked absent, we simulate a slight decrease.
                const newSimulatedRate = selectedStatus === 'present' 
                  ? Math.min(100, baseRate + 2) 
                  : Math.max(0, baseRate - 2);

                setOverrides(prev => ({
                  ...prev,
                  [selectedStudent.id]: { rate: newSimulatedRate, doc: file.name }
                }));

                // Check for low attendance automated email
                if (newSimulatedRate < 75) {
                  setTimeout(() => {
                    alert(`AUTOMATED SYSTEM LOG:\n\nAttendance for ${selectedStudent.name} fell below 75% (now ${newSimulatedRate}%).\nAn automated warning email has been dispatched to their registered email address (${selectedStudent.email}).`);
                  }, 400);
                }

                setSelectedStudent(null);
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

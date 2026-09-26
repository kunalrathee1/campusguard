import type {
  User, Department, Subject, Course, Student, Faculty,
  AttendanceRecord, StudentSubjectAttendance, StudentOverallAttendance,
  RiskRecord, Warning, Notification, AuditLog, SystemSettings, DepartmentStats
} from '../types';

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'u-admin-1', name: 'Admin User', email: 'admin@campusguard.edu', role: 'admin', status: 'active', lastLogin: '2024-01-15T09:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-fac-1', name: 'Dr. Neha Sharma', email: 'faculty@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-15T08:30:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-stu-1', name: 'Aarav Mehta', email: 'student@campusguard.edu', role: 'student', status: 'active', lastLogin: '2024-01-14T16:00:00Z', createdAt: '2023-07-01T00:00:00Z' },
  { id: 'u-fac-2', name: 'Prof. Rahul Mehta', email: 'rahul.mehta@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-14T10:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-fac-3', name: 'Dr. Priya Nair', email: 'priya.nair@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-15T07:45:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-fac-4', name: 'Prof. Amit Patel', email: 'amit.patel@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-13T11:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-fac-5', name: 'Dr. Kavita Rao', email: 'kavita.rao@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-15T09:30:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-fac-6', name: 'Prof. Arjun Singh', email: 'arjun.singh@campusguard.edu', role: 'faculty', status: 'active', lastLogin: '2024-01-12T14:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
  { id: 'u-admin-2', name: 'Sarah Williams', email: 'sarah.williams@campusguard.edu', role: 'admin', status: 'active', lastLogin: '2024-01-15T08:00:00Z', createdAt: '2023-06-01T00:00:00Z' },
];

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export const departments: Department[] = [
  { id: 'dept-cse', name: 'Computer Science & Engineering', code: 'CSE', headFacultyId: 'fac-001' },
  { id: 'dept-it', name: 'Information Technology', code: 'IT', headFacultyId: 'fac-003' },
  { id: 'dept-ece', name: 'Electronics & Communication', code: 'ECE', headFacultyId: 'fac-004' },
  { id: 'dept-mech', name: 'Mechanical Engineering', code: 'ME', headFacultyId: 'fac-005' },
];

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────
export const subjects: Subject[] = [
  { id: 'sub-001', name: 'Database Management Systems', code: 'DBMS401', departmentId: 'dept-cse', semester: 4, facultyId: 'fac-001', totalClassesHeld: 32 },
  { id: 'sub-002', name: 'Operating Systems', code: 'OS402', departmentId: 'dept-cse', semester: 4, facultyId: 'fac-001', totalClassesHeld: 30 },
  { id: 'sub-003', name: 'Computer Networks', code: 'CN501', departmentId: 'dept-cse', semester: 5, facultyId: 'fac-002', totalClassesHeld: 28 },
  { id: 'sub-004', name: 'Data Structures', code: 'DS201', departmentId: 'dept-cse', semester: 2, facultyId: 'fac-002', totalClassesHeld: 35 },
  { id: 'sub-005', name: 'Software Engineering', code: 'SE501', departmentId: 'dept-it', semester: 5, facultyId: 'fac-003', totalClassesHeld: 26 },
  { id: 'sub-006', name: 'Web Development', code: 'WD301', departmentId: 'dept-it', semester: 3, facultyId: 'fac-006', totalClassesHeld: 24 },
  { id: 'sub-007', name: 'Database Systems', code: 'DBS201', departmentId: 'dept-it', semester: 2, facultyId: 'fac-006', totalClassesHeld: 30 },
  { id: 'sub-008', name: 'Digital Electronics', code: 'DE301', departmentId: 'dept-ece', semester: 3, facultyId: 'fac-004', totalClassesHeld: 28 },
  { id: 'sub-009', name: 'Cloud Computing', code: 'CC601', departmentId: 'dept-cse', semester: 6, facultyId: 'fac-001', totalClassesHeld: 22 },
  { id: 'sub-010', name: 'Thermodynamics', code: 'TD301', departmentId: 'dept-mech', semester: 3, facultyId: 'fac-005', totalClassesHeld: 30 },
  { id: 'sub-011', name: 'Cyber Security', code: 'CS601', departmentId: 'dept-it', semester: 6, facultyId: 'fac-003', totalClassesHeld: 20 },
  { id: 'sub-012', name: 'Thermodynamics Advanced', code: 'TD601', departmentId: 'dept-mech', semester: 6, facultyId: 'fac-005', totalClassesHeld: 25 },
  { id: 'sub-013', name: 'Signal Processing', code: 'SP501', departmentId: 'dept-ece', semester: 5, facultyId: 'fac-004', totalClassesHeld: 27 },
  { id: 'sub-014', name: 'Machine Learning', code: 'ML501', departmentId: 'dept-cse', semester: 5, facultyId: 'fac-001', totalClassesHeld: 24 },
  { id: 'sub-015', name: 'Fluid Mechanics', code: 'FM401', departmentId: 'dept-mech', semester: 4, facultyId: 'fac-005', totalClassesHeld: 26 },
];

// ─── FACULTY ──────────────────────────────────────────────────────────────────
export const faculty: Faculty[] = [
  {
    id: 'fac-001', facultyId: 'FAC-001', userId: 'u-fac-1',
    name: 'Dr. Neha Sharma', email: 'faculty@campusguard.edu', phone: '+91-9876543210',
    departmentId: 'dept-cse', designation: 'Associate Professor',
    subjectIds: ['sub-001'], status: 'active',
    joinedDate: '2018-07-01', qualification: 'Ph.D. Computer Science', experience: 8,
  },
  {
    id: 'fac-002', facultyId: 'FAC-002', userId: 'u-fac-2',
    name: 'Prof. Rahul Mehta', email: 'rahul.mehta@campusguard.edu', phone: '+91-9876543211',
    departmentId: 'dept-cse', designation: 'Assistant Professor',
    subjectIds: ['sub-003'], status: 'active',
    joinedDate: '2020-07-01', qualification: 'M.Tech Computer Science', experience: 5,
  },
  {
    id: 'fac-003', facultyId: 'FAC-003', userId: 'u-fac-3',
    name: 'Dr. Priya Nair', email: 'priya.nair@campusguard.edu', phone: '+91-9876543212',
    departmentId: 'dept-it', designation: 'Professor',
    subjectIds: ['sub-005'], status: 'active',
    joinedDate: '2015-06-01', qualification: 'Ph.D. Information Technology', experience: 12,
  },
  {
    id: 'fac-004', facultyId: 'FAC-004', userId: 'u-fac-4',
    name: 'Prof. Amit Patel', email: 'amit.patel@campusguard.edu', phone: '+91-9876543213',
    departmentId: 'dept-ece', designation: 'Assistant Professor',
    subjectIds: ['sub-008'], status: 'active',
    joinedDate: '2019-07-01', qualification: 'M.Tech Electronics', experience: 6,
  },
  {
    id: 'fac-005', facultyId: 'FAC-005', userId: 'u-fac-5',
    name: 'Dr. Kavita Rao', email: 'kavita.rao@campusguard.edu', phone: '+91-9876543214',
    departmentId: 'dept-mech', designation: 'Associate Professor',
    subjectIds: ['sub-010'], status: 'active',
    joinedDate: '2016-07-01', qualification: 'Ph.D. Mechanical Engineering', experience: 10,
  },
  {
    id: 'fac-006', facultyId: 'FAC-006', userId: 'u-fac-6',
    name: 'Prof. Arjun Singh', email: 'arjun.singh@campusguard.edu', phone: '+91-9876543215',
    departmentId: 'dept-it', designation: 'Assistant Professor',
    subjectIds: ['sub-006'], status: 'active',
    joinedDate: '2021-07-01', qualification: 'M.Tech IT', experience: 4,
  },
];

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
export const students: Student[] = [
  { id: 'stu-001', studentId: 'STU-1001', userId: 'u-stu-1', name: 'Aarav Mehta', email: 'student@campusguard.edu', phone: '+91-9900000001', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-001', status: 'active', joinedDate: '2022-08-01', gender: 'Male', dateOfBirth: '2003-05-15', guardianName: 'Suresh Mehta', guardianPhone: '+91-9900001001' },
  { id: 'stu-002', studentId: 'STU-1002', userId: 'u-stu-2', name: 'Diya Sharma', email: 'diya.sharma@student.edu', phone: '+91-9900000002', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-002', status: 'active', joinedDate: '2022-08-01', gender: 'Female', dateOfBirth: '2003-03-22', guardianName: 'Ravi Sharma', guardianPhone: '+91-9900001002' },
  { id: 'stu-003', studentId: 'STU-1003', userId: 'u-stu-3', name: 'Rohan Patel', email: 'rohan.patel@student.edu', phone: '+91-9900000003', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-003', status: 'active', joinedDate: '2022-08-01', gender: 'Male', dateOfBirth: '2003-07-10', guardianName: 'Dinesh Patel', guardianPhone: '+91-9900001003' },
  { id: 'stu-004', studentId: 'STU-1004', userId: 'u-stu-4', name: 'Ananya Rao', email: 'ananya.rao@student.edu', phone: '+91-9900000004', departmentId: 'dept-it', courseId: 'course-it', semester: 5, rollNumber: 'IT-5-001', status: 'active', joinedDate: '2021-08-01', gender: 'Female', dateOfBirth: '2002-11-08', guardianName: 'Mohan Rao', guardianPhone: '+91-9900001004' },
  { id: 'stu-005', studentId: 'STU-1005', userId: 'u-stu-5', name: 'Kabir Shah', email: 'kabir.shah@student.edu', phone: '+91-9900000005', departmentId: 'dept-it', courseId: 'course-it', semester: 5, rollNumber: 'IT-5-002', status: 'active', joinedDate: '2021-08-01', gender: 'Male', dateOfBirth: '2002-09-30', guardianName: 'Ramesh Shah', guardianPhone: '+91-9900001005' },
  { id: 'stu-006', studentId: 'STU-1006', userId: 'u-stu-6', name: 'Ishita Nair', email: 'ishita.nair@student.edu', phone: '+91-9900000006', departmentId: 'dept-ece', courseId: 'course-ece', semester: 3, rollNumber: 'ECE-3-001', status: 'active', joinedDate: '2023-08-01', gender: 'Female', dateOfBirth: '2004-02-14', guardianName: 'Vinod Nair', guardianPhone: '+91-9900001006' },
  { id: 'stu-007', studentId: 'STU-1007', userId: 'u-stu-7', name: 'Arjun Verma', email: 'arjun.verma@student.edu', phone: '+91-9900000007', departmentId: 'dept-ece', courseId: 'course-ece', semester: 3, rollNumber: 'ECE-3-002', status: 'active', joinedDate: '2023-08-01', gender: 'Male', dateOfBirth: '2004-06-25', guardianName: 'Prakash Verma', guardianPhone: '+91-9900001007' },
  { id: 'stu-008', studentId: 'STU-1008', userId: 'u-stu-8', name: 'Meera Iyer', email: 'meera.iyer@student.edu', phone: '+91-9900000008', departmentId: 'dept-mech', courseId: 'course-mech', semester: 6, rollNumber: 'ME-6-001', status: 'active', joinedDate: '2020-08-01', gender: 'Female', dateOfBirth: '2001-12-03', guardianName: 'Suresh Iyer', guardianPhone: '+91-9900001008' },
  { id: 'stu-009', studentId: 'STU-1009', userId: 'u-stu-9', name: 'Vivaan Gupta', email: 'vivaan.gupta@student.edu', phone: '+91-9900000009', departmentId: 'dept-cse', courseId: 'course-cse', semester: 2, rollNumber: 'CSE-2-001', status: 'active', joinedDate: '2024-01-01', gender: 'Male', dateOfBirth: '2005-04-18', guardianName: 'Manoj Gupta', guardianPhone: '+91-9900001009' },
  { id: 'stu-010', studentId: 'STU-1010', userId: 'u-stu-10', name: 'Priya Krishnan', email: 'priya.krishnan@student.edu', phone: '+91-9900000010', departmentId: 'dept-it', courseId: 'course-it', semester: 3, rollNumber: 'IT-3-001', status: 'active', joinedDate: '2023-08-01', gender: 'Female', dateOfBirth: '2004-08-12', guardianName: 'Kumar Krishnan', guardianPhone: '+91-9900001010' },
  { id: 'stu-011', studentId: 'STU-1011', userId: 'u-stu-11', name: 'Aryan Bose', email: 'aryan.bose@student.edu', phone: '+91-9900000011', departmentId: 'dept-ece', courseId: 'course-ece', semester: 5, rollNumber: 'ECE-5-001', status: 'active', joinedDate: '2021-08-01', gender: 'Male', dateOfBirth: '2002-01-27', guardianName: 'Tapan Bose', guardianPhone: '+91-9900001011' },
  { id: 'stu-012', studentId: 'STU-1012', userId: 'u-stu-12', name: 'Nandita Joshi', email: 'nandita.joshi@student.edu', phone: '+91-9900000012', departmentId: 'dept-mech', courseId: 'course-mech', semester: 4, rollNumber: 'ME-4-001', status: 'active', joinedDate: '2022-08-01', gender: 'Female', dateOfBirth: '2003-10-05', guardianName: 'Harish Joshi', guardianPhone: '+91-9900001012' },
  { id: 'stu-013', studentId: 'STU-1013', userId: 'u-stu-13', name: 'Siddharth Menon', email: 'siddharth.menon@student.edu', phone: '+91-9900000013', departmentId: 'dept-cse', courseId: 'course-cse', semester: 6, rollNumber: 'CSE-6-001', status: 'active', joinedDate: '2020-08-01', gender: 'Male', dateOfBirth: '2001-03-19', guardianName: 'Rajeev Menon', guardianPhone: '+91-9900001013' },
  { id: 'stu-014', studentId: 'STU-1014', userId: 'u-stu-14', name: 'Riya Agarwal', email: 'riya.agarwal@student.edu', phone: '+91-9900000014', departmentId: 'dept-it', courseId: 'course-it', semester: 2, rollNumber: 'IT-2-001', status: 'active', joinedDate: '2024-01-01', gender: 'Female', dateOfBirth: '2005-07-30', guardianName: 'Sunil Agarwal', guardianPhone: '+91-9900001014' },
  { id: 'stu-015', studentId: 'STU-1015', userId: 'u-stu-15', name: 'Karan Malhotra', email: 'karan.malhotra@student.edu', phone: '+91-9900000015', departmentId: 'dept-cse', courseId: 'course-cse', semester: 5, rollNumber: 'CSE-5-001', status: 'active', joinedDate: '2021-08-01', gender: 'Male', dateOfBirth: '2002-06-11', guardianName: 'Vikram Malhotra', guardianPhone: '+91-9900001015' },
  { id: 'stu-016', studentId: 'STU-1016', userId: 'u-stu-16', name: 'Tanvi Desai', email: 'tanvi.desai@student.edu', phone: '+91-9900000016', departmentId: 'dept-ece', courseId: 'course-ece', semester: 4, rollNumber: 'ECE-4-001', status: 'active', joinedDate: '2022-08-01', gender: 'Female', dateOfBirth: '2003-09-23', guardianName: 'Nilesh Desai', guardianPhone: '+91-9900001016' },
  { id: 'stu-017', studentId: 'STU-1017', userId: 'u-stu-17', name: 'Akash Singh', email: 'akash.singh@student.edu', phone: '+91-9900000017', departmentId: 'dept-mech', courseId: 'course-mech', semester: 3, rollNumber: 'ME-3-001', status: 'active', joinedDate: '2023-08-01', gender: 'Male', dateOfBirth: '2004-04-07', guardianName: 'Balvir Singh', guardianPhone: '+91-9900001017' },
  { id: 'stu-018', studentId: 'STU-1018', userId: 'u-stu-18', name: 'Shreya Pillai', email: 'shreya.pillai@student.edu', phone: '+91-9900000018', departmentId: 'dept-it', courseId: 'course-it', semester: 6, rollNumber: 'IT-6-001', status: 'active', joinedDate: '2020-08-01', gender: 'Female', dateOfBirth: '2001-11-16', guardianName: 'Ajith Pillai', guardianPhone: '+91-9900001018' },
  { id: 'stu-019', studentId: 'STU-1019', userId: 'u-stu-19', name: 'Dev Chauhan', email: 'dev.chauhan@student.edu', phone: '+91-9900000019', departmentId: 'dept-cse', courseId: 'course-cse', semester: 3, rollNumber: 'CSE-3-001', status: 'active', joinedDate: '2023-08-01', gender: 'Male', dateOfBirth: '2004-02-28', guardianName: 'Jagdish Chauhan', guardianPhone: '+91-9900001019' },
  { id: 'stu-020', studentId: 'STU-1020', userId: 'u-stu-20', name: 'Lakshmi Reddy', email: 'lakshmi.reddy@student.edu', phone: '+91-9900000020', departmentId: 'dept-ece', courseId: 'course-ece', semester: 2, rollNumber: 'ECE-2-001', status: 'active', joinedDate: '2024-01-01', gender: 'Female', dateOfBirth: '2005-08-09', guardianName: 'Naresh Reddy', guardianPhone: '+91-9900001020' },
  { id: 'stu-021', studentId: 'STU-1021', userId: 'u-stu-21', name: 'Vikram Singh', email: 'vikram.s@student.edu', phone: '+91-9900000021', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-021', status: 'active', joinedDate: '2022-08-01', gender: 'Male', dateOfBirth: '2003-12-10', guardianName: 'Rajput Singh', guardianPhone: '+91-9900001021' },
  { id: 'stu-022', studentId: 'STU-1022', userId: 'u-stu-22', name: 'Neha Gupta', email: 'neha.g@student.edu', phone: '+91-9900000022', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-022', status: 'active', joinedDate: '2022-08-01', gender: 'Female', dateOfBirth: '2004-01-15', guardianName: 'Amit Gupta', guardianPhone: '+91-9900001022' },
  { id: 'stu-023', studentId: 'STU-1023', userId: 'u-stu-23', name: 'Rahul Verma', email: 'rahul.v@student.edu', phone: '+91-9900000023', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-023', status: 'active', joinedDate: '2022-08-01', gender: 'Male', dateOfBirth: '2003-11-20', guardianName: 'Sunil Verma', guardianPhone: '+91-9900001023' },
  { id: 'stu-024', studentId: 'STU-1024', userId: 'u-stu-24', name: 'Priya Sharma', email: 'priya.s@student.edu', phone: '+91-9900000024', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-024', status: 'active', joinedDate: '2022-08-01', gender: 'Female', dateOfBirth: '2004-05-05', guardianName: 'Ravi Sharma', guardianPhone: '+91-9900001024' },
  { id: 'stu-025', studentId: 'STU-1025', userId: 'u-stu-25', name: 'Aryan Patel', email: 'aryan.p@student.edu', phone: '+91-9900000025', departmentId: 'dept-cse', courseId: 'course-cse', semester: 4, rollNumber: 'CSE-4-025', status: 'active', joinedDate: '2022-08-01', gender: 'Male', dateOfBirth: '2003-08-25', guardianName: 'Dinesh Patel', guardianPhone: '+91-9900001025' },
];

export const FACULTY_STUDENT_IDS = [
  'stu-001', 'stu-002', 'stu-003', 'stu-009', 'stu-013', 'stu-015', 'stu-019',
  'stu-021', 'stu-022', 'stu-023', 'stu-024', 'stu-025'
];

// Generate 200 more realistic dummy students
const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Vivaan', 'Reyansh', 'Krishna', 'Ishaan', 'Shaurya', 'Aadhya', 'Diya', 'Kashvi', 'Saanvi', 'Ananya', 'Myra', 'Vanya', 'Kavya', 'Priya', 'Riya', 'Rahul', 'Rohan', 'Sneha', 'Neha', 'Pooja', 'Amit', 'Anjali', 'Karan', 'Kritika', 'Yash'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Malhotra', 'Singh', 'Patel', 'Reddy', 'Rao', 'Das', 'Kumar', 'Chauhan', 'Yadav', 'Joshi', 'Nair', 'Iyer', 'Menon', 'Bose', 'Desai', 'Pillai', 'Agarwal'];

for (let i = 26; i <= 225; i++) {
  const sId = `stu-${i.toString().padStart(3, '0')}`;
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[(i * 3) % lastNames.length];
  
  students.push({
    id: sId,
    studentId: `STU-${1000 + i}`,
    userId: `u-stu-${i}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@campusguard.edu`,
    phone: `+91-99000${i.toString().padStart(5, '0')}`,
    departmentId: i % 3 === 0 ? 'dept-it' : (i % 2 === 0 ? 'dept-ece' : 'dept-cse'),
    courseId: i % 3 === 0 ? 'course-it' : (i % 2 === 0 ? 'course-ece' : 'course-cse'),
    semester: (i % 8) + 1,
    rollNumber: `CSE-${(i % 8) + 1}-${i.toString().padStart(3, '0')}`,
    status: 'active',
    joinedDate: '2023-08-01',
    gender: i % 2 === 0 ? 'Female' : 'Male',
    dateOfBirth: '2004-01-01',
    guardianName: `${firstNames[(i + 5) % firstNames.length]} ${lastName}`,
    guardianPhone: `+91-88000${i.toString().padStart(5, '0')}`,
  });
  FACULTY_STUDENT_IDS.push(sId);
}

// ─── COURSES ──────────────────────────────────────────────────────────────────
export const courses = [
  { id: 'course-cse', name: 'B.Tech Computer Science & Engineering', code: 'BTCSE', departmentId: 'dept-cse', semesters: [1,2,3,4,5,6,7,8], subjectIds: ['sub-001','sub-002','sub-003','sub-004','sub-009','sub-014'], facultyIds: ['fac-001','fac-002'], studentIds: ['stu-001','stu-002','stu-003','stu-009','stu-013','stu-015','stu-019'], description: 'Four-year undergraduate program in Computer Science' },
  { id: 'course-it', name: 'B.Tech Information Technology', code: 'BTIT', departmentId: 'dept-it', semesters: [1,2,3,4,5,6,7,8], subjectIds: ['sub-005','sub-006','sub-007','sub-011'], facultyIds: ['fac-003','fac-006'], studentIds: ['stu-004','stu-005','stu-010','stu-014','stu-018'], description: 'Four-year undergraduate program in IT' },
  { id: 'course-ece', name: 'B.Tech Electronics & Communication', code: 'BTECE', departmentId: 'dept-ece', semesters: [1,2,3,4,5,6,7,8], subjectIds: ['sub-008','sub-013'], facultyIds: ['fac-004'], studentIds: ['stu-006','stu-007','stu-011','stu-016','stu-020'], description: 'Four-year undergraduate program in ECE' },
  { id: 'course-mech', name: 'B.Tech Mechanical Engineering', code: 'BTME', departmentId: 'dept-mech', semesters: [1,2,3,4,5,6,7,8], subjectIds: ['sub-010','sub-012','sub-015'], facultyIds: ['fac-005'], studentIds: ['stu-008','stu-012','stu-017'], description: 'Four-year undergraduate program in Mechanical Engineering' },
];

// ─── STUDENT SUBJECT ATTENDANCE ───────────────────────────────────────────────
export const studentSubjectAttendances: StudentSubjectAttendance[] = [
  // STU-1001 Aarav Mehta - 91% overall
  { studentId: 'stu-001', subjectId: 'sub-001', totalClasses: 32, present: 30, absent: 2, late: 0, excused: 0, percentage: 93.75, lastUpdated: '2024-01-15' },
  { studentId: 'stu-001', subjectId: 'sub-002', totalClasses: 30, present: 27, absent: 2, late: 1, excused: 0, percentage: 90, lastUpdated: '2024-01-15' },
  // STU-1002 Diya Sharma - 84%
  { studentId: 'stu-002', subjectId: 'sub-001', totalClasses: 32, present: 27, absent: 4, late: 1, excused: 0, percentage: 84.37, lastUpdated: '2024-01-15' },
  { studentId: 'stu-002', subjectId: 'sub-002', totalClasses: 30, present: 25, absent: 4, late: 1, excused: 0, percentage: 83.33, lastUpdated: '2024-01-15' },
  // STU-1003 Rohan Patel - 72%
  { studentId: 'stu-003', subjectId: 'sub-001', totalClasses: 32, present: 24, absent: 7, late: 1, excused: 0, percentage: 75, lastUpdated: '2024-01-15' },
  { studentId: 'stu-003', subjectId: 'sub-002', totalClasses: 30, present: 21, absent: 8, late: 1, excused: 0, percentage: 70, lastUpdated: '2024-01-15' },
  // STU-1004 Ananya Rao - 64%
  { studentId: 'stu-004', subjectId: 'sub-005', totalClasses: 26, present: 17, absent: 8, late: 1, excused: 0, percentage: 65.38, lastUpdated: '2024-01-15' },
  { studentId: 'stu-004', subjectId: 'sub-011', totalClasses: 20, present: 13, absent: 7, late: 0, excused: 0, percentage: 65, lastUpdated: '2024-01-15' },
  // STU-1005 Kabir Shah - 55%
  { studentId: 'stu-005', subjectId: 'sub-005', totalClasses: 26, present: 14, absent: 11, late: 1, excused: 0, percentage: 53.84, lastUpdated: '2024-01-15' },
  { studentId: 'stu-005', subjectId: 'sub-011', totalClasses: 20, present: 12, absent: 8, late: 0, excused: 0, percentage: 60, lastUpdated: '2024-01-15' },
  // New Students
  { studentId: 'stu-021', subjectId: 'sub-001', totalClasses: 32, present: 29, absent: 3, late: 0, excused: 0, percentage: 90.62, lastUpdated: '2024-01-15' },
  { studentId: 'stu-022', subjectId: 'sub-001', totalClasses: 32, present: 20, absent: 12, late: 0, excused: 0, percentage: 62.50, lastUpdated: '2024-01-15' },
  { studentId: 'stu-023', subjectId: 'sub-001', totalClasses: 32, present: 25, absent: 7, late: 0, excused: 0, percentage: 78.12, lastUpdated: '2024-01-15' },
  { studentId: 'stu-024', subjectId: 'sub-001', totalClasses: 32, present: 31, absent: 1, late: 0, excused: 0, percentage: 96.87, lastUpdated: '2024-01-15' },
  { studentId: 'stu-025', subjectId: 'sub-001', totalClasses: 32, present: 15, absent: 17, late: 0, excused: 0, percentage: 46.87, lastUpdated: '2024-01-15' },
  // STU-1006 Ishita Nair - 93%
  { studentId: 'stu-006', subjectId: 'sub-008', totalClasses: 28, present: 26, absent: 1, late: 1, excused: 0, percentage: 92.85, lastUpdated: '2024-01-15' },
  // STU-1007 Arjun Verma - 68%
  { studentId: 'stu-007', subjectId: 'sub-008', totalClasses: 28, present: 19, absent: 8, late: 1, excused: 0, percentage: 67.85, lastUpdated: '2024-01-15' },
  // STU-1008 Meera Iyer - 48%
  { studentId: 'stu-008', subjectId: 'sub-012', totalClasses: 25, present: 12, absent: 13, late: 0, excused: 0, percentage: 48, lastUpdated: '2024-01-15' },
  // STU-1009 Vivaan Gupta - 88%
  { studentId: 'stu-009', subjectId: 'sub-004', totalClasses: 35, present: 31, absent: 3, late: 1, excused: 0, percentage: 88.57, lastUpdated: '2024-01-15' },
  // STU-1010 Priya Krishnan - 76%
  { studentId: 'stu-010', subjectId: 'sub-006', totalClasses: 24, present: 18, absent: 5, late: 1, excused: 0, percentage: 75, lastUpdated: '2024-01-15' },
  { studentId: 'stu-010', subjectId: 'sub-007', totalClasses: 30, present: 23, absent: 6, late: 1, excused: 0, percentage: 76.66, lastUpdated: '2024-01-15' },
  // STU-1011 Aryan Bose - 61%
  { studentId: 'stu-011', subjectId: 'sub-013', totalClasses: 27, present: 17, absent: 9, late: 1, excused: 0, percentage: 62.96, lastUpdated: '2024-01-15' },
  // STU-1012 Nandita Joshi - 52%
  { studentId: 'stu-012', subjectId: 'sub-015', totalClasses: 26, present: 13, absent: 12, late: 1, excused: 0, percentage: 50, lastUpdated: '2024-01-15' },
  // STU-1013 Siddharth Menon - 79%
  { studentId: 'stu-013', subjectId: 'sub-009', totalClasses: 22, present: 17, absent: 4, late: 1, excused: 0, percentage: 77.27, lastUpdated: '2024-01-15' },
  { studentId: 'stu-013', subjectId: 'sub-014', totalClasses: 24, present: 19, absent: 4, late: 1, excused: 0, percentage: 79.16, lastUpdated: '2024-01-15' },
  // STU-1014 Riya Agarwal - 95%
  { studentId: 'stu-014', subjectId: 'sub-007', totalClasses: 30, present: 29, absent: 1, late: 0, excused: 0, percentage: 96.66, lastUpdated: '2024-01-15' },
  // STU-1015 Karan Malhotra - 58%
  { studentId: 'stu-015', subjectId: 'sub-003', totalClasses: 28, present: 16, absent: 11, late: 1, excused: 0, percentage: 57.14, lastUpdated: '2024-01-15' },
  { studentId: 'stu-015', subjectId: 'sub-014', totalClasses: 24, present: 14, absent: 9, late: 1, excused: 0, percentage: 58.33, lastUpdated: '2024-01-15' },
  // STU-1016 Tanvi Desai - 82%
  { studentId: 'stu-016', subjectId: 'sub-008', totalClasses: 28, present: 23, absent: 4, late: 1, excused: 0, percentage: 82.14, lastUpdated: '2024-01-15' },
  // STU-1017 Akash Singh - 70%
  { studentId: 'stu-017', subjectId: 'sub-010', totalClasses: 30, present: 21, absent: 8, late: 1, excused: 0, percentage: 70, lastUpdated: '2024-01-15' },
  // STU-1018 Shreya Pillai - 45%
  { studentId: 'stu-018', subjectId: 'sub-011', totalClasses: 20, present: 9, absent: 11, late: 0, excused: 0, percentage: 45, lastUpdated: '2024-01-15' },
  { studentId: 'stu-018', subjectId: 'sub-005', totalClasses: 26, present: 12, absent: 14, late: 0, excused: 0, percentage: 46.15, lastUpdated: '2024-01-15' },
  // STU-1019 Dev Chauhan - 86%
  { studentId: 'stu-019', subjectId: 'sub-004', totalClasses: 35, present: 30, absent: 4, late: 1, excused: 0, percentage: 85.71, lastUpdated: '2024-01-15' },
  // STU-1020 Lakshmi Reddy - 67%
  { studentId: 'stu-020', subjectId: 'sub-008', totalClasses: 28, present: 19, absent: 8, late: 1, excused: 0, percentage: 67.85, lastUpdated: '2024-01-15' },
];

// ─── COMPUTED OVERALL ATTENDANCE ───────────────────────────────────────────────
export const studentOverallAttendances: StudentOverallAttendance[] = [
  { studentId: 'stu-001', overallPercentage: 91, totalClasses: 62, totalPresent: 57, totalAbsent: 4, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-001'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 88 }, { week: 'W2', percentage: 90 }, { week: 'W3', percentage: 91 }, { week: 'W4', percentage: 91 }, { week: 'W5', percentage: 93 }] },
  { studentId: 'stu-002', overallPercentage: 84, totalClasses: 62, totalPresent: 52, totalAbsent: 8, totalLate: 2, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-002'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 85 }, { week: 'W2', percentage: 84 }, { week: 'W3', percentage: 82 }, { week: 'W4', percentage: 84 }, { week: 'W5', percentage: 84 }] },
  { studentId: 'stu-003', overallPercentage: 72, totalClasses: 62, totalPresent: 45, totalAbsent: 15, totalLate: 2, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-003'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 80 }, { week: 'W2', percentage: 78 }, { week: 'W3', percentage: 74 }, { week: 'W4', percentage: 72 }, { week: 'W5', percentage: 70 }] },
  { studentId: 'stu-004', overallPercentage: 64, totalClasses: 46, totalPresent: 30, totalAbsent: 15, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-004'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 70 }, { week: 'W2', percentage: 67 }, { week: 'W3', percentage: 65 }, { week: 'W4', percentage: 64 }, { week: 'W5', percentage: 62 }] },
  { studentId: 'stu-005', overallPercentage: 55, totalClasses: 46, totalPresent: 26, totalAbsent: 19, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-005'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 65 }, { week: 'W2', percentage: 60 }, { week: 'W3', percentage: 57 }, { week: 'W4', percentage: 55 }, { week: 'W5', percentage: 52 }] },
  { studentId: 'stu-006', overallPercentage: 93, totalClasses: 28, totalPresent: 26, totalAbsent: 1, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-006'), trend: 'improving', weeklyData: [{ week: 'W1', percentage: 90 }, { week: 'W2', percentage: 91 }, { week: 'W3', percentage: 92 }, { week: 'W4', percentage: 93 }, { week: 'W5', percentage: 93 }] },
  { studentId: 'stu-007', overallPercentage: 68, totalClasses: 28, totalPresent: 19, totalAbsent: 8, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-007'), trend: 'irregular', weeklyData: [{ week: 'W1', percentage: 72 }, { week: 'W2', percentage: 65 }, { week: 'W3', percentage: 70 }, { week: 'W4', percentage: 68 }, { week: 'W5', percentage: 65 }] },
  { studentId: 'stu-008', overallPercentage: 48, totalClasses: 25, totalPresent: 12, totalAbsent: 13, totalLate: 0, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-008'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 58 }, { week: 'W2', percentage: 54 }, { week: 'W3', percentage: 50 }, { week: 'W4', percentage: 48 }, { week: 'W5', percentage: 44 }] },
  { studentId: 'stu-009', overallPercentage: 88, totalClasses: 35, totalPresent: 31, totalAbsent: 3, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-009'), trend: 'improving', weeklyData: [{ week: 'W1', percentage: 84 }, { week: 'W2', percentage: 86 }, { week: 'W3', percentage: 87 }, { week: 'W4', percentage: 88 }, { week: 'W5', percentage: 89 }] },
  { studentId: 'stu-010', overallPercentage: 76, totalClasses: 54, totalPresent: 41, totalAbsent: 11, totalLate: 2, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-010'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 76 }, { week: 'W2', percentage: 75 }, { week: 'W3', percentage: 77 }, { week: 'W4', percentage: 76 }, { week: 'W5', percentage: 76 }] },
  { studentId: 'stu-011', overallPercentage: 61, totalClasses: 27, totalPresent: 17, totalAbsent: 9, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-011'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 68 }, { week: 'W2', percentage: 65 }, { week: 'W3', percentage: 63 }, { week: 'W4', percentage: 61 }, { week: 'W5', percentage: 60 }] },
  { studentId: 'stu-012', overallPercentage: 52, totalClasses: 26, totalPresent: 13, totalAbsent: 12, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-012'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 60 }, { week: 'W2', percentage: 57 }, { week: 'W3', percentage: 54 }, { week: 'W4', percentage: 52 }, { week: 'W5', percentage: 50 }] },
  { studentId: 'stu-013', overallPercentage: 79, totalClasses: 46, totalPresent: 36, totalAbsent: 8, totalLate: 2, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-013'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 78 }, { week: 'W2', percentage: 79 }, { week: 'W3', percentage: 80 }, { week: 'W4', percentage: 79 }, { week: 'W5', percentage: 79 }] },
  { studentId: 'stu-014', overallPercentage: 95, totalClasses: 30, totalPresent: 29, totalAbsent: 1, totalLate: 0, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-014'), trend: 'improving', weeklyData: [{ week: 'W1', percentage: 93 }, { week: 'W2', percentage: 94 }, { week: 'W3', percentage: 95 }, { week: 'W4', percentage: 95 }, { week: 'W5', percentage: 97 }] },
  { studentId: 'stu-015', overallPercentage: 58, totalClasses: 52, totalPresent: 30, totalAbsent: 20, totalLate: 2, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-015'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 66 }, { week: 'W2', percentage: 62 }, { week: 'W3', percentage: 59 }, { week: 'W4', percentage: 58 }, { week: 'W5', percentage: 55 }] },
  { studentId: 'stu-016', overallPercentage: 82, totalClasses: 28, totalPresent: 23, totalAbsent: 4, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-016'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 82 }, { week: 'W2', percentage: 81 }, { week: 'W3', percentage: 83 }, { week: 'W4', percentage: 82 }, { week: 'W5', percentage: 82 }] },
  { studentId: 'stu-017', overallPercentage: 70, totalClasses: 30, totalPresent: 21, totalAbsent: 8, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-017'), trend: 'stable', weeklyData: [{ week: 'W1', percentage: 72 }, { week: 'W2', percentage: 70 }, { week: 'W3', percentage: 70 }, { week: 'W4', percentage: 70 }, { week: 'W5', percentage: 69 }] },
  { studentId: 'stu-018', overallPercentage: 45, totalClasses: 46, totalPresent: 21, totalAbsent: 25, totalLate: 0, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-018'), trend: 'declining', weeklyData: [{ week: 'W1', percentage: 56 }, { week: 'W2', percentage: 51 }, { week: 'W3', percentage: 48 }, { week: 'W4', percentage: 45 }, { week: 'W5', percentage: 42 }] },
  { studentId: 'stu-019', overallPercentage: 86, totalClasses: 35, totalPresent: 30, totalAbsent: 4, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-019'), trend: 'improving', weeklyData: [{ week: 'W1', percentage: 83 }, { week: 'W2', percentage: 84 }, { week: 'W3', percentage: 85 }, { week: 'W4', percentage: 86 }, { week: 'W5', percentage: 87 }] },
  { studentId: 'stu-020', overallPercentage: 67, totalClasses: 28, totalPresent: 19, totalAbsent: 8, totalLate: 1, subjectAttendances: studentSubjectAttendances.filter(s => s.studentId === 'stu-020'), trend: 'irregular', weeklyData: [{ week: 'W1', percentage: 70 }, { week: 'W2', percentage: 65 }, { week: 'W3', percentage: 68 }, { week: 'W4', percentage: 67 }, { week: 'W5', percentage: 66 }] },
];

// ─── RISK RECORDS ─────────────────────────────────────────────────────────────
export const riskRecords: RiskRecord[] = [
  { id: 'risk-001', studentId: 'stu-001', level: 'low', score: 18, reason: 'Attendance is healthy at 91%', factors: ['Attendance: 91% (above threshold)', 'Trend: Stable', 'No recent absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-002', studentId: 'stu-002', level: 'low', score: 25, reason: 'Attendance at 84%, within acceptable range', factors: ['Attendance: 84% (above threshold)', 'Trend: Stable', 'Minor absence pattern'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-003', studentId: 'stu-003', level: 'medium', score: 52, reason: 'Attendance declining, approaching concern threshold', factors: ['Attendance: 72% (approaching threshold)', 'Trend: Declining for 3 weeks', '15 total absences', 'Absences increasing week-on-week'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-004', studentId: 'stu-004', level: 'medium', score: 61, reason: 'Attendance below 65%, consistent decline observed', factors: ['Attendance: 64% (below 65% threshold)', 'Trend: Declining', '15 absences this semester', 'Risk of not meeting minimum attendance'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-005', studentId: 'stu-005', level: 'high', score: 82, reason: 'Attendance critically low, strong decline trend', factors: ['Attendance: 55% (critical threshold breached)', 'Trend: Steadily declining', '19 absences this semester', 'Multiple consecutive absences in last 2 weeks', 'Open warning exists'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-006', studentId: 'stu-006', level: 'low', score: 10, reason: 'Excellent attendance at 93%', factors: ['Attendance: 93%', 'Trend: Improving', 'Only 1 absence this semester'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-007', studentId: 'stu-007', level: 'medium', score: 55, reason: 'Attendance at 68%, irregular pattern detected', factors: ['Attendance: 68% (below 70%)', 'Trend: Irregular', '8 absences', 'Pattern suggests missing specific days'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-008', studentId: 'stu-008', level: 'high', score: 91, reason: 'Attendance at critical low of 48%, severe decline', factors: ['Attendance: 48% (critically below threshold)', 'Trend: Rapidly declining', '13 absences this semester', 'Risk of academic penalty', 'Two open warnings'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-009', studentId: 'stu-009', level: 'low', score: 20, reason: 'Attendance at 88%, improving trend', factors: ['Attendance: 88%', 'Trend: Improving', '3 total absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-010', studentId: 'stu-010', level: 'low', score: 32, reason: 'Attendance at 76%, stable', factors: ['Attendance: 76% (above minimum)', 'Trend: Stable', '11 absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-011', studentId: 'stu-011', level: 'medium', score: 65, reason: 'Attendance declining below 65%', factors: ['Attendance: 61% (below 65%)', 'Trend: Declining', '9 absences', 'At risk of missing minimum'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-012', studentId: 'stu-012', level: 'high', score: 78, reason: 'Attendance at 52%, high absenteeism detected', factors: ['Attendance: 52% (critical)', 'Trend: Declining', '12 absences', 'Multiple consecutive absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-013', studentId: 'stu-013', level: 'low', score: 28, reason: 'Attendance at 79%, acceptable range', factors: ['Attendance: 79%', 'Trend: Stable', '8 absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-014', studentId: 'stu-014', level: 'low', score: 8, reason: 'Excellent attendance at 95%', factors: ['Attendance: 95%', 'Trend: Improving', 'Only 1 absence'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-015', studentId: 'stu-015', level: 'high', score: 85, reason: 'Attendance at 58%, declining trend with 20 absences', factors: ['Attendance: 58% (critical)', 'Trend: Declining', '20 absences this semester', 'Pattern of consecutive Monday absences', 'Open warning exists'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-016', studentId: 'stu-016', level: 'low', score: 22, reason: 'Attendance at 82%, stable', factors: ['Attendance: 82%', 'Trend: Stable', '4 absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-017', studentId: 'stu-017', level: 'medium', score: 45, reason: 'Attendance at 70%, borderline', factors: ['Attendance: 70% (at threshold)', 'Trend: Stable', '8 absences', 'Risk if any more absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-018', studentId: 'stu-018', level: 'high', score: 94, reason: 'Attendance at 45% — critical failure risk', factors: ['Attendance: 45% (critically low)', 'Trend: Rapidly declining', '25 absences this semester', 'Multiple open warnings', 'Academic failure risk'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-019', studentId: 'stu-019', level: 'low', score: 21, reason: 'Attendance at 86%, improving trend', factors: ['Attendance: 86%', 'Trend: Improving', '4 absences'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'risk-020', studentId: 'stu-020', level: 'medium', score: 50, reason: 'Attendance at 67%, irregular pattern', factors: ['Attendance: 67% (below 70%)', 'Trend: Irregular', '8 absences', 'Attendance varies weekly'], createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
];

// ─── WARNINGS ─────────────────────────────────────────────────────────────────
export const warnings: Warning[] = [
  {
    id: 'wrn-001', warningId: 'WRN-1038', studentId: 'stu-005', issuedByFacultyId: 'fac-003',
    type: 'critical_attendance', title: 'Critical Attendance Warning',
    message: 'Attendance has fallen below the critical threshold of 60%.',
    severity: 'high', status: 'open',
    reason: 'Attendance has dropped to 55%, significantly below the required 75% minimum.',
    riskFactors: ['Attendance: 55%', 'Trend: Declining', '19 absences', 'Multiple consecutive absences'],
    createdAt: '2024-01-10T09:00:00Z', updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'wrn-002', warningId: 'WRN-1039', studentId: 'stu-008', issuedByFacultyId: 'fac-005',
    type: 'critical_attendance', title: 'Critical Attendance Warning',
    message: 'Attendance is at 48% — immediate attention required.',
    severity: 'high', status: 'acknowledged',
    reason: 'Attendance has dropped to 48%. Student is at risk of academic penalty.',
    riskFactors: ['Attendance: 48%', 'Trend: Rapidly declining', '13 absences'],
    createdAt: '2024-01-08T10:00:00Z', updatedAt: '2024-01-12T11:00:00Z',
    acknowledgedBy: 'Dr. Kavita Rao', acknowledgedAt: '2024-01-12T11:00:00Z',
  },
  {
    id: 'wrn-003', warningId: 'WRN-1040', studentId: 'stu-008', issuedByFacultyId: 'fac-005',
    type: 'declining_trend', title: 'Declining Attendance Trend',
    message: 'Attendance trend has declined for three consecutive weeks.',
    severity: 'medium', status: 'resolved',
    reason: 'Attendance dropped from 65% to 48% over 3 weeks.',
    riskFactors: ['Attendance: 48%', 'Declining trend: 3 weeks'],
    createdAt: '2024-01-01T09:00:00Z', updatedAt: '2024-01-08T14:00:00Z',
    acknowledgedBy: 'Dr. Kavita Rao', acknowledgedAt: '2024-01-05T10:00:00Z',
    resolvedBy: 'Dr. Kavita Rao', resolvedAt: '2024-01-08T14:00:00Z',
    resolvedNote: 'Student counselled. Follow-up scheduled.',
  },
  {
    id: 'wrn-004', warningId: 'WRN-1041', studentId: 'stu-015', issuedByFacultyId: 'fac-002',
    type: 'repeated_absences', title: 'Repeated Absences in Computer Networks',
    message: 'Repeated absences detected in Computer Networks (CN501).',
    severity: 'high', status: 'open',
    reason: 'Student has missed 11 out of 28 classes in Computer Networks.',
    riskFactors: ['CN501 attendance: 57%', 'Trend: Declining', '11 absences in CN501'],
    createdAt: '2024-01-12T09:00:00Z', updatedAt: '2024-01-12T09:00:00Z',
  },
  {
    id: 'wrn-005', warningId: 'WRN-1042', studentId: 'stu-018', issuedByFacultyId: 'fac-003',
    type: 'critical_attendance', title: 'Critical Attendance — Academic Risk',
    message: 'Attendance at 45%. Risk of academic failure this semester.',
    severity: 'high', status: 'acknowledged',
    reason: 'Attendance has dropped to 45%. Student may not be eligible for examinations.',
    riskFactors: ['Attendance: 45%', 'Trend: Rapidly declining', '25 absences', 'Exam eligibility at risk'],
    createdAt: '2024-01-09T10:00:00Z', updatedAt: '2024-01-14T09:00:00Z',
    acknowledgedBy: 'Dr. Priya Nair', acknowledgedAt: '2024-01-14T09:00:00Z',
  },
  {
    id: 'wrn-006', warningId: 'WRN-1043', studentId: 'stu-012', issuedByFacultyId: 'fac-005',
    type: 'declining_trend', title: 'Attendance Declining — Action Required',
    message: 'Attendance trend has declined for three consecutive weeks in Fluid Mechanics.',
    severity: 'medium', status: 'open',
    reason: 'Attendance dropped from 65% to 52% in the last 3 weeks.',
    riskFactors: ['Attendance: 52%', 'Trend: Declining', '12 absences'],
    createdAt: '2024-01-11T10:00:00Z', updatedAt: '2024-01-11T10:00:00Z',
  },
  {
    id: 'wrn-007', warningId: 'WRN-1044', studentId: 'stu-003', issuedByFacultyId: 'fac-001',
    type: 'below_threshold', title: 'Attendance Below Recommended Level',
    message: 'Attendance at 72%, approaching the concern threshold.',
    severity: 'medium', status: 'open',
    reason: 'Attendance has been declining for 3 consecutive weeks.',
    riskFactors: ['Attendance: 72%', 'Trend: Declining', '15 absences'],
    createdAt: '2024-01-13T09:00:00Z', updatedAt: '2024-01-13T09:00:00Z',
  },
  {
    id: 'wrn-008', warningId: 'WRN-1045', studentId: 'stu-011', issuedByFacultyId: 'fac-004',
    type: 'repeated_absences', title: 'Repeated Absences in Signal Processing',
    message: 'Student has missed 9 of 27 classes in Signal Processing.',
    severity: 'medium', status: 'resolved',
    reason: 'Attendance in SP501 dropped to 62%.',
    riskFactors: ['SP501 attendance: 62%', '9 absences in SP501'],
    createdAt: '2023-12-20T09:00:00Z', updatedAt: '2024-01-05T11:00:00Z',
    acknowledgedBy: 'Prof. Amit Patel', acknowledgedAt: '2023-12-22T10:00:00Z',
    resolvedBy: 'Prof. Amit Patel', resolvedAt: '2024-01-05T11:00:00Z',
    resolvedNote: 'Student submitted medical certificates for absences.',
  },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: 'notif-001', targetUserId: 'u-admin-1', title: 'New High-Risk Warning', message: 'New high-risk warning generated for Kabir Shah (STU-1005). Immediate attention may be required.', type: 'warning', read: false, createdAt: '2024-01-10T09:05:00Z', link: '/admin/warnings/wrn-001', relatedEntityId: 'wrn-001', relatedEntityType: 'warning' },
  { id: 'notif-002', targetUserId: 'u-admin-1', title: 'Critical Attendance Alert', message: 'Shreya Pillai (STU-1018) has attendance below 50%. Academic failure risk is high.', type: 'error', read: false, createdAt: '2024-01-09T10:10:00Z', link: '/admin/students/stu-018', relatedEntityId: 'stu-018', relatedEntityType: 'student' },
  { id: 'notif-003', targetUserId: 'u-admin-1', title: 'Attendance Recorded — DBMS', message: 'DBMS attendance for Semester 4 CSE has been successfully recorded by Dr. Neha Sharma.', type: 'success', read: true, createdAt: '2024-01-15T09:30:00Z' },
  { id: 'notif-004', targetUserId: 'u-admin-1', title: 'Warning Acknowledged', message: 'Warning WRN-1042 for Shreya Pillai has been acknowledged by Dr. Priya Nair.', type: 'info', read: true, createdAt: '2024-01-14T09:00:00Z', link: '/admin/warnings/wrn-005' },
  { id: 'notif-005', targetUserId: 'u-admin-1', title: 'System Maintenance Scheduled', message: 'Scheduled system maintenance on Sunday, Jan 21, 2024 from 2:00 AM to 4:00 AM. Minimal disruption expected.', type: 'info', read: false, createdAt: '2024-01-14T08:00:00Z' },
  { id: 'notif-006', targetUserId: 'u-admin-1', title: 'New Faculty Added', message: 'Prof. Arjun Singh (FAC-006) has been successfully added to the IT department.', type: 'success', read: true, createdAt: '2024-01-08T11:00:00Z' },
  // Faculty notifications
  { id: 'notif-007', targetUserId: 'u-fac-1', title: 'Attendance Recorded Successfully', message: 'Attendance for DBMS (Jan 15) has been recorded. 30 present, 2 absent.', type: 'success', read: true, createdAt: '2024-01-15T09:30:00Z' },
  { id: 'notif-008', targetUserId: 'u-fac-1', title: 'Student Risk Alert', message: 'Rohan Patel (STU-1003) has entered MEDIUM risk. Attendance has dropped to 72%.', type: 'warning', read: false, createdAt: '2024-01-13T10:00:00Z', link: '/faculty/students/stu-003' },
  { id: 'notif-009', targetUserId: 'u-fac-1', title: 'Warning Generated', message: 'A medium severity warning (WRN-1044) has been auto-generated for Rohan Patel.', type: 'warning', read: false, createdAt: '2024-01-13T10:05:00Z' },
  { id: 'notif-010', targetUserId: 'u-fac-1', title: 'Reminder: Pending Attendance', message: 'Operating Systems attendance for Jan 13 has not been recorded yet.', type: 'info', read: false, createdAt: '2024-01-13T18:00:00Z' },
  // Student notifications
  { id: 'notif-011', targetUserId: 'u-stu-1', title: 'Attendance Update', message: 'Your DBMS attendance for Jan 15 has been recorded as Present.', type: 'success', read: true, createdAt: '2024-01-15T09:35:00Z' },
  { id: 'notif-012', targetUserId: 'u-stu-1', title: 'Monthly Attendance Summary', message: 'Your overall attendance for January is 91%. Keep it up!', type: 'info', read: false, createdAt: '2024-01-15T08:00:00Z' },
  { id: 'notif-013', targetUserId: 'u-fac-3', title: 'Critical Alert: Kabir Shah', message: 'Kabir Shah (STU-1005) attendance has dropped to 55%. A warning has been generated.', type: 'error', read: false, createdAt: '2024-01-10T09:05:00Z' },
  { id: 'notif-014', targetUserId: 'u-fac-3', title: 'Warning Resolved — Aryan Bose', message: 'Warning WRN-1045 for Aryan Bose has been resolved. Student submitted medical certificates.', type: 'success', read: true, createdAt: '2024-01-05T11:05:00Z' },
  { id: 'notif-015', targetUserId: 'u-fac-5', title: 'Student Counselling Required', message: 'Meera Iyer (STU-1008) attendance is at 48%. Immediate counselling is recommended.', type: 'error', read: false, createdAt: '2024-01-12T10:00:00Z' },
];

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: 'log-001', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'CREATE', resource: 'Student', resourceId: 'stu-020', details: 'Created student record for Lakshmi Reddy (STU-1020)', timestamp: '2024-01-10T08:30:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-002', userId: 'u-fac-1', userName: 'Dr. Neha Sharma', userRole: 'faculty', action: 'RECORD', resource: 'Attendance', resourceId: 'sub-001', details: 'Recorded DBMS attendance for Jan 15, 2024. 30 present, 2 absent.', timestamp: '2024-01-15T09:25:00Z', ipAddress: '192.168.1.15' },
  { id: 'log-003', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'UPDATE', resource: 'Course', resourceId: 'course-cse', details: 'Updated B.Tech CSE course — added sub-014 (Machine Learning)', timestamp: '2024-01-12T11:00:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-004', userId: 'u-fac-5', userName: 'Dr. Kavita Rao', userRole: 'faculty', action: 'ACKNOWLEDGE', resource: 'Warning', resourceId: 'wrn-002', details: 'Acknowledged warning WRN-1039 for Meera Iyer', timestamp: '2024-01-12T11:00:00Z', ipAddress: '192.168.1.18' },
  { id: 'log-005', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'GENERATE', resource: 'RiskAssessment', details: 'Automated risk assessment generated for all 20 students', timestamp: '2024-01-15T07:00:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-006', userId: 'u-fac-5', userName: 'Dr. Kavita Rao', userRole: 'faculty', action: 'RESOLVE', resource: 'Warning', resourceId: 'wrn-003', details: 'Resolved warning WRN-1040 for Meera Iyer. Note: Student counselled.', timestamp: '2024-01-08T14:00:00Z', ipAddress: '192.168.1.18' },
  { id: 'log-007', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'CREATE', resource: 'Faculty', resourceId: 'fac-006', details: 'Created faculty record for Prof. Arjun Singh (FAC-006)', timestamp: '2024-01-08T10:55:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-008', userId: 'u-fac-2', userName: 'Prof. Rahul Mehta', userRole: 'faculty', action: 'RECORD', resource: 'Attendance', resourceId: 'sub-003', details: 'Recorded Computer Networks attendance for Jan 14. 16 present, 10 absent, 2 late.', timestamp: '2024-01-14T10:30:00Z', ipAddress: '192.168.1.16' },
  { id: 'log-009', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'DEACTIVATE', resource: 'Student', details: 'No deactivations this period', timestamp: '2024-01-07T09:00:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-010', userId: 'u-fac-4', userName: 'Prof. Amit Patel', userRole: 'faculty', action: 'RESOLVE', resource: 'Warning', resourceId: 'wrn-008', details: 'Resolved warning WRN-1045 for Aryan Bose. Student submitted medical certificates.', timestamp: '2024-01-05T11:00:00Z', ipAddress: '192.168.1.17' },
  { id: 'log-011', userId: 'u-fac-3', userName: 'Dr. Priya Nair', userRole: 'faculty', action: 'ACKNOWLEDGE', resource: 'Warning', resourceId: 'wrn-005', details: 'Acknowledged warning WRN-1042 for Shreya Pillai', timestamp: '2024-01-14T09:00:00Z', ipAddress: '192.168.1.16' },
  { id: 'log-012', userId: 'u-admin-2', userName: 'Sarah Williams', userRole: 'admin', action: 'EXPORT', resource: 'Report', details: 'Exported monthly attendance report for December 2023', timestamp: '2024-01-03T14:00:00Z', ipAddress: '192.168.1.11' },
  { id: 'log-013', userId: 'u-fac-1', userName: 'Dr. Neha Sharma', userRole: 'faculty', action: 'RECORD', resource: 'Attendance', resourceId: 'sub-002', details: 'Recorded Operating Systems attendance for Jan 13. 21 present, 8 absent, 1 late.', timestamp: '2024-01-13T11:00:00Z', ipAddress: '192.168.1.15' },
  { id: 'log-014', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'UPDATE', resource: 'Settings', details: 'Updated risk threshold — medium threshold changed from 65% to 70%', timestamp: '2024-01-02T10:00:00Z', ipAddress: '192.168.1.10' },
  { id: 'log-015', userId: 'u-admin-1', userName: 'Admin User', userRole: 'admin', action: 'LOGIN', resource: 'System', details: 'Admin logged in successfully', timestamp: '2024-01-15T09:00:00Z', ipAddress: '192.168.1.10' },
];

// ─── SYSTEM SETTINGS ──────────────────────────────────────────────────────────
export const defaultSettings: SystemSettings = {
  institutionName: 'CampusGuard University',
  academicYear: '2023-24',
  attendanceLowThreshold: 75,
  attendanceMediumThreshold: 65,
  workingDaysPerWeek: 5,
  autoWarningEnabled: true,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  riskRecalculationFrequency: 'daily',
  sessionTimeout: 30,
};

// ─── DEPARTMENT STATS ─────────────────────────────────────────────────────────
export const departmentStats: DepartmentStats[] = [
  { departmentId: 'dept-cse', departmentName: 'Computer Science & Engineering', studentCount: 7, avgAttendance: 80, highRiskCount: 1, mediumRiskCount: 1, openWarnings: 1 },
  { departmentId: 'dept-it', departmentName: 'Information Technology', studentCount: 5, avgAttendance: 67, highRiskCount: 2, mediumRiskCount: 1, openWarnings: 2 },
  { departmentId: 'dept-ece', departmentName: 'Electronics & Communication', studentCount: 5, avgAttendance: 74, highRiskCount: 0, mediumRiskCount: 3, openWarnings: 0 },
  { departmentId: 'dept-mech', departmentName: 'Mechanical Engineering', studentCount: 3, avgAttendance: 57, highRiskCount: 2, mediumRiskCount: 1, openWarnings: 1 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function getStudentOverallAttendance(studentId: string): StudentOverallAttendance | undefined {
  return studentOverallAttendances.find(a => a.studentId === studentId);
}

export function getStudentRisk(studentId: string): RiskRecord | undefined {
  return riskRecords.find(r => r.studentId === studentId);
}

export function getStudentWarnings(studentId: string): Warning[] {
  return warnings.filter(w => w.studentId === studentId);
}

export function getStudentNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.targetUserId === userId);
}

export function getFacultySubjects(facultyId: string): Subject[] {
  const fac = faculty.find(f => f.id === facultyId);
  if (!fac) return [];
  return subjects.filter(s => fac.subjectIds.includes(s.id));
}

export function getDepartmentById(id: string): Department | undefined {
  return departments.find(d => d.id === id);
}

export function getSubjectById(id: string): Subject | undefined {
  return subjects.find(s => s.id === id);
}

export function getCourseById(id: string) {
  return courses.find(c => c.id === id);
}

export function getFacultyById(id: string): Faculty | undefined {
  return faculty.find(f => f.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function computeRiskLevel(percentage: number): import('../types').RiskLevel {
  if (percentage >= 75) return 'low';
  if (percentage >= 65) return 'medium';
  return 'high';
}

export const weeklyAttendanceTrend = [
  { week: 'Week 1 (Dec 4)', present: 285, absent: 45, late: 12, percentage: 84.2 },
  { week: 'Week 2 (Dec 11)', present: 278, absent: 52, late: 10, percentage: 82.1 },
  { week: 'Week 3 (Dec 18)', present: 291, absent: 39, late: 8, percentage: 85.9 },
  { week: 'Week 4 (Jan 8)', present: 267, absent: 63, late: 14, percentage: 78.8 },
  { week: 'Week 5 (Jan 15)', present: 274, absent: 56, late: 11, percentage: 80.9 },
];

export const warningTrend = [
  { month: 'Sep', open: 2, acknowledged: 1, resolved: 0 },
  { month: 'Oct', open: 3, acknowledged: 2, resolved: 1 },
  { month: 'Nov', open: 4, acknowledged: 3, resolved: 2 },
  { month: 'Dec', open: 5, acknowledged: 2, resolved: 3 },
  { month: 'Jan', open: 4, acknowledged: 2, resolved: 2 },
];

try {
  const customFacRaw = localStorage.getItem('custom_faculty');
  const customUsersRaw = localStorage.getItem('custom_users');
  let customFac = customFacRaw ? JSON.parse(customFacRaw) : [];
  let customFacChanged = false;

  // Auto-heal: if a faculty user exists in auth but not in faculty directory
  if (customUsersRaw) {
    const customUsers = JSON.parse(customUsersRaw);
    for (const cu of customUsers) {
      if (cu.user.role === 'faculty') {
        const exists = customFac.find((f: any) => f.userId === cu.user.id);
        if (!exists) {
          const newFac = {
            id: `fac-healed-${cu.user.id}`,
            facultyId: `FAC-${1000 + faculty.length + customFac.length + 1}`,
            userId: cu.user.id,
            name: cu.user.name,
            email: cu.user.email,
            phone: '',
            departmentId: 'dept-cse',
            designation: 'Faculty',
            qualification: '',
            experience: 1,
            status: 'active',
            joinedDate: new Date().toISOString().split('T')[0],
            subjectIds: ['sub-001'] // Auto-assign a default subject so it's not 0
          };
          customFac.push(newFac);
          customFacChanged = true;
        }
      }
    }
  }

  if (customFacChanged) {
    localStorage.setItem('custom_faculty', JSON.stringify(customFac));
  }

  if (Array.isArray(customFac)) {
    faculty.push(...customFac);
  }
} catch (e) {
  // ignore local storage errors
}

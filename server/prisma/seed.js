"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seed...');
    // 1. Clear existing data
    await prisma.attendanceRecord.deleteMany({});
    await prisma.warning.deleteMany({});
    await prisma.riskFactor.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.classSchedule.deleteMany({});
    await prisma.user.deleteMany({});
    // 2. Create Users
    const adminPassword = await bcryptjs_1.default.hash('Admin@123', 10);
    const facultyPassword = await bcryptjs_1.default.hash('Faculty@123', 10);
    const studentPassword = await bcryptjs_1.default.hash('Student@123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@campusguard.edu',
            passwordHash: adminPassword,
            name: 'Dr. Sarah Mitchell',
            role: 'admin',
            department: 'Computer Science & Engineering',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        },
    });
    const faculty = await prisma.user.create({
        data: {
            email: 'faculty@campusguard.edu',
            passwordHash: facultyPassword,
            name: 'Prof. Marcus Vance',
            role: 'faculty',
            department: 'Computer Science & Engineering',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        },
    });
    const studentUser = await prisma.user.create({
        data: {
            email: 'student@campusguard.edu',
            passwordHash: studentPassword,
            name: 'Devon Lane',
            role: 'student',
            department: 'Computer Science & Engineering',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        },
    });
    console.log('✅ Created initial users (admin, faculty, student)');
    // 3. Create Students
    const initialStudents = [
        {
            studentId: 'STU-2024-001',
            rollNo: 'CS21B001',
            name: 'Devon Lane',
            email: 'student@campusguard.edu',
            department: 'Computer Science & Engineering',
            semester: 6,
            section: 'A',
            totalClasses: 48,
            attendedClasses: 32,
            attendanceRate: 66.7,
            riskLevel: 'high',
            riskScore: 78,
            academicScore: 68,
            cgpa: 7.2,
            contactPhone: '+1 (555) 234-5678',
            parentPhone: '+1 (555) 876-5432',
            parentEmail: 'parents.lane@example.com',
            address: '742 Evergreen Terrace, Springfield',
            status: 'active',
        },
        {
            studentId: 'STU-2024-002',
            rollNo: 'CS21B002',
            name: 'Courtney Henry',
            email: 'courtney.h@campusguard.edu',
            department: 'Computer Science & Engineering',
            semester: 6,
            section: 'A',
            totalClasses: 48,
            attendedClasses: 44,
            attendanceRate: 91.7,
            riskLevel: 'low',
            riskScore: 12,
            academicScore: 88,
            cgpa: 8.9,
            contactPhone: '+1 (555) 345-6789',
            parentPhone: '+1 (555) 987-6543',
            parentEmail: 'parents.henry@example.com',
            address: '123 Main St, Springfield',
            status: 'active',
        },
        {
            studentId: 'STU-2024-003',
            rollNo: 'CS21B003',
            name: 'Jerome Bell',
            email: 'jerome.b@campusguard.edu',
            department: 'Computer Science & Engineering',
            semester: 6,
            section: 'B',
            totalClasses: 48,
            attendedClasses: 27,
            attendanceRate: 56.3,
            riskLevel: 'critical',
            riskScore: 92,
            academicScore: 54,
            cgpa: 5.8,
            contactPhone: '+1 (555) 456-7890',
            parentPhone: '+1 (555) 098-7654',
            parentEmail: 'parents.bell@example.com',
            address: '456 Oak Ave, Springfield',
            status: 'active',
        },
        {
            studentId: 'STU-2024-004',
            rollNo: 'EC21B012',
            name: 'Kathryn Murphy',
            email: 'kathryn.m@campusguard.edu',
            department: 'Electronics & Communication',
            semester: 6,
            section: 'A',
            totalClasses: 45,
            attendedClasses: 34,
            attendanceRate: 75.6,
            riskLevel: 'medium',
            riskScore: 42,
            academicScore: 74,
            cgpa: 7.5,
            contactPhone: '+1 (555) 567-8901',
            parentPhone: '+1 (555) 109-8765',
            parentEmail: 'parents.murphy@example.com',
            address: '789 Pine Rd, Springfield',
            status: 'active',
        },
        {
            studentId: 'STU-2024-005',
            rollNo: 'ME21B008',
            name: 'Cody Fisher',
            email: 'cody.f@campusguard.edu',
            department: 'Mechanical Engineering',
            semester: 4,
            section: 'A',
            totalClasses: 42,
            attendedClasses: 24,
            attendanceRate: 57.1,
            riskLevel: 'critical',
            riskScore: 88,
            academicScore: 59,
            cgpa: 6.1,
            contactPhone: '+1 (555) 678-9012',
            parentPhone: '+1 (555) 210-9876',
            parentEmail: 'parents.fisher@example.com',
            address: '321 Elm St, Springfield',
            status: 'active',
        },
        {
            studentId: 'STU-2024-006',
            rollNo: 'CS21B015',
            name: 'Bessie Cooper',
            email: 'bessie.c@campusguard.edu',
            department: 'Computer Science & Engineering',
            semester: 4,
            section: 'B',
            totalClasses: 44,
            attendedClasses: 41,
            attendanceRate: 93.2,
            riskLevel: 'low',
            riskScore: 8,
            academicScore: 92,
            cgpa: 9.4,
            contactPhone: '+1 (555) 789-0123',
            parentPhone: '+1 (555) 321-0987',
            parentEmail: 'parents.cooper@example.com',
            address: '654 Maple Dr, Springfield',
            status: 'active',
        },
    ];
    for (const s of initialStudents) {
        const student = await prisma.student.create({ data: s });
        // Create realistic warnings for students with low attendance
        if (s.riskLevel === 'critical' || s.riskLevel === 'high') {
            await prisma.warning.create({
                data: {
                    studentId: student.id,
                    title: 'Critical Attendance Shortage',
                    message: `Attendance is currently at ${s.attendanceRate}%, which is below the mandatory 75% threshold required to appear in final exams.`,
                    level: s.riskLevel === 'critical' ? 'critical' : 'warning',
                    category: 'attendance',
                    date: '2024-03-15',
                    acknowledged: false,
                },
            });
            await prisma.riskFactor.create({
                data: {
                    studentId: student.id,
                    factor: 'Consecutive Friday and Monday absences',
                    impact: 'high',
                    recommendation: 'Schedule 1-on-1 academic counseling',
                },
            });
        }
        // Add some sample attendance records
        await prisma.attendanceRecord.createMany({
            data: [
                {
                    studentId: student.id,
                    date: '2024-03-20',
                    status: s.attendanceRate > 75 ? 'present' : 'absent',
                    subject: 'Database Management Systems',
                    facultyId: faculty.id,
                },
                {
                    studentId: student.id,
                    date: '2024-03-21',
                    status: 'present',
                    subject: 'Operating Systems',
                    facultyId: faculty.id,
                },
                {
                    studentId: student.id,
                    date: '2024-03-22',
                    status: s.attendanceRate > 80 ? 'present' : 'late',
                    subject: 'Computer Networks',
                    facultyId: faculty.id,
                },
            ],
        });
    }
    console.log(`✅ Seeded ${initialStudents.length} students with attendance and risk factors`);
    // 4. Create Classes
    await prisma.classSchedule.createMany({
        data: [
            {
                code: 'CS301',
                name: 'Database Management Systems',
                department: 'Computer Science & Engineering',
                semester: 6,
                section: 'A',
                facultyId: faculty.id,
                facultyName: faculty.name,
                schedule: 'Mon, Wed 10:00 AM - 11:30 AM',
                totalStudents: 42,
                room: 'Lab 3B',
            },
            {
                code: 'CS302',
                name: 'Operating Systems',
                department: 'Computer Science & Engineering',
                semester: 6,
                section: 'A',
                facultyId: faculty.id,
                facultyName: faculty.name,
                schedule: 'Tue, Thu 02:00 PM - 03:30 PM',
                totalStudents: 40,
                room: 'Room 401',
            },
            {
                code: 'CS304',
                name: 'Software Engineering',
                department: 'Computer Science & Engineering',
                semester: 6,
                section: 'B',
                facultyId: faculty.id,
                facultyName: faculty.name,
                schedule: 'Fri 09:00 AM - 12:00 PM',
                totalStudents: 38,
                room: 'Seminar Hall 2',
            },
        ],
    });
    console.log('✅ Seeded classes');
    // 5. Create Notifications for Admin and Faculty
    await prisma.notification.createMany({
        data: [
            {
                userId: admin.id,
                title: 'Critical Warning Issued',
                message: 'Jerome Bell (CS21B003) reached critical risk level (56.3% attendance).',
                type: 'warning',
                date: '10 minutes ago',
                read: false,
            },
            {
                userId: admin.id,
                title: 'Weekly Report Generated',
                message: 'Week 8 campus-wide attendance analysis is ready to view.',
                type: 'info',
                date: '2 hours ago',
                read: true,
            },
            {
                userId: faculty.id,
                title: 'Attendance Reminder',
                message: 'Please submit today’s attendance for Database Management Systems (CS301).',
                type: 'alert',
                date: '30 minutes ago',
                read: false,
            },
        ],
    });
    console.log('✅ Seeded notifications');
    console.log('🎉 Database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

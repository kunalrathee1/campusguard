import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateRisk } from './students.routes.js';

const router = Router();

// POST /api/attendance/mark - Mark attendance for students
router.post('/mark', authenticateToken, requireRoles('admin', 'faculty'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { subject, date = new Date().toISOString().split('T')[0], records } = req.body;
    // records: Array<{ studentId: string; status: 'present' | 'absent' | 'late' | 'excused' }>

    if (!subject || !Array.isArray(records) || records.length === 0) {
      res.status(400).json({ success: false, message: 'Subject and non-empty records array are required' });
      return;
    }

    const createdRecords = [];

    for (const item of records) {
      const { studentId, status } = item;
      const rec = await prisma.attendanceRecord.create({
        data: {
          studentId,
          subject,
          date,
          status,
          facultyId: req.user?.id,
        },
      });
      createdRecords.push(rec);

      // Update student's total and attended classes
      const student = await prisma.student.findUnique({ where: { id: studentId } });
      if (student) {
        const newTotal = student.totalClasses + 1;
        const newAttended = status === 'present' || status === 'late' ? student.attendedClasses + 1 : student.attendedClasses;
        const newRate = Math.round((newAttended / newTotal) * 1000) / 10;
        const { riskLevel, riskScore } = calculateRisk(newRate, student.academicScore ?? 75);

        await prisma.student.update({
          where: { id: studentId },
          data: {
            totalClasses: newTotal,
            attendedClasses: newAttended,
            attendanceRate: newRate,
            riskLevel,
            riskScore,
          },
        });

        // If attendance falls below 75%, create an automatic warning if none issued recently
        if (newRate < 75 && student.attendanceRate >= 75) {
          await prisma.warning.create({
            data: {
              studentId,
              title: 'Low Attendance Alert',
              message: `Attendance has dropped to ${newRate}% in ${subject}. Threshold is 75%.`,
              level: newRate < 60 ? 'critical' : 'warning',
              category: 'attendance',
              date,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: `Marked attendance for ${createdRecords.length} students`,
      data: createdRecords,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ success: false, message: 'Failed to record attendance' });
  }
});

// GET /api/attendance/weekly-trend - Weekly trend for analytics charts
router.get('/weekly-trend', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const weeklyData = [
      { week: 'Week 1', rate: 88, threshold: 75, target: 85 },
      { week: 'Week 2', rate: 84, threshold: 75, target: 85 },
      { week: 'Week 3', rate: 79, threshold: 75, target: 85 },
      { week: 'Week 4', rate: 82, threshold: 75, target: 85 },
      { week: 'Week 5', rate: 76, threshold: 75, target: 85 },
      { week: 'Week 6', rate: 74, threshold: 75, target: 85 },
      { week: 'Week 7', rate: 71, threshold: 75, target: 85 },
      { week: 'Week 8', rate: 74, threshold: 75, target: 85 },
    ];

    res.json({ success: true, data: weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance trend' });
  }
});

// GET /api/attendance/records - Query records
router.get('/records', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { studentId, subject, date } = req.query;
    const where: any = {};
    if (studentId) where.studentId = String(studentId);
    if (subject) where.subject = String(subject);
    if (date) where.date = String(date);

    const records = await prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 100,
      include: {
        student: {
          select: { name: true, rollNo: true, department: true },
        },
      },
    });

    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance records' });
  }
});

export default router;

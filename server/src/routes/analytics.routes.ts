import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/analytics/overview - High-level metrics for dashboard cards
router.get('/overview', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [totalStudents, warningsCount, criticalWarningsCount, students] = await Promise.all([
      prisma.student.count(),
      prisma.warning.count({ where: { acknowledged: false } }),
      prisma.warning.count({ where: { level: 'critical', acknowledged: false } }),
      prisma.student.findMany({ select: { attendanceRate: true, riskLevel: true } }),
    ]);

    const atRiskStudents = students.filter(
      (s) => s.riskLevel === 'high' || s.riskLevel === 'critical'
    ).length;

    const avgAttendance =
      students.length > 0
        ? Math.round(
            (students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length) * 10
          ) / 10
        : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        avgAttendance,
        atRiskStudents,
        activeWarnings: warningsCount,
        criticalWarnings: criticalWarningsCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics overview' });
  }
});

export default router;

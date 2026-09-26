import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/classes - Get list of classes (optionally filtered by faculty)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { facultyId, department, semester } = req.query;
    const where: any = {};

    if (facultyId) where.facultyId = String(facultyId);
    if (department && department !== 'All') where.department = String(department);
    if (semester && !isNaN(Number(semester))) where.semester = Number(semester);

    const classes = await prisma.classSchedule.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch classes' });
  }
});

// GET /api/classes/:id - Get specific class with enrolled students
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const classItem = await prisma.classSchedule.findUnique({ where: { id } });

    if (!classItem) {
      res.status(404).json({ success: false, message: 'Class not found' });
      return;
    }

    // Fetch students belonging to the same department, semester, and section
    const students = await prisma.student.findMany({
      where: {
        department: classItem.department,
        semester: classItem.semester,
        section: classItem.section,
      },
      orderBy: { rollNo: 'asc' },
    });

    res.json({
      success: true,
      data: {
        ...classItem,
        students,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch class details' });
  }
});

export default router;

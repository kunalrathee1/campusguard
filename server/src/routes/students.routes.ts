import { Router, Response } from 'express';
import { prisma } from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Helper to compute risk level and score
export function calculateRisk(attendanceRate: number, academicScore: number = 70): { riskLevel: string; riskScore: number } {
  let riskScore = 0;

  // Attendance factor (up to 70 points)
  if (attendanceRate < 60) {
    riskScore += 70;
  } else if (attendanceRate < 75) {
    riskScore += 45;
  } else if (attendanceRate < 85) {
    riskScore += 20;
  } else {
    riskScore += 5;
  }

  // Academic factor (up to 30 points)
  if (academicScore < 50) {
    riskScore += 30;
  } else if (academicScore < 65) {
    riskScore += 20;
  } else if (academicScore < 75) {
    riskScore += 10;
  }

  let riskLevel = 'low';
  if (riskScore >= 75) {
    riskLevel = 'critical';
  } else if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  }

  return { riskLevel, riskScore };
}

// GET /api/students - List students with search, filters, pagination
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      department,
      semester,
      riskLevel,
      status,
      sortBy = 'name',
      sortOrder = 'asc',
      page = '1',
      limit = '50',
    } = req.query;

    const where: any = {};

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { rollNo: { contains: search } },
        { studentId: { contains: search } },
      ];
    }

    if (department && typeof department === 'string' && department !== 'All') {
      where.department = department;
    }

    if (semester && !isNaN(Number(semester))) {
      where.semester = Number(semester);
    }

    if (riskLevel && typeof riskLevel === 'string' && riskLevel !== 'All') {
      where.riskLevel = riskLevel.toLowerCase();
    }

    if (status && typeof status === 'string' && status !== 'All') {
      where.status = status.toLowerCase();
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * take;

    const allowedSortFields = ['name', 'rollNo', 'attendanceRate', 'riskScore', 'department', 'semester', 'createdAt'];
    const orderField = allowedSortFields.includes(sortBy as string) ? (sortBy as string) : 'name';
    const direction = sortOrder === 'desc' ? 'desc' : 'asc';

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        skip,
        take,
        orderBy: { [orderField]: direction },
        include: {
          warnings: {
            where: { acknowledged: false },
            select: { id: true, level: true, title: true },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
});

// GET /api/students/risk-stats
router.get('/risk-stats', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
      select: { department: true, riskLevel: true, attendanceRate: true },
    });

    const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    const departmentDistribution: Record<string, { total: number; atRisk: number; avgAttendance: number; totalAttendance: number }> = {};

    students.forEach((s) => {
      const level = (s.riskLevel || 'low').toLowerCase() as keyof typeof riskCounts;
      if (riskCounts[level] !== undefined) riskCounts[level]++;

      if (!departmentDistribution[s.department]) {
        departmentDistribution[s.department] = { total: 0, atRisk: 0, avgAttendance: 0, totalAttendance: 0 };
      }
      departmentDistribution[s.department].total++;
      departmentDistribution[s.department].totalAttendance += s.attendanceRate;
      if (level === 'high' || level === 'critical') {
        departmentDistribution[s.department].atRisk++;
      }
    });

    const departmentStats = Object.entries(departmentDistribution).map(([dept, data]) => ({
      department: dept,
      totalStudents: data.total,
      atRiskCount: data.atRisk,
      avgAttendance: data.total > 0 ? Math.round((data.totalAttendance / data.total) * 10) / 10 : 0,
    }));

    res.json({
      success: true,
      stats: {
        totalStudents: students.length,
        riskCounts,
        departmentStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch risk stats' });
  }
});

// GET /api/students/:id - Detail by ID or studentId
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findFirst({
      where: {
        OR: [{ id }, { studentId: id }, { rollNo: id }],
      },
      include: {
        warnings: { orderBy: { date: 'desc' } },
        attendance: { orderBy: { date: 'desc' }, take: 30 },
        riskFactors: true,
      },
    });

    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student details' });
  }
});

// POST /api/students - Create new student
router.post('/', authenticateToken, requireRoles('admin', 'faculty'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      studentId,
      rollNo,
      name,
      email,
      department,
      semester,
      section,
      contactPhone,
      parentPhone,
      parentEmail,
      address,
      cgpa,
      academicScore = 75,
      totalClasses = 0,
      attendedClasses = 0,
    } = req.body;

    if (!name || !email || !rollNo || !department || !semester || !section) {
      res.status(400).json({
        success: false,
        message: 'Name, email, rollNo, department, semester, and section are required',
      });
      return;
    }

    const attendanceRate = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 100;
    const { riskLevel, riskScore } = calculateRisk(attendanceRate, Number(academicScore) || 75);

    const generatedId = studentId || `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          ...(req.body.id ? { id: req.body.id } : {}),
          studentId: generatedId,
          rollNo,
          name,
          email,
          department,
          semester: Number(semester),
          section,
          contactPhone,
          parentPhone,
          parentEmail,
          address,
          cgpa: cgpa ? Number(cgpa) : null,
          academicScore: Number(academicScore) || 75,
          totalClasses: Number(totalClasses) || 0,
          attendedClasses: Number(attendedClasses) || 0,
          attendanceRate,
          riskLevel,
          riskScore,
          status: 'active',
        },
      });

      // Automatically provision a user account for the student
      const bcrypt = await import('bcryptjs');
      const password = req.body.password || 'student123';
      const hash = await bcrypt.default.hash(password, 10);
      
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (!existingUser) {
        await tx.user.create({
          data: {
            email,
            passwordHash: hash,
            name,
            role: 'student',
            department
          }
        });
      }

      return student;
    });

    res.status(201).json({ success: true, data: newStudent });
  } catch (error: any) {
    console.error('Error creating student:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, message: 'A student with this Email, Roll No, or ID already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
});

// PUT /api/students/:id - Update student
router.put('/:id', authenticateToken, requireRoles('admin', 'faculty'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    // Recalculate attendance rate and risk if relevant fields changed
    let attendanceRate = existing.attendanceRate;
    const totalClasses = data.totalClasses !== undefined ? Number(data.totalClasses) : existing.totalClasses;
    const attendedClasses = data.attendedClasses !== undefined ? Number(data.attendedClasses) : existing.attendedClasses;
    const academicScore = data.academicScore !== undefined ? Number(data.academicScore) : (existing.academicScore ?? 75);

    if (totalClasses > 0) {
      attendanceRate = Math.round((attendedClasses / totalClasses) * 1000) / 10;
    }

    const { riskLevel, riskScore } = calculateRisk(attendanceRate, academicScore);

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...data,
        semester: data.semester !== undefined ? Number(data.semester) : undefined,
        cgpa: data.cgpa !== undefined ? Number(data.cgpa) : undefined,
        academicScore,
        totalClasses,
        attendedClasses,
        attendanceRate,
        riskLevel,
        riskScore,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: 'Failed to update student' });
  }
});

// DELETE /api/students/:id - Delete student
router.delete('/:id', authenticateToken, requireRoles('admin'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
});

export default router;

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET /api/school-admin/:adminId/organizers
export const getSchoolOrganizers = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });

    if (!admin || admin.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ error: 'Only SCHOOL_ADMIN can view organizers' });
    }
    if (!admin.schoolId) {
      return res.status(400).json({ error: 'School admin is not assigned to any school' });
    }

    const organizers = await prisma.user.findMany({
      where: {
        role: 'SCHOOL_ORGANIZER',
        schoolId: admin.schoolId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile: true,
        schoolId: true,
        school: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
        // derive lastLogin later if you store it; for now null
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute eventsCount per organizer
    const organizerIds = organizers.map(o => o.id);
    const eventsByOrganizer = await prisma.event.groupBy({
      by: ['organizerId'],
      _count: { organizerId: true },
      where: { organizerId: { in: organizerIds } },
    });
    const countMap = new Map(eventsByOrganizer.map(e => [e.organizerId, e._count.organizerId]));

    const result = organizers.map(o => ({
      id: o.id,
      name: o.name,
      email: o.email,
      role: 'ORGANIZER',
      profile: o.profile ?? '',
      schoolId: o.schoolId,
      school: o.school ? { id: o.school.id, name: o.school.name } : null,
      eventsCount: countMap.get(o.id) ?? 0,
      status: 'active',
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      lastLogin: o.updatedAt.toISOString(),
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching school organizers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/school-admin/:adminId/organizers/:organizerId
export const deleteSchoolOrganizer = async (req, res) => {
  try {
    const { adminId, organizerId } = req.params;

    const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });
    if (!admin || admin.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ error: 'Only SCHOOL_ADMIN can delete organizers' });
    }
    if (!admin.schoolId) {
      return res.status(400).json({ error: 'School admin is not assigned to any school' });
    }

    const organizer = await prisma.user.findUnique({ where: { id: parseInt(organizerId) } });
    if (!organizer || organizer.role !== 'SCHOOL_ORGANIZER' || organizer.schoolId !== admin.schoolId) {
      return res.status(404).json({ error: 'Organizer not found for this school' });
    }

    // Prevent deletion if organizer has events (to avoid FK issues)
    const evCount = await prisma.event.count({ where: { organizerId: organizer.id } });
    if (evCount > 0) {
      return res.status(400).json({ error: 'Cannot delete organizer with existing events' });
    }

    await prisma.user.delete({ where: { id: organizer.id } });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting organizer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/school-admin/:adminId/organizers  (bulk)
export const bulkDeleteSchoolOrganizers = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array required' });
    }

    const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });
    if (!admin || admin.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ error: 'Only SCHOOL_ADMIN can delete organizers' });
    }
    if (!admin.schoolId) {
      return res.status(400).json({ error: 'School admin is not assigned to any school' });
    }

    // Filter only organizers that belong to this school and have no events
    const organizers = await prisma.user.findMany({
      where: {
        id: { in: ids.map((n) => parseInt(n)) },
        role: 'SCHOOL_ORGANIZER',
        schoolId: admin.schoolId,
      },
      select: { id: true },
    });

    const deletableIds = [];
    for (const o of organizers) {
      const count = await prisma.event.count({ where: { organizerId: o.id } });
      if (count === 0) deletableIds.push(o.id);
    }

    if (deletableIds.length === 0) {
      return res.status(400).json({ error: 'No eligible organizers to delete (organizers may have events)' });
    }

    await prisma.user.deleteMany({ where: { id: { in: deletableIds } } });
    res.json({ success: true, deleted: deletableIds });
  } catch (err) {
    console.error('Error bulk deleting organizers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/school-admin/:adminId/organizers
export const createSchoolOrganizer = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const admin = await prisma.user.findUnique({ where: { id: parseInt(adminId) } });
    if (!admin || admin.role !== 'SCHOOL_ADMIN') {
      return res.status(403).json({ error: 'Only SCHOOL_ADMIN can create organizers' });
    }
    if (!admin.schoolId) {
      return res.status(400).json({ error: 'School admin is not assigned to any school' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SCHOOL_ORGANIZER',
        schoolId: admin.schoolId,
      },
      select: { id: true, name: true, email: true, role: true, schoolId: true, createdAt: true, updatedAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating school organizer:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

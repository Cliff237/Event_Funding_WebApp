import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get all events for a user (with role-based filtering)
const getMyEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status = 'all', search = '' } = req.query;

    // Validate user exists and get their role and school accesses
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        schoolAccesses: {
          include: { school: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build where clause based on user role and school accesses
    let whereClause = {};

    // Check if user is a school admin in any school
    const schoolAdminAccesses = user.schoolAccesses.filter(access => access.role === 'SCHOOL_ADMIN');
    const isSchoolAdmin = schoolAdminAccesses.length > 0;
    const schoolIds = schoolAdminAccesses.map(access => access.schoolId);

    // Check if user is a school organizer in any school
    const schoolOrganizerAccesses = user.schoolAccesses.filter(access => access.role === 'SCHOOL_ORGANIZER');
    const isSchoolOrganizer = schoolOrganizerAccesses.length > 0;
    const organizerSchoolIds = schoolOrganizerAccesses.map(access => access.schoolId);

    if (isSchoolAdmin) {
      // School admin sees their own events + events from schools they administer
      whereClause = {
        OR: [
          { organizerId: parseInt(userId) },
          { schoolId: { in: schoolIds } }
        ]
      };
    } else if (isSchoolOrganizer) {
      // School organizer sees only their events within their schools
      whereClause = {
        organizerId: parseInt(userId),
        schoolId: { in: organizerSchoolIds }
      };
    } else {
      // Regular organizer sees only their events
      whereClause = {
        organizerId: parseInt(userId)
      };
    }

    // Add status filter if not 'all'
    if (status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    // Add search filter if provided
    if (search) {
      whereClause.OR = [
        ...(whereClause.OR || []),
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get events with related data
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        payments: true, // Include all payments
        receipts: {
          include: {
            contribution: true
          }
        },
        _count: {
          select: {
            receipts: true,
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limitNum
    });

    // Get total count for pagination
    const totalEvents = await prisma.event.count({
      where: whereClause
    });

    // Format events to match your frontend structure
    const formattedEvents = events.map(event => {
      const totalAmount = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const contributorCount = event.receipts.length;
      const totalTransactions = event.payments.length;
      const avgContribution = totalTransactions > 0 ? totalAmount / totalTransactions : 0;
      
      // Calculate progress if target amount exists (you might want to add targetAmount to your Event model)
      const progress = event.targetAmount ? (totalAmount / event.targetAmount) * 100 : 100;
      
      // Determine status for frontend
      let frontendStatus = event.status.toLowerCase();
      if (event.isLocked) {
        frontendStatus = 'locked';
      }

      // Get featured contributors (last 3 contributors)
      const featuredContributors = event.receipts
        .slice(-3)
        .map(receipt => receipt.contributor.name)
        .filter(name => name); // Remove null/undefined names

      return {
        id: event.id.toString(),
        title: event.title,
        description: event.description || '',
        category: event.type.toLowerCase(),
        status: frontendStatus,
        targetAmount: event.targetAmount || null,
        currentAmount: totalAmount,
        contributorCount: contributorCount,
        createdDate: event.createdAt.toISOString().split('T')[0],
        deadline: event.date ? event.date.toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now if no date
        duration: event.date ? Math.ceil((event.date - event.createdAt) / (1000 * 60 * 60 * 24)) : 30,
        isLocked: frontendStatus === 'locked',
        progress: Math.round(progress),
        totalTransactions: totalTransactions,
        avgContribution: Math.round(avgContribution),
        lastActivity: event.updatedAt.toISOString(),
        completionRate: progress,
        featuredContributors: featuredContributors.length > 0 ? featuredContributors : ['Anonymous Contributor'],
        isOwnEvent: event.organizerId === parseInt(userId),
        organizerName: event.organizer?.name || 'N/A',
        organizerRole: event.organizer?.role || 'N/A'
      };
    });

    res.json({
      events: formattedEvents,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalEvents / limitNum),
        totalEvents: totalEvents,
        hasNextPage: pageNum < Math.ceil(totalEvents / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching my events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Toggle event lock status
const toggleEventLock = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    // Verify user owns the event or has permission
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if event exists and user has permission
    const event = await prisma.event.findFirst({
      where: {
        id: parseInt(eventId),
        OR: [
          { organizerId: parseInt(userId) },
          ...(user.role === 'SCHOOL_ADMIN' && user.schoolId ? [{ schoolId: user.schoolId }] : [])
        ]
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    // Toggle lock status
    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        isLocked: !event.isLocked,
        status: event.isLocked ? 'APPROVED' : 'LOCKED' // You might want to add LOCKED status to your enum
      },
      include: {
        payments: true, // Include all payments
        receipts: true
      }
    });

    // Format response
    const totalAmount = updatedEvent.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const contributorCount = updatedEvent.receipts.length;

    res.json({
      id: updatedEvent.id.toString(),
      isLocked: updatedEvent.isLocked,
      status: updatedEvent.isLocked ? 'locked' : 'active',
      currentAmount: totalAmount,
      contributorCount: contributorCount
    });
  } catch (error) {
    console.error('Error toggling event lock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    // Verify user owns the event or has permission
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if event exists and user has permission
    const event = await prisma.event.findFirst({
      where: {
        id: parseInt(eventId),
        OR: [
          { organizerId: parseInt(userId) },
          ...(user.role === 'SCHOOL_ADMIN' && user.schoolId ? [{ schoolId: user.schoolId }] : [])
        ]
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    // Delete event (this will cascade delete related records due to Prisma relations)
    await prisma.event.delete({
      where: { id: parseInt(eventId) }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get event statistics for the modal
const getEventStats = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    // Verify user has permission to view event stats
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: parseInt(eventId),
        OR: [
          { organizerId: parseInt(userId) },
          ...(user.role === 'SCHOOL_ADMIN' && user.schoolId ? [{ schoolId: user.schoolId }] : [])
        ]
      },
      include: {
        payments: true, // Include all payments
        receipts: {
          include: {
            contributor: true
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found or access denied' });
    }

    // Calculate statistics
    const totalRevenue = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const contributorCount = event.receipts.length;
    const totalTransactions = event.payments.length;
    const avgContribution = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const progress = event.targetAmount ? (totalRevenue / event.targetAmount) * 100 : 100;

    // Calculate payment method breakdown (you'll need to add paymentMethod to your Payment model)
    const paymentMethodBreakdown = {
      momo: 45, // You'll need to calculate these based on actual data
      om: 30,
      bank: 15,
      wallet: 10
    };

    // Get recent contributors for featured list
    const featuredContributors = event.receipts
      .slice(-3)
      .map(receipt => receipt.contributor.name)
      .filter(name => name);

    const stats = {
      totalRevenue,
      conversionRate: 73.2, // You might want to calculate this based on your business logic
      dailyContributions: [12000, 25000, 18000, 45000, 32000, 28000, 35000], // You'll need to calculate this based on date
      paymentMethodBreakdown,
      featuredContributors: featuredContributors.length > 0 ? featuredContributors : ['Anonymous Contributor']
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getMyEvents,
  toggleEventLock,
  deleteEvent,
  getEventStats
};
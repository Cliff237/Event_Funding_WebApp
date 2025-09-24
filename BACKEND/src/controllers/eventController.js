import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get overview statistics for a specific user/organizer or school admin
const getOrganizerOverview = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user exists and get their role and school
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        school: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let events = [];
    let userEvents = [];

    // Determine which events to fetch based on user role
    if (user.role === 'SCHOOL_ADMIN' && user.schoolId) {
      // School admin: get all events from their school (including their own)
      events = await prisma.event.findMany({
        where: { 
          OR: [
            { organizerId: parseInt(userId) }, // Their own events
            { schoolId: user.schoolId } // Events from their school organizers
          ]
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          receipts: {
            include: {
              contribution: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          }
        }
      });

      // Separate user's own events for specific calculations if needed
      userEvents = events.filter(event => event.organizerId === parseInt(userId));
    } else if (user.role === 'SCHOOL_ORGANIZER' && user.schoolId) {
      // School organizer: only get their own events
      events = await prisma.event.findMany({
        where: { 
          organizerId: parseInt(userId),
          schoolId: user.schoolId
        },
        include: {
          receipts: {
            include: {
              contribution: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          }
        }
      });
      userEvents = events;
    } else if (user.role === 'ORGANIZER') {
      // Regular organizer: only get their own events
      events = await prisma.event.findMany({
        where: { organizerId: parseInt(userId) },
        include: {
          receipts: {
            include: {
              contribution: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          }
        }
      });
      userEvents = events;
    } else {
      // SUPER_ADMIN or other roles - handle as needed
      events = await prisma.event.findMany({
        where: { organizerId: parseInt(userId) },
        include: {
          receipts: {
            include: {
              contribution: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          }
        }
      });
      userEvents = events;
    }

    // Calculate statistics
    const totalEvents = events.length;
    const activeEvents = events.filter(event => 
      event.status === 'APPROVED' || event.status === 'PENDING'
    ).length;

    // Calculate total amount from all payments across all events
    const totalRevenue = events.reduce((total, event) => {
      const eventTotal = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
      return total + eventTotal;
    }, 0);

    // Calculate total number of contributors (unique receipt contributors)
    const allReceipts = events.flatMap(event => event.receipts);
    const totalContributors = new Set(allReceipts.map(receipt => receipt.contributorId)).size;

    // Calculate total transactions
    const allPayments = events.flatMap(event => event.payments);
    const totalTransactions = allPayments.length;

    // Get recent events for the sidebar
    const recentEvents = await prisma.event.findMany({
      where: { 
        OR: user.role === 'SCHOOL_ADMIN' && user.schoolId ? [
          { organizerId: parseInt(userId) },
          { schoolId: user.schoolId }
        ] : [
          { organizerId: parseInt(userId) }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        organizer: {
          select: {
            name: true,
            role: true
          }
        },
        payments: {
          where: { status: 'COMPLETED' }
        },
        receipts: true
      }
    });

    // Format recent events data
    const formattedRecentEvents = recentEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      status: event.status,
      organizerName: event.organizer.name,
      organizerRole: event.organizer.role,
      totalContributions: event.payments.reduce((sum, payment) => sum + payment.amount, 0),
      contributorCount: event.receipts.length,
      isOwnEvent: event.organizerId === parseInt(userId)
    }));

    // Prepare response with role-specific data
    const overviewData = {
      userRole: user.role,
      schoolId: user.schoolId,
      platformStats: {
        totalEvents,
        activeEvents,
        totalRevenue,
        totalContributors,
        totalTransactions,
        monthlyGrowth: 12.5,
        totalUsers: totalContributors,
        successRate: totalTransactions > 0 ? ((totalTransactions / (allPayments.length || 1)) * 100) : 0,
        avgContribution: totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0
      },
      recentEvents: formattedRecentEvents,
      quickStats: [
        {
          label: 'Total Revenue',
          value: totalRevenue,
          change: 12.5
        },
        {
          label: 'Active Events',
          value: activeEvents,
          change: 8.2
        },
        {
          label: user.role === 'SCHOOL_ADMIN' ? 'School Contributors' : 'Total Contributors',
          value: totalContributors,
          change: 15.3
        }
      ]
    };

    res.json(overviewData);
  } catch (error) {
    console.error('Error fetching organizer overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get event wallet summary for an organizer or school admin
const getEventWalletSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user to determine role
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let events = [];

    // Determine which events to fetch based on user role
    if (user.role === 'SCHOOL_ADMIN' && user.schoolId) {
      // School admin: get all events from their school
      events = await prisma.event.findMany({
        where: { 
          OR: [
            { organizerId: parseInt(userId) },
            { schoolId: user.schoolId }
          ]
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          },
          receipts: {
            include: {
              contribution: true
            }
          }
        }
      });
    } else if (user.role === 'SCHOOL_ORGANIZER' && user.schoolId) {
      // School organizer: only get their own events
      events = await prisma.event.findMany({
        where: { 
          organizerId: parseInt(userId),
          schoolId: user.schoolId
        },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          },
          receipts: {
            include: {
              contribution: true
            }
          }
        }
      });
    } else {
      // Regular organizer or other roles
      events = await prisma.event.findMany({
        where: { organizerId: parseInt(userId) },
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' }
          },
          receipts: {
            include: {
              contribution: true
            }
          }
        }
      });
    }

    const walletSummary = events.map(event => ({
      id: event.id,
      title: event.title,
      status: event.status,
      organizerName: event.organizer.name,
      organizerRole: event.organizer.role,
      isOwnEvent: event.organizerId === parseInt(userId),
      totalAmount: event.payments.reduce((sum, payment) => sum + payment.amount, 0),
      contributorCount: event.receipts.length,
      recentActivity: event.updatedAt
    }));

    res.json(walletSummary);
  } catch (error) {
    console.error('Error fetching event wallet summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  getOrganizerOverview,
  getEventWalletSummary
};
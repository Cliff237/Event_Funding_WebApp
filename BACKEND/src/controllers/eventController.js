import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Fetches events based on the user's role.
 * - If user has SCHOOL_ADMIN role in any school: Gets all events from those schools plus their own events.
 * - Other roles: Get only their own events.
 * @param {number} userId - The ID of the user.
 * @param {object} user - The full user object from Prisma with schoolAccesses included.
 * @returns {Promise<Array>} A promise that resolves to an array of events.
 */
const getEventsByRole = (userId, user) => {
  const eventInclude = {
    organizer: {
      select: { id: true, name: true, email: true, role: true },
    },
    receipts: {
      include: { contribution: true },
    },
    payments: true, // Include all payments, not just completed ones
  };

  // Check if user is a school admin in any school
  const schoolAdminAccesses = user.schoolAccesses.filter(access => access.role === 'SCHOOL_ADMIN');
  const isSchoolAdmin = schoolAdminAccesses.length > 0;
  const schoolIds = schoolAdminAccesses.map(access => access.schoolId);

  if (isSchoolAdmin) {
    // School admin: get all events from their schools (including their own)
    return prisma.event.findMany({
      where: {
        OR: [
          { organizerId: userId },
          { schoolId: { in: schoolIds } }
        ],
      },
      include: eventInclude,
    });
  }

  // Regular organizer: only get their own events
  return prisma.event.findMany({
    where: { organizerId: userId },
    include: eventInclude,
  });
};

// Get overview statistics for a specific user/organizer or school admin
const getOrganizerOverview = async (req, res) => {
  try {
    const userId = +req.params.userId;

    // Validate user exists and get their role and school accesses
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        schoolAccesses: {
          include: { school: true }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const events = await getEventsByRole(userId, user);

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
    const schoolAdminAccesses = user.schoolAccesses.filter(access => access.role === 'SCHOOL_ADMIN');
    const isSchoolAdmin = schoolAdminAccesses.length > 0;
    const schoolIds = schoolAdminAccesses.map(access => access.schoolId);

    const recentEvents = await prisma.event.findMany({
      where: {
        OR: isSchoolAdmin ? [
          { organizerId: userId },
          { schoolId: { in: schoolIds } }
        ] : [
          { organizerId: userId }
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
        payments: true, // Include all payments
        receipts: true
      }
    });

    // Format recent events data
    const formattedRecentEvents = recentEvents.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date,
      status: event.status,
      organizerName: event.organizer?.name || 'N/A',
      organizerRole: event.organizer?.role || 'N/A',
      totalContributions: event.payments.reduce((sum, payment) => sum + payment.amount, 0),
      contributorCount: event.receipts.length,
      isOwnEvent: event.organizerId === userId
    }));

    // Prepare response with role-specific data
    const overviewData = {
      userRole: user.role,
      isSchoolAdmin,
      schoolAccesses: user.schoolAccesses.map(access => ({
        schoolId: access.schoolId,
        schoolName: access.school?.name,
        role: access.role
      })),
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
          label: isSchoolAdmin ? 'School Contributors' : 'Total Contributors',
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
  console.log('=== getEventWalletSummary called ===');
  // console.log('Request params:', req.params);
  // console.log('Authenticated user from token:', req.user);

  try {
    const userId = +req.params.userId;
    // console.log('Requested user ID:', userId);

    // Get user to determine role and school accesses
    console.log('Fetching user from database...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        schoolAccesses: {
          include: { school: true }
        }
      }
    });

    if (!user) {
      console.error('User not found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Found user:', {
      id: user.id,
      name: user.name,
      role: user.role,
      schoolAccesses: user.schoolAccesses.map(access => ({
        schoolId: access.schoolId,
        role: access.role,
        schoolName: access.school?.name
      }))
    });

    const events = await getEventsByRole(userId, user);

    // console.log(`Found ${events.length} events`);
    
    const walletSummary = events.map(event => {
      const totalAmount = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const contributorCount = event.receipts.length;
      
      console.log(`Event ${event.id} (${event.title}):`, {
        organizerId: event.organizerId,
        organizerName: event.organizer?.name || 'N/A',
        totalAmount,
        contributorCount,
        isOwnEvent: event.organizerId === userId
      });
      
      return {
        id: event.id,
        title: event.title,
        status: event.status,
        organizerName: event.organizer?.name || 'N/A',
        organizerRole: event.organizer?.role || 'N/A',
        isOwnEvent: event.organizerId === userId,
        totalAmount,
        contributorCount,
        recentActivity: event.updatedAt
      };
    });

    console.log('Sending wallet summary response');
    res.json(walletSummary);
  } catch (error) {
    console.error('Error in getEventWalletSummary:', {
      message: error.message,
      stack: error.stack,
      userId: req.params.userId,
      authenticatedUser: req.user
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  } finally {
    console.log('=== getEventWalletSummary completed ===\n');
  }
};

// Get public event data by eventType and slug (for contributors)
const getEventByTypeAndSlug = async (req, res) => {
  try {
    const { eventType, eventSlug } = req.params;
    console.log('Fetching event by type and slug:', { eventType, eventSlug });

    // Reconstruct the full slug path
    const fullSlug = `${eventType}/${eventSlug}`;
    console.log('Full slug to search:', fullSlug);

    // Find event by eventLink (slug) and eventType
    const event = await prisma.event.findFirst({
      where: { 
        eventLink: fullSlug,
        type: eventType.toUpperCase(),
        status: { in: ['APPROVED', 'PENDING'] } // Correctly query for multiple statuses
      },
      include: {
        organizer: {
          select: {
            id: true, // Select only necessary fields
            name: true, // Avoid fetching password
            email: true,
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            logo: true,
            address: true,
            email: true
          }
        },
        fields: {
          orderBy: {
            id: 'asc' // Order by 'id' as 'createdAt' does not exist on EventField
          }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ 
        error: 'Event not found or not available',
        message: 'The event you are looking for does not exist or is not yet published.'
      });
    }

    // Transform the data to match frontend EventFormData structure
    const eventData = {
      eventType: event.type.toLowerCase(),
      organizerName: event.organizer?.name || 'Anonymous',
      eventName: event.name,
      eventTitle: event.title,
      eventDescription: event.description,
      fields: event.fields.map(field => ({
        id: field.id.toString(),
        label: field.label,
        type: field.fieldType.toLowerCase(),
        required: field.required,
        readOnly: field.readOnly,
        options: field.options || [],
        placeholder: field.placeholder,
        min: field.min,
        max: field.max,
        defaultValue: field.defaultValue
      })),
      // Ensure paymentMethods is always an array of strings
      paymentMethods: (() => {
        try {
          const methods = typeof event.paymentMethods === 'string' ? JSON.parse(event.paymentMethods) : event.paymentMethods;
          return Array.isArray(methods) ? methods : [];
        } catch {
          return [];
        }
      })(),
      formColor: event.formColor || { // Renamed to formColor to match prisma model
        primary: '#10b981',
        secondary: '#34d399',
        text: '#064e3b',
        background: '#f0fdf4'
      },
      walletType: event.walletType,
      fundraisingGoal: event.fundraisingGoal,
      deadline: event.deadline ? event.deadline.toISOString() : null,
      contributorMessage: event.contributorMessage,
      receiptConfig: event.receiptConfig || {
        includeFields: [],
        includeQR: true,
        additionalFields: {},
        school: event.school ? { // Safely access school properties
          name: event.school?.name || '',
        link: event.school?.address || '', // Using address as a fallback for link
        contact: event.school?.email || '', // Using email for contact
        logoUrl: event.school?.logo || ''
        } : {
          name: '',
          link: '',
          contact: '',
          logoUrl: ''
        },
        layout: 'one',
        align: 'left',
        showDividers: true,
        accentColor: '#7c3aed'
      },
      eventCard: {
        image: event.image || '',
        title: event.title || '',
        description: event.description || ''
      }
    };

    console.log('Event found and transformed successfully');
    res.json({
      success: true,
      data: eventData
    });

  } catch (error) {
    console.error('Error fetching event by type and slug:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch event data'
    });
  }
};

export {
  getOrganizerOverview,
  getEventWalletSummary,
  getEventByTypeAndSlug
};
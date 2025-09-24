import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get overview statistics for a specific organizer
export const getOrganizerOverview = async (req, res) => {
  try {
    const organizerId = req.user.id; // From auth middleware

    // Get all events created by this organizer
    const events = await prisma.event.findMany({
      where: { organizerId },
      include: {
        payments: {
          include: {
            receipt: true
          }
        },
        _count: {
          select: {
            payments: true
          }
        }
      }
    });

    // Calculate statistics
    const totalEvents = events.length;
    const activeEvents = events.filter(event => event.status === 'APPROVED').length;
    
    // Calculate total amount from all successful payments
    const totalAmount = events.reduce((sum, event) => {
      const eventTotal = event.payments
        .filter(payment => payment.status === 'COMPLETED')
        .reduce((eventSum, payment) => eventSum + payment.amount, 0);
      return sum + eventTotal;
    }, 0);

    // Calculate total number of contributors (unique transactions)
    const totalContributors = events.reduce((sum, event) => {
      return sum + event.payments.filter(payment => payment.status === 'COMPLETED').length;
    }, 0);

    // Calculate success rate
    const totalPayments = events.reduce((sum, event) => sum + event.payments.length, 0);
    const successfulPayments = events.reduce((sum, event) => {
      return sum + event.payments.filter(payment => payment.status === 'COMPLETED').length;
    }, 0);
    const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

    // Calculate average contribution
    const avgContribution = successfulPayments > 0 ? totalAmount / successfulPayments : 0;

    // Get recent activity (last 10 successful payments)
    const recentPayments = await prisma.payment.findMany({
      where: {
        event: {
          organizerId
        },
        status: 'COMPLETED'
      },
      include: {
        event: {
          select: {
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const overviewData = {
      totalEvents,
      activeEvents,
      totalAmount,
      totalContributors,
      successRate: Math.round(successRate * 100) / 100,
      avgContribution: Math.round(avgContribution),
      totalTransactions: totalPayments,
      monthlyGrowth: 12.5, // This would need to be calculated based on historical data
      recentActivity: recentPayments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        eventTitle: payment.event.title,
        payerInfo: payment.answers, // Contains payer details from form
        createdAt: payment.createdAt,
        method: payment.method
      }))
    };

    res.status(200).json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    console.error("Get organizer overview error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Get event wallets for organizer
export const getEventWallets = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await prisma.event.findMany({
      where: { organizerId },
      include: {
        payments: {
          where: {
            status: 'COMPLETED'
          }
        },
        _count: {
          select: {
            payments: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const eventWallets = events.map(event => {
      const totalContributions = event.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const contributorCount = event._count.payments;
      
      // Get last activity
      const lastPayment = event.payments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      // Calculate progress if there's a target (you might want to add target to Event model)
      const targetAmount = 1000000; // Default target, should come from event data
      const progress = Math.min((totalContributions / targetAmount) * 100, 100);

      // Map event status
      const getWalletStatus = (eventStatus) => {
        switch (eventStatus) {
          case 'APPROVED': return 'active';
          case 'COMPLETED': return 'completed';
          case 'REJECTED': return 'cancelled';
          default: return 'pending';
        }
      };

      return {
        id: event.id.toString(),
        eventName: event.title,
        category: event.type.toLowerCase(),
        balance: totalContributions,
        targetAmount: targetAmount,
        totalContributions,
        lastActivity: lastPayment ? lastPayment.createdAt : event.createdAt,
        status: getWalletStatus(event.status),
        progress: Math.round(progress),
        contributorCount
      };
    });

    res.status(200).json({
      success: true,
      data: eventWallets
    });

  } catch (error) {
    console.error("Get event wallets error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Get all events for organizer
export const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await prisma.event.findMany({
      where: { organizerId },
      include: {
        payments: true,
        school: {
          select: {
            name: true,
            logo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: events
    });

  } catch (error) {
    console.error("Get organizer events error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Get transactions for organizer's events
export const getOrganizerTransactions = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const { eventId, status, paymentMethod, search, page = 1, limit = 10 } = req.query;

    // Build where clause
    const whereClause = {
      event: {
        organizerId
      }
    };

    if (eventId) {
      whereClause.eventId = parseInt(eventId);
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (paymentMethod) {
      whereClause.method = paymentMethod.toUpperCase();
    }

    // Get transactions with pagination
    const transactions = await prisma.payment.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });

    // Get total count for pagination
    const totalCount = await prisma.payment.count({
      where: whereClause
    });

    // Transform transactions to match frontend format
    const transformedTransactions = transactions.map(payment => ({
      id: payment.id.toString(),
      transactionId: `TX${payment.id.toString().padStart(3, '0')}`,
      eventId: payment.eventId.toString(),
      eventName: payment.event.title,
      eventType: payment.event.type.toLowerCase(),
      amount: payment.amount,
      date: payment.createdAt.toISOString(),
      status: payment.status.toLowerCase(),
      paymentMethod: payment.method.toLowerCase(),
      payerName: payment.answers?.payerName || payment.answers?.name || 'Unknown',
      payerEmail: payment.answers?.payerEmail || payment.answers?.email || '',
      customFields: payment.answers || {}
    }));

    // Apply search filter if provided
    let filteredTransactions = transformedTransactions;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTransactions = transformedTransactions.filter(transaction =>
        transaction.transactionId.toLowerCase().includes(searchLower) ||
        transaction.payerName.toLowerCase().includes(searchLower) ||
        Object.values(transaction.customFields).some(value =>
          String(value).toLowerCase().includes(searchLower)
        )
      );
    }

    res.status(200).json({
      success: true,
      data: {
        transactions: filteredTransactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalItems: totalCount,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Get organizer transactions error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};
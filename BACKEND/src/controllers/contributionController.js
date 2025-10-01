import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new contribution (payment) for an event.
 * POST /api/contributions
 */
export const createContribution = async (req, res) => {
  try {
    const {
      eventSlug,
      answers,
      amount,
      paymentMethod,
    } = req.body;

    console.log('Creating contribution with data:', { eventSlug, answers, amount, paymentMethod });

    // Validate required fields
    if (!eventSlug || !amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: eventSlug, amount, and paymentMethod are required' 
      });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid amount: must be a positive number' 
      });
    }

    // Find the event by its unique slug (eventLink)
    const event = await prisma.event.findUnique({
      where: { eventLink: eventSlug },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    console.log('Found event:', event.id, event.title);

    // Create the payment record
    const payment = await prisma.payment.create({
      data: {
        eventId: event.id,
        answers: answers || {},
        amount: parsedAmount,
        method: paymentMethod.toUpperCase(), // Ensure method matches enum
      },
    });

    console.log('Payment created successfully:', payment.id);

    // Here you would typically integrate with a payment gateway.
    // For now, we'll just return the created payment record.

    res.status(201).json({ success: true, data: payment });

  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ success: false, error: 'Internal server error', message: error.message });
  }
};
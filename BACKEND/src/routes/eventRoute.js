import express from 'express';
import { getOrganizerOverview, getEventWalletSummary, getEventByTypeAndSlug } from '../controllers/eventController.js';
import { getMyEvents, toggleEventLock, deleteEvent, getEventStats } from '../controllers/myEventsController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/public/:eventType/:eventSlug', getEventByTypeAndSlug);

// Protected routes (require authentication)
router.use(authenticate);

// Event management routes
router.get('/overview/:userId', getOrganizerOverview);
router.get('/wallet-summary/:userId', getEventWalletSummary);
router.get('/my-events/:userId', getMyEvents);
router.patch('/toggle-lock/:userId/:eventId', toggleEventLock);
router.delete('/:userId/:eventId', deleteEvent);
router.get('/stats/:userId/:eventId', getEventStats);

// Health check for events route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Events route is healthy!' });
});

export default router;

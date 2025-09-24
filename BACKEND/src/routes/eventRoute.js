import express from 'express';
import { getOrganizerOverview, getEventWalletSummary } from '../controllers/eventController.js';
import { getMyEvents, toggleEventLock, deleteEvent, getEventStats } from '../controllers/myEventsController.js';
const router = express.Router();

// Get organizer overview statistics
router.get('/overview/:userId', getOrganizerOverview);

// Get event wallet summary
router.get('/wallet-summary/:userId', getEventWalletSummary);
// New MyEvents routes
router.get('/my-events/:userId', getMyEvents);
router.patch('/toggle-lock/:userId/:eventId', toggleEventLock);
router.delete('/:userId/:eventId', deleteEvent);
router.get('/stats/:userId/:eventId', getEventStats);
// Health check for events route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Events route is healthy!' });
});

export default router;

import express from 'express';
import { createContribution } from '../controllers/contributionController.js';

const router = express.Router();

/**
 * @route   POST /api/contributions
 * @desc    Create a new contribution (payment) for an event
 * @access  Public (no authentication required for contributors)
 */
router.post('/', createContribution);

// Health check for contributions route
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Contributions route is healthy!' });
});

export default router;
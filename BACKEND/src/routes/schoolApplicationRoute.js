import express from 'express';
import { 
  submitSchoolApplication,
  getMySchoolApplications,
  getAllSchoolApplications,
  getAllSchools,
  getSchoolApplicationById,
  approveSchoolApplication,
  rejectSchoolApplication
} from '../controllers/schoolApplicationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', submitSchoolApplication);

// Protected routes (require authentication)
router.use(authenticate);

// User routes - Get my applications
router.get('/my-applications/:userId', getMySchoolApplications);

// Admin routes - Manage all applications
router.get('/all', getAllSchoolApplications);
router.get('/schools', getAllSchools);
router.get('/:id', getSchoolApplicationById);
router.post('/:id/approve', approveSchoolApplication);
router.post('/:id/reject', rejectSchoolApplication);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'School applications route is healthy!' });
});

export default router;
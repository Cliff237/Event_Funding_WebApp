import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createEvent, uploadEventImage, publishEvent } from '../controllers/eventCreateController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/events');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'event-' + uniqueSuffix + ext);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * @route   POST /api/events/create
 * @desc    Create a new event
 * @access  Public
 */
router.post('/event', authenticate, createEvent);

/**
 * @route   POST /api/events/create/:id/image
 * @desc    Upload an image for an event
 * @access  public
 * @param   {string} id - Event ID
 */
router.post('/:id/image', authenticate, upload.single('image'), uploadEventImage);

/**
 * @route   POST /api/events/create/:id/publish
 * @desc    Publish an event
 * @access  Private
 * @param   {string} id - Event ID
 */
router.post('/:id/publish', authenticate, publishEvent);

export default router;

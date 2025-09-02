import express from 'express';
import multer from 'multer';
import { login, signUp } from '../controllers/authController';

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // make sure 'uploads/' folder exists
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Use upload.single('profile') to handle profile image from frontend
router.post('/signup', upload.single('profile'), signUp);
router.post('/login', login);


export default router;

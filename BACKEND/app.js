import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import the event routes
import authRoutes from './src/routes/authRoute.js';
import eventRoutes from './src/routes/eventRoute.js';
import eventCreateRoutes from './src/routes/eventCreateRoute.js';
import schoolAdminRoutes from './src/routes/schoolAdminRoute.js';
import contributionRoutes from './src/routes/contributionRoute.js';
import schoolApplicationRoutes from './src/routes/schoolApplicationRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/create', eventCreateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/school-admin', schoolAdminRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/school-applications', schoolApplicationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
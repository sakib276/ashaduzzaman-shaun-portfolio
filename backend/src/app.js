import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import portfolioRoutes from './routes/portfolioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { securityHeaders, injectionSanitizer } from './middleware/securityMiddleware.js';
import { getIsMongoConnected } from './config/database.js';

dotenv.config();

const app = express();

// Security & Defensive Middlewares
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(injectionSanitizer);

// Health / Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getIsMongoConnected() ? 'MongoDB Atlas (Connected)' : 'Local / Memory Fallback',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', authRoutes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

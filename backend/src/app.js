import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import portfolioRoutes from './routes/portfolioRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import { securityHeaders, injectionSanitizer } from './middleware/securityMiddleware.js';
import { connectDB, getIsMongoConnected, getLastMongoError } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();

// Security & Defensive Middlewares
app.use(securityHeaders);
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(injectionSanitizer);

// Health / Status Check
app.get('/api/health', async (req, res) => {
  if (!getIsMongoConnected()) {
    try {
      await connectDB();
    } catch {
      // Connect error tracked in database.js
    }
  }

  const isConnected = getIsMongoConnected();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'MongoDB Atlas (Connected)' : 'Local / Memory Fallback (Cluster Offline or Paused)',
    isMongoConnected: isConnected,
    lastMongoError: getLastMongoError() || null,
    readyState: mongoose.connection.readyState,
    version: '1.0.1'
  });
});

// API Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/auth', authRoutes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

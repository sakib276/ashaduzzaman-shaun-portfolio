import app from '../backend/src/app.js';
import { connectDB, getIsMongoConnected } from '../backend/src/config/database.js';

export default async function handler(req, res) {
  if (!getIsMongoConnected()) {
    try {
      await connectDB();
    } catch (e) {
      console.warn('MongoDB connection in serverless handler:', e.message);
    }
  }
  return app(req, res);
}

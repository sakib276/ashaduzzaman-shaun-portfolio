import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/database.js';

let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (e) {
      console.warn('MongoDB connection in serverless handler:', e.message);
    }
  }
  return app(req, res);
}

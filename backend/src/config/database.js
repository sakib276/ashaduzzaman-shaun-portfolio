import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let isMongoConnected = false;

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
  isMongoConnected = true;
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
  isMongoConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
  isMongoConnected = false;
});

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  No MONGODB_URI found. Running in Local Storage / In-Memory Fallback mode.');
    return false;
  }

  // If already connected
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  // If currently in the process of connecting
  if (mongoose.connection.readyState === 2) {
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isMongoConnected = true;
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection failed: ${error.message}`);
    isMongoConnected = false;
    return false;
  }
}

export function getIsMongoConnected() {
  return mongoose.connection.readyState === 1;
}

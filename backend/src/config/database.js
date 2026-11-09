import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const DEFAULT_MONGODB_URI = 'mongodb+srv://nazmussakib06927_db_user:aHK3fL9AgwO3kOaP@cluster0.xfjuj2j.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0';

let isMongoConnected = false;
let lastMongoError = null;

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
  isMongoConnected = true;
  lastMongoError = null;
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
  isMongoConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
  isMongoConnected = false;
  lastMongoError = err.message;
});

export async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  No MONGODB_URI found. Running in Local Storage / In-Memory Fallback mode.');
    lastMongoError = 'No MONGODB_URI provided';
    return false;
  }

  // If already connected
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  // If currently in the process of connecting, wait for it
  if (mongoose.connection.readyState === 2) {
    try {
      await mongoose.connection.asPromise();
      isMongoConnected = mongoose.connection.readyState === 1;
      return isMongoConnected;
    } catch (err) {
      isMongoConnected = false;
      lastMongoError = err.message;
      return false;
    }
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isMongoConnected = true;
    lastMongoError = null;
    return true;
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection failed: ${error.message}`);
    isMongoConnected = false;
    lastMongoError = error.message;
    return false;
  }
}

export function getIsMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export function getLastMongoError() {
  return lastMongoError;
}

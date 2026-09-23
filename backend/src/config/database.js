import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️  No MONGODB_URI found. Running in Local Storage / In-Memory Fallback mode.');
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
    console.log('ℹ️  Falling back to Local Storage mode.');
    isMongoConnected = false;
    return false;
  }
}

export function getIsMongoConnected() {
  return isMongoConnected;
}

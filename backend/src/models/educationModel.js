import mongoose from 'mongoose';

export const educationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, default: '' }
}, { _id: false });

import mongoose from 'mongoose';

export const experienceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

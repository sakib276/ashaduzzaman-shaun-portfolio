import mongoose from 'mongoose';

export const skillSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  level: { type: String, default: 'Intermediate' }
}, { _id: false });

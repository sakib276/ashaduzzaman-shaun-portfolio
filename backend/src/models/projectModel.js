import mongoose from 'mongoose';

export const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  github: { type: String, default: '' }
}, { _id: false });

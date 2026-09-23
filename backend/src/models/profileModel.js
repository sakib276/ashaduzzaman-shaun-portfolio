import mongoose from 'mongoose';

export const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, default: '' },
  about: { type: String, default: '' },
  location: { type: String, default: '' },
  focus: { type: String, default: '' },
  image: { type: String, default: '/profile.png' },
  experienceYears: { type: String, default: '3+' }
}, { _id: false });

import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  year: { type: String, default: '' },
  badge: { type: String, default: 'Achievement' }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  github: { type: String, default: '' }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  year: { type: String, default: '' }
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  profile: {
    name: { type: String, required: true, default: 'Ashaduzzaman Shaun' },
    bio: { type: String, default: '' },
    about: { type: String, default: '' },
    location: { type: String, default: 'Kolding, Denmark' },
    focus: { type: String, default: 'International Business Management & Development' },
    image: { type: String, default: '/profile.jpg' },
    cvUrl: { type: String, default: '/Shaun_CV.pdf' },
    experienceYears: { type: String, default: '2+' }
  },
  contact: {
    email: { type: String, default: 'azshaunofficial@gmail.com' },
    whatsapp: { type: String, default: '+45 71 51 45 43' },
    instagram: { type: String, default: 'https://www.instagram.com/azshaun' },
    linkedin: { type: String, default: 'https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/' },
    github: { type: String, default: '' }
  },
  achievements: [achievementSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  education: [educationSchema]
}, { timestamps: true });

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);

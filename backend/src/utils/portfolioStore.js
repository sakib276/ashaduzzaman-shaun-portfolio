import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Portfolio } from '../models/portfolioModel.js';
import { connectDB, getIsMongoConnected } from '../config/database.js';
import { defaultPortfolioData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');

async function ensureConnection() {
  if (!getIsMongoConnected() && process.env.MONGODB_URI) {
    try {
      await connectDB();
    } catch {
      // Connect attempt failed
    }
  }
}

// Memory cache fallback for serverless or ephemeral environments
let inMemoryData = JSON.parse(JSON.stringify(defaultPortfolioData));

function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  );
}

function ensureLocalFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPortfolioData, null, 2), 'utf-8');
      inMemoryData = JSON.parse(JSON.stringify(defaultPortfolioData));
    }
  } catch (err) {
    console.warn('Filesystem not writable, using memory storage:', err.message);
  }
}

function readLocalData() {
  try {
    ensureLocalFile();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryData = {
        ...defaultPortfolioData,
        ...parsed,
        profile: {
          ...defaultPortfolioData.profile,
          ...(parsed.profile || {})
        },
        contact: {
          ...defaultPortfolioData.contact,
          ...(parsed.contact || {})
        },
        achievements: parsed.achievements || defaultPortfolioData.achievements,
        experience: parsed.experience || defaultPortfolioData.experience,
        projects: parsed.projects || defaultPortfolioData.projects,
        education: parsed.education || defaultPortfolioData.education
      };
      return inMemoryData;
    }
  } catch (err) {
    console.warn('Error reading local file, using memory:', err.message);
  }
  return inMemoryData;
}

function writeLocalData(data) {
  inMemoryData = data;
  try {
    ensureLocalFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist to disk, stored in memory:', err.message);
  }
}

export async function getPortfolio() {
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) {
        doc = await Portfolio.create(defaultPortfolioData);
      }
      return doc.toObject();
    } catch (err) {
      console.error('Mongo read error, falling back to local:', err.message);
    }
  }
  return readLocalData();
}

export async function updateProfileAndContact(profileUpdates = {}, contactUpdates = null) {
  const cleanProfile = cleanObject(profileUpdates);
  const cleanContact = contactUpdates ? cleanObject(contactUpdates) : null;
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) {
        doc = new Portfolio(defaultPortfolioData);
      }
      if (Object.keys(cleanProfile).length > 0) {
        doc.profile = { ...doc.profile.toObject(), ...cleanProfile };
      }
      if (cleanContact && Object.keys(cleanContact).length > 0) {
        doc.contact = { ...doc.contact.toObject(), ...cleanContact };
      }
      await doc.save();
      const local = readLocalData();
      if (Object.keys(cleanProfile).length > 0) {
        local.profile = { ...local.profile, ...cleanProfile };
      }
      if (cleanContact && Object.keys(cleanContact).length > 0) {
        local.contact = { ...local.contact, ...cleanContact };
      }
      writeLocalData(local);
      return doc.toObject();
    } catch (err) {
      console.error('Mongo update profile and contact error:', err.message);
      throw new Error(`Failed to save to Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  if (Object.keys(cleanProfile).length > 0) {
    data.profile = { ...data.profile, ...cleanProfile };
  }
  if (cleanContact && Object.keys(cleanContact).length > 0) {
    data.contact = { ...data.contact, ...cleanContact };
  }
  writeLocalData(data);
  return data;
}

export async function updateProfile(updates) {
  return updateProfileAndContact(updates, null);
}

export async function updateContact(updates) {
  return updateProfileAndContact({}, updates);
}

export async function addAchievement(achievement) {
  const newAch = {
    id: achievement.id || `ach-${Date.now()}`,
    title: achievement.title,
    description: achievement.description || '',
    year: achievement.year || `${new Date().getFullYear()}`,
    badge: achievement.badge || 'Achievement'
  };
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.achievements.unshift(newAch);
      await doc.save();
      const local = readLocalData();
      local.achievements = [newAch, ...(local.achievements || [])];
      writeLocalData(local);
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add achievement error:', err.message);
      throw new Error(`Failed to save achievement to Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.achievements = [newAch, ...(data.achievements || [])];
  writeLocalData(data);
  return data;
}

export async function deleteAchievement(id) {
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.achievements = doc.achievements.filter((a) => a.id !== id);
        await doc.save();
        const local = readLocalData();
        local.achievements = (local.achievements || []).filter((a) => a.id !== id);
        writeLocalData(local);
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete achievement error:', err.message);
      throw new Error(`Failed to delete achievement from Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.achievements = (data.achievements || []).filter((a) => a.id !== id);
  writeLocalData(data);
  return data;
}

export async function addProject(project) {
  const newProj = {
    id: project.id || `proj-${Date.now()}`,
    title: project.title,
    description: project.description || '',
    technologies: Array.isArray(project.technologies) ? project.technologies : ['React'],
    link: project.link || '',
    github: project.github || ''
  };
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.projects.unshift(newProj);
      await doc.save();
      const local = readLocalData();
      local.projects = [newProj, ...(local.projects || [])];
      writeLocalData(local);
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add project error:', err.message);
      throw new Error(`Failed to save project to Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.projects = [newProj, ...(data.projects || [])];
  writeLocalData(data);
  return data;
}

export async function deleteProject(id) {
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.projects = doc.projects.filter((p) => p.id !== id);
        await doc.save();
        const local = readLocalData();
        local.projects = (local.projects || []).filter((p) => p.id !== id);
        writeLocalData(local);
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete project error:', err.message);
      throw new Error(`Failed to delete project from Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.projects = (data.projects || []).filter((p) => p.id !== id);
  writeLocalData(data);
  return data;
}

export async function addExperience(exp) {
  const newExp = {
    id: exp.id || `exp-${Date.now()}`,
    position: exp.position,
    company: exp.company,
    period: exp.period || '2024 - Present',
    description: exp.description || ''
  };
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.experience.unshift(newExp);
      await doc.save();
      const local = readLocalData();
      local.experience = [newExp, ...(local.experience || [])];
      writeLocalData(local);
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add experience error:', err.message);
      throw new Error(`Failed to save experience to Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.experience = [newExp, ...(data.experience || [])];
  writeLocalData(data);
  return data;
}

export async function deleteExperience(id) {
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.experience = doc.experience.filter((e) => e.id !== id);
        await doc.save();
        const local = readLocalData();
        local.experience = (local.experience || []).filter((e) => e.id !== id);
        writeLocalData(local);
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete experience error:', err.message);
      throw new Error(`Failed to delete experience from Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.experience = (data.experience || []).filter((e) => e.id !== id);
  writeLocalData(data);
  return data;
}

export async function addEducation(edu) {
  const newEdu = {
    id: edu.id || `edu-${Date.now()}`,
    degree: edu.degree,
    institution: edu.institution,
    year: edu.year || `${new Date().getFullYear()}`
  };
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.education.unshift(newEdu);
      await doc.save();
      const local = readLocalData();
      local.education = [newEdu, ...(local.education || [])];
      writeLocalData(local);
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add education error:', err.message);
      throw new Error(`Failed to save education to Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.education = [newEdu, ...(data.education || [])];
  writeLocalData(data);
  return data;
}

export async function deleteEducation(id) {
  await ensureConnection();

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.education = doc.education.filter((e) => e.id !== id);
        await doc.save();
        const local = readLocalData();
        local.education = (local.education || []).filter((e) => e.id !== id);
        writeLocalData(local);
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete education error:', err.message);
      throw new Error(`Failed to delete education from Cloud Database: ${err.message}`);
    }
  }

  if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
    throw new Error('Cloud Database is disconnected or paused. Please resume your MongoDB Atlas cluster.');
  }

  const data = readLocalData();
  data.education = (data.education || []).filter((e) => e.id !== id);
  writeLocalData(data);
  return data;
}

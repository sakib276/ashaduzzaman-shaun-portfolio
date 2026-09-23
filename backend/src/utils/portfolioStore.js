import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Portfolio } from '../models/portfolioModel.js';
import { getIsMongoConnected } from '../config/database.js';
import { defaultPortfolioData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');

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

export async function updateProfile(updates) {
  const cleaned = cleanObject(updates);

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) {
        doc = new Portfolio(defaultPortfolioData);
      }
      doc.profile = { ...doc.profile.toObject(), ...cleaned };
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo update profile error:', err.message);
    }
  }

  const data = readLocalData();
  data.profile = { ...data.profile, ...cleaned };
  writeLocalData(data);
  return data;
}

export async function updateContact(updates) {
  const cleaned = cleanObject(updates);

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) {
        doc = new Portfolio(defaultPortfolioData);
      }
      doc.contact = { ...doc.contact.toObject(), ...cleaned };
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo update contact error:', err.message);
    }
  }

  const data = readLocalData();
  data.contact = { ...data.contact, ...cleaned };
  writeLocalData(data);
  return data;
}

export async function addAchievement(achievement) {
  const newAch = {
    id: achievement.id || `ach-${Date.now()}`,
    title: achievement.title,
    description: achievement.description || '',
    year: achievement.year || `${new Date().getFullYear()}`,
    badge: achievement.badge || 'Achievement'
  };

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.achievements.unshift(newAch);
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add achievement error:', err.message);
    }
  }

  const data = readLocalData();
  data.achievements = [newAch, ...(data.achievements || [])];
  writeLocalData(data);
  return data;
}

export async function deleteAchievement(id) {
  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.achievements = doc.achievements.filter((a) => a.id !== id);
        await doc.save();
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete achievement error:', err.message);
    }
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

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.projects.unshift(newProj);
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add project error:', err.message);
    }
  }

  const data = readLocalData();
  data.projects = [newProj, ...(data.projects || [])];
  writeLocalData(data);
  return data;
}

export async function deleteProject(id) {
  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.projects = doc.projects.filter((p) => p.id !== id);
        await doc.save();
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete project error:', err.message);
    }
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

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.experience.unshift(newExp);
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add experience error:', err.message);
    }
  }

  const data = readLocalData();
  data.experience = [newExp, ...(data.experience || [])];
  writeLocalData(data);
  return data;
}

export async function deleteExperience(id) {
  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.experience = doc.experience.filter((e) => e.id !== id);
        await doc.save();
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete experience error:', err.message);
    }
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

  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (!doc) doc = new Portfolio(defaultPortfolioData);
      doc.education.unshift(newEdu);
      await doc.save();
      return doc.toObject();
    } catch (err) {
      console.error('Mongo add education error:', err.message);
    }
  }

  const data = readLocalData();
  data.education = [newEdu, ...(data.education || [])];
  writeLocalData(data);
  return data;
}

export async function deleteEducation(id) {
  if (getIsMongoConnected()) {
    try {
      let doc = await Portfolio.findOne();
      if (doc) {
        doc.education = doc.education.filter((e) => e.id !== id);
        await doc.save();
        return doc.toObject();
      }
    } catch (err) {
      console.error('Mongo delete education error:', err.message);
    }
  }

  const data = readLocalData();
  data.education = (data.education || []).filter((e) => e.id !== id);
  writeLocalData(data);
  return data;
}

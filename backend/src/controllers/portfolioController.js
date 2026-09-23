import {
  getPortfolio,
  updateProfile,
  updateContact,
  addAchievement,
  deleteAchievement,
  addProject,
  deleteProject,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation
} from '../utils/portfolioStore.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getPortfolioData(req, res) {
  try {
    const data = await getPortfolio();
    return sendSuccess(res, data, 'Portfolio data retrieved successfully');
  } catch (err) {
    return sendError(res, 'Failed to fetch portfolio data', 500, err);
  }
}

export async function handleUpdateProfile(req, res) {
  try {
    const { name, bio, about, location, focus, experienceYears, image, cvUrl, contact } = req.body;
    let updated = await updateProfile({ name, bio, about, location, focus, experienceYears, image, cvUrl });
    if (contact) {
      updated = await updateContact(contact);
    }
    return sendSuccess(res, updated, 'Profile updated successfully');
  } catch (err) {
    return sendError(res, 'Failed to update profile', 500, err);
  }
}

export async function handleAddAchievement(req, res) {
  try {
    const { title, description, year, badge } = req.body;
    if (!title) {
      return sendError(res, 'Title is required for achievement', 400);
    }
    const updated = await addAchievement({ title, description, year, badge });
    return sendSuccess(res, updated, 'Achievement added successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to add achievement', 500, err);
  }
}

export async function handleDeleteAchievement(req, res) {
  try {
    const { id } = req.params;
    const updated = await deleteAchievement(id);
    return sendSuccess(res, updated, 'Achievement deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete achievement', 500, err);
  }
}

export async function handleAddProject(req, res) {
  try {
    const { title, description, technologies, link, github } = req.body;
    if (!title || !description) {
      return sendError(res, 'Title and description are required for project', 400);
    }
    const updated = await addProject({ title, description, technologies, link, github });
    return sendSuccess(res, updated, 'Project added successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to add project', 500, err);
  }
}

export async function handleDeleteProject(req, res) {
  try {
    const { id } = req.params;
    const updated = await deleteProject(id);
    return sendSuccess(res, updated, 'Project deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete project', 500, err);
  }
}

export async function handleAddExperience(req, res) {
  try {
    const { position, company, period, description } = req.body;
    if (!position || !company) {
      return sendError(res, 'Position and company are required', 400);
    }
    const updated = await addExperience({ position, company, period, description });
    return sendSuccess(res, updated, 'Experience added successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to add experience', 500, err);
  }
}

export async function handleDeleteExperience(req, res) {
  try {
    const { id } = req.params;
    const updated = await deleteExperience(id);
    return sendSuccess(res, updated, 'Experience deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete experience', 500, err);
  }
}

export async function handleAddEducation(req, res) {
  try {
    const { degree, institution, year } = req.body;
    if (!degree || !institution) {
      return sendError(res, 'Degree and institution are required', 400);
    }
    const updated = await addEducation({ degree, institution, year });
    return sendSuccess(res, updated, 'Education added successfully', 201);
  } catch (err) {
    return sendError(res, 'Failed to add education', 500, err);
  }
}

export async function handleDeleteEducation(req, res) {
  try {
    const { id } = req.params;
    const updated = await deleteEducation(id);
    return sendSuccess(res, updated, 'Education deleted successfully');
  } catch (err) {
    return sendError(res, 'Failed to delete education', 500, err);
  }
}

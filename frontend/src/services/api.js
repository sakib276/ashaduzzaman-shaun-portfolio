/**
 * API Service for Portfolio CMS
 * Works smoothly with local proxy (port 5000) and Vercel serverless /api.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to build headers with admin auth
 */
function getHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const activeToken = token || sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
  if (activeToken) {
    headers['x-admin-key'] = activeToken;
    headers['Authorization'] = `Bearer ${activeToken}`;
  }

  return headers;
}

/**
 * Fetch portfolio data from backend
 */
export async function fetchPortfolio() {
  const res = await fetch(`${API_BASE_URL}/portfolio`);
  if (!res.ok) {
    throw new Error(`Failed to fetch portfolio: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

/**
 * Verify admin passcode
 */
export async function loginAdmin(passcode) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Authentication failed');
  }
  return json.data;
}

/**
 * Update personal profile & contact info
 */
export async function updateProfile(profileData, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/profile`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(profileData)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update profile');
  }
  return json.data;
}

/**
 * Add a new personal achievement
 */
export async function addAchievement(achievementData, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/achievements`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(achievementData)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add achievement');
  }
  return json.data;
}

/**
 * Delete an achievement
 */
export async function deleteAchievement(id, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/achievements/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete achievement');
  }
  return json.data;
}

/**
 * Add a project
 */
export async function addProject(projectData, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/projects`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(projectData)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add project');
  }
  return json.data;
}

/**
 * Delete a project
 */
export async function deleteProject(id, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/projects/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete project');
  }
  return json.data;
}

/**
 * Add an experience entry
 */
export async function addExperience(experienceData, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/experience`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(experienceData)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add experience');
  }
  return json.data;
}

/**
 * Delete an experience entry
 */
export async function deleteExperience(id, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/experience/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete experience');
  }
  return json.data;
}

/**
 * Add an education entry
 */
export async function addEducation(educationData, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/education`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(educationData)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to add education');
  }
  return json.data;
}

/**
 * Delete an education entry
 */
export async function deleteEducation(id, token) {
  const res = await fetch(`${API_BASE_URL}/portfolio/education/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to delete education');
  }
  return json.data;
}

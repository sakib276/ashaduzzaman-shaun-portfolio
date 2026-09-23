import { sendSuccess, sendError } from '../utils/response.js';

export function login(req, res) {
  const { passcode } = req.body;
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'shaun2026';

  if (!passcode) {
    return sendError(res, 'Passcode is required', 400);
  }

  if (passcode !== adminSecret) {
    return sendError(res, 'Invalid admin passcode', 401);
  }

  return sendSuccess(res, { token: adminSecret, role: 'admin' }, 'Authentication successful');
}

export function verify(req, res) {
  return sendSuccess(res, { authenticated: true, role: 'admin' }, 'Session is valid');
}

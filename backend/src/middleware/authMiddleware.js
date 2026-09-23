import { sendError } from '../utils/response.js';

export function requireAdmin(req, res, next) {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'shaun2026';
  
  const headerKey = req.headers['x-admin-key'];
  const authHeader = req.headers['authorization'];
  let bearerKey = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerKey = authHeader.substring(7).trim();
  }

  const providedKey = headerKey || bearerKey;

  if (!providedKey || providedKey !== adminSecret) {
    return sendError(res, 'Unauthorized: Invalid or missing admin passcode', 401);
  }

  next();
}

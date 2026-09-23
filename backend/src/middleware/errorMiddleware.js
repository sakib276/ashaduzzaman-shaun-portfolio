import { sendError } from '../utils/response.js';

export function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);
  return sendError(res, err.message || 'Internal Server Error', err.status || 500);
}

export function notFoundHandler(req, res) {
  return sendError(res, `Route not found: ${req.originalUrl}`, 404);
}

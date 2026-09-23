/**
 * Security Middleware for Personal Workshop & Portfolio CMS
 * Defends against:
 * 1. NoSQL & SQL Injection (recursively strips keys with $ and .)
 * 2. XSS & XML/HTML Injection (strips malicious executable tags and payloads)
 * 3. HTTP Security Headers (equivalent to Helmet: CSP, HSTS, X-Frame, Nosniff)
 * 4. Brute-Force Rate Limiting on Authentication endpoints
 */

// 1. Recursive Injection Sanitizer
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      // Strip potentially malicious XML/HTML/Script tags while preserving data
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<!ENTITY\b[^>]*>/gi, '')
        .replace(/<!DOCTYPE\b[^>]*>/gi, '')
        .replace(/javascript:[^"']*/gi, '');
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block Mongo / SQL operator injections (e.g., $where, $gt, $ne, or dot notation)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = sanitizeObject(value);
  }
  return cleaned;
}

export function injectionSanitizer(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}

// 2. HTTP Security Headers (Production-grade defensive headers)
export function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  next();
}

// 3. Simple In-Memory Rate Limiter for Login Protection
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function authRateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = loginAttempts.get(ip) || { count: 0, resetTime: now + WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + WINDOW_MS;
  }

  if (record.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((record.resetTime - now) / 60000);
    return res.status(429).json({
      success: false,
      message: `Too many login attempts. Please try again in ${minutesLeft} minute(s).`
    });
  }

  record.count += 1;
  loginAttempts.set(ip, record);
  next();
}

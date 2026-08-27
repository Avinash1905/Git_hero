/**
 * GitQuest Backend Middleware: Rate Limiting, Validation & Error Handling
 */

export class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.hits = new Map(); // ip -> [timestamps]
  }

  middleware() {
    return (req, res, next) => {
      const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const windowStart = now - this.windowMs;

      let timestamps = this.hits.get(ip) || [];
      timestamps = timestamps.filter(ts => ts > windowStart);

      if (timestamps.length >= this.maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please slow down and try again shortly.'
        });
      }

      timestamps.push(now);
      this.hits.set(ip, timestamps);
      next();
    };
  }
}

export function validateSchema(requiredFields = []) {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missing.join(', ')}`
      });
    }
    next();
  };
}

export function globalErrorHandler(err, req, res, next) {
  console.error('[Unhandled Server Exception]', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
    code: err.code || 'SERVER_ERROR'
  });
}

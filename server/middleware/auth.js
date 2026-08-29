// JWT Authentication Middleware
import { verifyToken } from '../utils/crypto.js';
import { db } from '../database/db.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid authentication token.' });
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyToken(token);

  if (!payload || !payload.userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token is invalid or expired.' });
  }

  const user = db.get('SELECT id, username, email, is_active FROM users WHERE id = ?', [payload.userId]);
  if (!user || !user.is_active) {
    return res.status(401).json({ success: false, error: 'Unauthorized: User account not found or deactivated.' });
  }

  const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [user.id]);

  req.user = user;
  req.player = profile || {};
  next();
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const payload = verifyToken(token);
    if (payload && payload.userId) {
      const user = db.get('SELECT id, username, email, is_active FROM users WHERE id = ?', [payload.userId]);
      if (user && user.is_active) {
        req.user = user;
        req.player = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [user.id]) || {};
      }
    }
  }
  next();
}

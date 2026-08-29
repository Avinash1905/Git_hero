// Authentication API Routes
import { Router } from 'express';
import { db } from '../database/db.js';
import { hashPassword, verifyPassword, generateToken, generateResetToken } from '../utils/crypto.js';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'node:crypto';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(422).json({ success: false, error: 'Username must be at least 3 characters.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(422).json({ success: false, error: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(422).json({ success: false, error: 'Password must be at least 6 characters.' });
  }

  const cleanUsername = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;
  const cleanEmail = email.trim().toLowerCase();

  // Check unique
  const existing = db.get('SELECT id FROM users WHERE username = ? OR email = ?', [cleanUsername, cleanEmail]);
  if (existing) {
    return res.status(409).json({ success: false, error: 'An account with that username or email already exists.' });
  }

  const { salt, hash } = hashPassword(password);
  const userId = crypto.randomUUID();

  try {
    db.transaction(() => {
      // 1. Insert user
      db.run(
        `INSERT INTO users (id, username, email, password_hash, salt)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, cleanUsername, cleanEmail, hash, salt]
      );

      // 2. Insert player profile
      db.run(
        `INSERT INTO player_profiles (user_id, title, level, xp, lives, streak_days)
         VALUES (?, 'Novice Contributor', 1, 0, 3, 1)`,
        [userId]
      );

      // 3. Unlock Level 01 by default
      db.run(
        `INSERT INTO level_progress (user_id, level_id, status)
         VALUES (?, '01', 'UNLOCKED')`,
        [userId]
      );
    });

    const user = db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId]);
    const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);
    const token = generateToken({ userId: user.id, username: user.username });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user,
      profile
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed due to a server error.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(422).json({ success: false, error: 'Username/Email and password are required.' });
  }

  const identifier = usernameOrEmail.trim().toLowerCase();
  const user = db.get(
    'SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(username) = ?',
    [identifier, identifier, `@${identifier}`]
  );

  if (!user || !user.is_active) {
    return res.status(401).json({ success: false, error: 'Invalid credentials or inactive account.' });
  }

  const isValid = verifyPassword(password, user.salt, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ success: false, error: 'Invalid credentials.' });
  }

  // Update last login
  db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

  const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [user.id]);
  const token = generateToken({ userId: user.id, username: user.username });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.created_at
    },
    profile
  });
});

// POST /api/auth/logout
authRouter.post('/logout', requireAuth, (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(422).json({ success: false, error: 'Email is required.' });
  }

  const user = db.get('SELECT id FROM users WHERE LOWER(email) = ?', [email.trim().toLowerCase()]);
  if (!user) {
    // For security, return success even if email not found
    return res.json({ success: true, message: 'If an account exists, a recovery code has been dispatched.' });
  }

  const { rawToken, tokenHash } = generateResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.run(
    `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at)
     VALUES (?, ?, ?, ?)`,
    [crypto.randomUUID(), user.id, tokenHash, expiresAt]
  );

  return res.json({
    success: true,
    message: 'Reset token generated successfully.',
    resetToken: rawToken // In production return via email, returned here for seamless verification
  });
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(422).json({ success: false, error: 'Valid token and new password (min 6 chars) are required.' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const record = db.get(
    'SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used = 0 AND expires_at > CURRENT_TIMESTAMP',
    [tokenHash]
  );

  if (!record) {
    return res.status(400).json({ success: false, error: 'Reset token is invalid or expired.' });
  }

  const { salt, hash } = hashPassword(newPassword);

  db.transaction(() => {
    db.run('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?', [hash, salt, record.user_id]);
    db.run('UPDATE password_reset_tokens SET used = 1 WHERE id = ?', [record.id]);
  });

  return res.json({ success: true, message: 'Password has been reset successfully. Please log in.' });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req, res) => {
  const user = req.user;
  const profile = req.player;

  const completedCount = db.get(
    `SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED'`,
    [user.id]
  )?.count || 0;

  // Find next playable level or active level
  const activeLevel = db.get(
    `SELECT level_id FROM level_progress WHERE user_id = ? AND status IN ('UNLOCKED', 'IN_PROGRESS') ORDER BY level_id ASC LIMIT 1`,
    [user.id]
  )?.level_id || '01';

  return res.json({
    success: true,
    user,
    profile,
    stats: {
      completedLevelsCount: completedCount,
      currentLevelId: activeLevel
    }
  });
});

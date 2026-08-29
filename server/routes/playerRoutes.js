// Player Profile & Statistics API Routes
import { Router } from 'express';
import { db } from '../database/db.js';
import { requireAuth } from '../middleware/auth.js';

export const playerRouter = Router();

// GET /api/player/profile
playerRouter.get('/profile', requireAuth, (req, res) => {
  const userId = req.user.id;
  const user = req.user;
  const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);

  const completedCount = db.get(
    `SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED'`,
    [userId]
  )?.count || 0;

  const perfectClears = db.get(
    `SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED' AND stars = 3`,
    [userId]
  )?.count || 0;

  let commandUsage = {};
  try {
    commandUsage = JSON.parse(profile.command_usage_json || '{}');
  } catch {}

  let settings = {};
  try {
    settings = JSON.parse(profile.settings_json || '{}');
  } catch {}

  return res.json({
    success: true,
    player: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: profile.avatar_url,
      title: profile.title,
      level: profile.level,
      xp: profile.xp,
      lives: profile.lives,
      streak: profile.streak_days,
      completedLevelsCount: completedCount,
      perfectClears,
      bugsSquashed: completedCount * 3 + perfectClears * 2,
      commandUsage,
      settings
    }
  });
});

// PUT /api/player/profile
playerRouter.put('/profile', requireAuth, (req, res) => {
  const userId = req.user.id;
  const { avatar_url, settings } = req.body;

  const updates = [];
  const params = [];

  if (avatar_url) {
    updates.push('avatar_url = ?');
    params.push(avatar_url);
  }

  if (settings && typeof settings === 'object') {
    updates.push('settings_json = ?');
    params.push(JSON.stringify(settings));
  }

  if (updates.length > 0) {
    params.push(userId);
    db.run(`UPDATE player_profiles SET ${updates.join(', ')} WHERE user_id = ?`, params);
  }

  const updatedProfile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);
  return res.json({ success: true, profile: updatedProfile });
});

// GET /api/player/stats
playerRouter.get('/stats', requireAuth, (req, res) => {
  const userId = req.user.id;

  const xpEvents = db.query(
    'SELECT * FROM xp_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 30',
    [userId]
  );

  const completedLevels = db.query(
    `SELECT lp.*, l.name, l.world, l.difficulty
     FROM level_progress lp
     JOIN levels l ON lp.level_id = l.id
     WHERE lp.user_id = ? AND lp.status = 'COMPLETED'
     ORDER BY lp.completed_at DESC`,
    [userId]
  );

  return res.json({
    success: true,
    xpEvents,
    completedLevels
  });
});

// Daily Challenge API Routes
import { Router } from 'express';
import { db } from '../database/db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import crypto from 'node:crypto';

export const challengeRouter = Router();

// GET /api/challenges/daily
challengeRouter.get('/daily', optionalAuth, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  let challenge = db.get('SELECT * FROM daily_challenges WHERE challenge_date = ?', [today]);

  if (!challenge) {
    // Generate for today
    challenge = {
      challenge_date: today,
      title: 'Memory Leak Substation',
      description: 'A severe memory leak has been detected in the core module. Navigate the fragmented memory grid to isolate and terminate the rogue processes before system failure.',
      difficulty: 'HARD',
      reward_xp: 1000,
      grid_size: '8x8',
      config_json: JSON.stringify({
        gridSize: 8,
        player: { x: 1, y: 1 },
        box: { x: 3, y: 3 },
        goal: { x: 6, y: 6 },
        walls: [{ x: 2, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 5 }],
        hazards: [{ x: 3, y: 4 }, { x: 4, y: 3 }]
      })
    };

    db.run(
      `INSERT INTO daily_challenges (challenge_date, title, description, difficulty, reward_xp, grid_size, config_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(challenge_date) DO NOTHING`,
      [challenge.challenge_date, challenge.title, challenge.description, challenge.difficulty, challenge.reward_xp, challenge.grid_size, challenge.config_json]
    );
  }

  let progress = null;
  if (req.user?.id) {
    progress = db.get(
      'SELECT * FROM daily_challenge_progress WHERE user_id = ? AND challenge_date = ?',
      [req.user.id, today]
    );
  }

  // Calculate remaining time until midnight UTC
  const now = new Date();
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  const diffMs = Math.max(0, endOfDay - now);
  const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
  const timeRemaining = `${hours}:${minutes}:${seconds}`;

  let config = {};
  try {
    config = JSON.parse(challenge.config_json);
  } catch {}

  return res.json({
    success: true,
    challenge: {
      date: challenge.challenge_date,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      rewardXP: challenge.reward_xp,
      gridSize: challenge.grid_size,
      timeRemaining,
      config,
      isCompleted: Boolean(progress && progress.status === 'COMPLETED')
    }
  });
});

// POST /api/challenges/daily/complete
challengeRouter.post('/daily/complete', requireAuth, (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];
  const challenge = db.get('SELECT * FROM daily_challenges WHERE challenge_date = ?', [today]);

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Daily challenge not found for today.' });
  }

  const existing = db.get(
    'SELECT * FROM daily_challenge_progress WHERE user_id = ? AND challenge_date = ?',
    [userId, today]
  );

  if (existing && existing.status === 'COMPLETED') {
    return res.json({ success: true, message: 'Daily challenge already completed today.', xpAwarded: 0 });
  }

  db.transaction(() => {
    db.run(
      `INSERT INTO daily_challenge_progress (user_id, challenge_date, status, completed_at)
       VALUES (?, ?, 'COMPLETED', CURRENT_TIMESTAMP)
       ON CONFLICT(user_id, challenge_date) DO UPDATE SET status = 'COMPLETED', completed_at = CURRENT_TIMESTAMP`,
      [userId, today]
    );

    db.run('UPDATE player_profiles SET xp = xp + ? WHERE user_id = ?', [challenge.reward_xp, userId]);

    db.run(
      `INSERT INTO xp_events (id, user_id, source_type, source_id, xp_amount)
       VALUES (?, ?, 'DAILY_CHALLENGE', ?, ?)`,
      [crypto.randomUUID(), userId, today, challenge.reward_xp]
    );
  });

  return res.json({
    success: true,
    message: 'Daily challenge completed!',
    xpAwarded: challenge.reward_xp
  });
});

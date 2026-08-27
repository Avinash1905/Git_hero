// Achievements API Routes: Real player achievement states
import { Router } from 'express';
import { db } from '../database/db.js';
import { optionalAuth } from '../middleware/auth.js';

export const achievementRouter = Router();

// GET /api/achievements
achievementRouter.get('/', optionalAuth, (req, res) => {
  const userId = req.user?.id;

  const allAchievements = db.query('SELECT * FROM achievements ORDER BY xp_reward ASC');

  let playerAchMap = {};
  if (userId) {
    const playerAchs = db.query('SELECT * FROM player_achievements WHERE user_id = ?', [userId]);
    for (const pa of playerAchs) {
      playerAchMap[pa.achievement_id] = pa;
    }
  }

  const enriched = allAchievements.map((ach) => {
    const pa = playerAchMap[ach.id];
    return {
      id: ach.id,
      code: ach.code,
      title: ach.title,
      desc: ach.description,
      icon: ach.icon,
      xp: ach.xp_reward,
      unlocked: Boolean(pa && pa.unlocked),
      progress: pa ? pa.progress : 0,
      maxProgress: ach.max_progress,
      date: pa?.unlocked_at ? new Date(pa.unlocked_at).toLocaleDateString() : null
    };
  });

  const unlockedCount = enriched.filter(a => a.unlocked).length;
  const completionPct = enriched.length > 0 ? Math.round((unlockedCount / enriched.length) * 100) : 0;

  return res.json({
    success: true,
    total: enriched.length,
    unlockedCount,
    completionPct,
    achievements: enriched
  });
});

// Progress API Routes: Progressive level unlocking & persistence
import { Router } from 'express';
import { db } from '../database/db.js';
import { requireAuth } from '../middleware/auth.js';

export const progressRouter = Router();

// GET /api/progress
progressRouter.get('/', requireAuth, (req, res) => {
  const userId = req.user.id;

  const progressRecords = db.query(
    `SELECT lp.*, l.name, l.world, l.difficulty, l.number
     FROM level_progress lp
     JOIN levels l ON lp.level_id = l.id
     WHERE lp.user_id = ?
     ORDER BY l.number ASC`,
    [userId]
  );

  const completedCount = progressRecords.filter(r => r.status === 'COMPLETED').length;
  const activeLevel = progressRecords.find(r => r.status === 'UNLOCKED' || r.status === 'IN_PROGRESS')?.level_id || '01';

  // Calculate current world (based on active level)
  const activeLvlDef = db.get('SELECT world FROM levels WHERE id = ?', [activeLevel]);
  const currentWorld = activeLvlDef?.world || 1;

  const levelsMap = {};
  for (const rec of progressRecords) {
    levelsMap[rec.level_id] = {
      completed: rec.status === 'COMPLETED',
      status: rec.status,
      stars: rec.stars,
      time: rec.best_time_sec ? `${String(Math.floor(rec.best_time_sec / 60)).padStart(2, '0')}:${String(rec.best_time_sec % 60).padStart(2, '0')}` : '--:--',
      moves: rec.best_moves,
      score: rec.best_score
    };
  }

  return res.json({
    success: true,
    progress: {
      currentWorld,
      currentLevelId: activeLevel,
      completedCount,
      totalLevels: 250,
      levels: levelsMap
    }
  });
});

// Leaderboard API Routes: Real player database rankings
import { Router } from 'express';
import { db } from '../database/db.js';
import { optionalAuth } from '../middleware/auth.js';

export const leaderboardRouter = Router();

// GET /api/leaderboard?tab=global|friends|weekly
leaderboardRouter.get('/', optionalAuth, (req, res) => {
  const currentUserId = req.user?.id;
  const tab = req.query.tab || 'global';

  let sql = `
    SELECT 
      u.id as user_id,
      u.username as handle,
      p.title,
      p.xp,
      p.level,
      p.avatar_url as avatar,
      (SELECT COUNT(*) FROM level_progress lp WHERE lp.user_id = u.id AND lp.status = 'COMPLETED') as completed_levels,
      (SELECT COALESCE(SUM(best_score), 0) FROM level_progress lp WHERE lp.user_id = u.id AND lp.status = 'COMPLETED') as score
    FROM users u
    JOIN player_profiles p ON u.id = p.user_id
    WHERE u.is_active = 1
    ORDER BY p.xp DESC, completed_levels DESC, u.created_at ASC
    LIMIT 50
  `;

  if (tab === 'weekly') {
    sql = `
      SELECT 
        u.id as user_id,
        u.username as handle,
        p.title,
        p.level,
        p.avatar_url as avatar,
        COALESCE(SUM(xe.xp_amount), 0) as xp,
        (SELECT COUNT(*) FROM level_progress lp WHERE lp.user_id = u.id AND lp.status = 'COMPLETED') as completed_levels,
        (SELECT COALESCE(SUM(best_score), 0) FROM level_progress lp WHERE lp.user_id = u.id AND lp.status = 'COMPLETED') as score
      FROM users u
      JOIN player_profiles p ON u.id = p.user_id
      LEFT JOIN xp_events xe ON u.id = xe.user_id AND xe.created_at >= datetime('now', '-7 days')
      WHERE u.is_active = 1
      GROUP BY u.id
      ORDER BY xp DESC, score DESC
      LIMIT 50
    `;
  }

  const rows = db.query(sql);

  const leaderboard = rows.map((r, index) => {
    const isUser = Boolean(currentUserId && r.user_id === currentUserId);
    return {
      rank: index + 1,
      handle: r.handle + (isUser ? ' (You)' : ''),
      title: r.title,
      xp: (r.xp || 0).toLocaleString(),
      rawXp: r.xp || 0,
      levels: r.completed_levels || 0,
      score: (r.score || 0).toLocaleString(),
      rawScore: r.score || 0,
      avatar: r.avatar,
      isUser
    };
  });

  return res.json({
    success: true,
    tab,
    total: leaderboard.length,
    leaderboard
  });
});

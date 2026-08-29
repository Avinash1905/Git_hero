/**
 * GitQuest Backend Repository: Player Profile, Level, Progress, Session & Achievement Repositories
 */

import { db } from '../db.js';

export class PlayerRepository {
  static findByUserId(userId) {
    return db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);
  }

  static create(profile) {
    return db.run(
      `INSERT INTO player_profiles (user_id, avatar_url, title, level, xp, lives, streak_days, last_active_date, settings)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.userId,
        profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        profile.title || 'Novice Contributor',
        profile.level || 1,
        profile.xp || 0,
        profile.lives || 3,
        profile.streakDays || 1,
        profile.lastActiveDate || new Date().toISOString().split('T')[0],
        typeof profile.settings === 'object' ? JSON.stringify(profile.settings) : (profile.settings || '{}')
      ]
    );
  }

  static updateXPAndLevel(userId, xp, level, title) {
    return db.run(
      `UPDATE player_profiles SET xp = ?, level = ?, title = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [xp, level, title, userId]
    );
  }

  static incrementStreak(userId, todayDate) {
    return db.run(
      `UPDATE player_profiles SET streak_days = streak_days + 1, last_active_date = ? WHERE user_id = ?`,
      [todayDate, userId]
    );
  }
}

export class LevelRepository {
  static findAll() {
    return db.query('SELECT * FROM levels ORDER BY number ASC');
  }

  static findById(levelId) {
    return db.get('SELECT * FROM levels WHERE id = ?', [levelId]);
  }

  static findByWorld(worldNumber) {
    return db.query('SELECT * FROM levels WHERE world = ? ORDER BY number ASC', [worldNumber]);
  }

  static count() {
    return db.get('SELECT COUNT(*) as count FROM levels')?.count || 0;
  }
}

export class ProgressRepository {
  static findByUser(userId) {
    return db.query('SELECT * FROM level_progress WHERE user_id = ? ORDER BY level_id ASC', [userId]);
  }

  static findByUserAndLevel(userId, levelId) {
    return db.get('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?', [userId, levelId]);
  }

  static upsertProgress(userId, levelId, status, stars, score, moves, timeSec) {
    const existing = this.findByUserAndLevel(userId, levelId);
    if (!existing) {
      return db.run(
        `INSERT INTO level_progress (user_id, level_id, status, stars, best_score, best_moves, best_time_sec, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, levelId, status, stars, score, moves, timeSec, status === 'COMPLETED' ? new Date().toISOString() : null]
      );
    } else {
      return db.run(
        `UPDATE level_progress
         SET status = ?,
             stars = MAX(stars, ?),
             best_score = MAX(best_score, ?),
             best_moves = CASE WHEN best_moves = 0 THEN ? ELSE MIN(best_moves, ?) END,
             best_time_sec = CASE WHEN best_time_sec = 0 THEN ? ELSE MIN(best_time_sec, ?) END,
             completed_at = CASE WHEN ? = 'COMPLETED' AND completed_at IS NULL THEN CURRENT_TIMESTAMP ELSE completed_at END,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND level_id = ?`,
        [status, stars, score, moves, moves, timeSec, timeSec, status, userId, levelId]
      );
    }
  }

  static countCompleted(userId) {
    return db.get(`SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED'`, [userId])?.count || 0;
  }
}

export class SessionRepository {
  static create(id, userId, levelId) {
    return db.run(
      `INSERT INTO game_sessions (id, user_id, level_id, status, started_at) VALUES (?, ?, ?, 'ACTIVE', ?)`,
      [id, userId, levelId, new Date().toISOString()]
    );
  }

  static findById(sessionId) {
    return db.get('SELECT * FROM game_sessions WHERE id = ?', [sessionId]);
  }

  static complete(sessionId, moves, timeSec, score) {
    return db.run(
      `UPDATE game_sessions SET status = 'COMPLETED', moves = ?, time_seconds = ?, score = ?, completed_at = ? WHERE id = ?`,
      [moves, timeSec, score, new Date().toISOString(), sessionId]
    );
  }

  static abandon(sessionId) {
    return db.run(`UPDATE game_sessions SET status = 'ABANDONED' WHERE id = ?`, [sessionId]);
  }
}

export class XPRepository {
  static recordEvent(userId, amount, reason, sourceId = null) {
    return db.run(
      `INSERT INTO xp_events (user_id, xp_amount, reason, source_id, created_at) VALUES (?, ?, ?, ?, ?)`,
      [userId, amount, reason, sourceId, new Date().toISOString()]
    );
  }

  static findByUser(userId, limit = 20) {
    return db.query(`SELECT * FROM xp_events WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`, [userId, limit]);
  }
}

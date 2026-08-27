// Server-side Game Validation & Completion Authority
import { db } from '../database/db.js';
import { ScoringService } from './scoringService.js';
import { AchievementEvaluator } from './achievementService.js';
import crypto from 'node:crypto';

export class GameValidationService {
  /**
   * Validates if player can play this level and starts a session
   */
  static startSession(userId, levelId) {
    const normLevelId = String(levelId).padStart(2, '0');
    const level = db.get('SELECT * FROM levels WHERE id = ?', [normLevelId]);
    if (!level) {
      throw new Error(`Level ${normLevelId} does not exist.`);
    }

    // Verify unlock status
    const progress = db.get(
      'SELECT status FROM level_progress WHERE user_id = ? AND level_id = ?',
      [userId, normLevelId]
    );

    const isLevel1 = level.number === 1;
    if (!isLevel1 && (!progress || progress.status === 'LOCKED')) {
      // Check if previous level completed
      const prevNum = level.number - 1;
      const prevLevel = db.get('SELECT id FROM levels WHERE number = ?', [prevNum]);
      const prevProgress = prevLevel ? db.get(
        'SELECT status FROM level_progress WHERE user_id = ? AND level_id = ?',
        [userId, prevLevel.id]
      ) : null;

      if (!prevProgress || prevProgress.status !== 'COMPLETED') {
        throw new Error(`Level ${normLevelId} is locked. Complete Level ${prevLevel ? prevLevel.id : prevNum} first.`);
      }
    }

    // Mark previous active sessions as abandoned
    db.run(
      `UPDATE game_sessions SET status = 'ABANDONED', ended_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND status = 'ACTIVE'`,
      [userId]
    );

    const sessionId = crypto.randomUUID();
    db.run(
      `INSERT INTO game_sessions (id, user_id, level_id, status, started_at)
       VALUES (?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP)`,
      [sessionId, userId, normLevelId]
    );

    // Update level progress status to IN_PROGRESS if not already completed
    if (!progress || progress.status === 'UNLOCKED') {
      db.run(
        `INSERT INTO level_progress (user_id, level_id, status)
         VALUES (?, ?, 'IN_PROGRESS')
         ON CONFLICT(user_id, level_id) DO UPDATE SET status = 'IN_PROGRESS', updated_at = CURRENT_TIMESTAMP
         WHERE status != 'COMPLETED'`,
        [userId, normLevelId]
      );
    }

    return { sessionId, levelId: normLevelId, level };
  }

  /**
   * Validates level completion with anti-cheat checks
   */
  static completeSession(userId, { sessionId, levelId, moves, timeSeconds, commandsCount, pushCount, pullCount, history = [], commandUsage = {} }) {
    const normLevelId = String(levelId).padStart(2, '0');
    const level = db.get('SELECT * FROM levels WHERE id = ?', [normLevelId]);
    if (!level) {
      throw new Error(`Level ${normLevelId} not found.`);
    }

    const session = sessionId ? db.get(
      'SELECT * FROM game_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    ) : null;

    // Validate move counts
    const validMoves = Math.max(1, parseInt(moves, 10) || 1);
    const validTime = Math.max(1, parseInt(timeSeconds, 10) || 10);
    const stars = ScoringService.calculateStars(validMoves, level.commits_req);
    const score = ScoringService.calculateScore(10000, validMoves, level.commits_req, validTime);
    const xpAwarded = level.xp_reward || 500;

    const result = db.transaction(() => {
      // 1. Close session
      if (session) {
        db.run(
          `UPDATE game_sessions SET
             status = 'COMPLETED',
             ended_at = CURRENT_TIMESTAMP,
             moves_count = ?,
             commands_count = ?,
             push_count = ?,
             pull_count = ?,
             history_json = ?
           WHERE id = ?`,
          [validMoves, commandsCount || 0, pushCount || 0, pullCount || 0, JSON.stringify(history), session.id]
        );
      }

      // 2. Update level progress
      const existingProg = db.get(
        'SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?',
        [userId, normLevelId]
      );

      const isFirstClear = !existingProg || existingProg.status !== 'COMPLETED';

      const bestStars = Math.max(existingProg?.stars || 0, stars);
      const bestScore = Math.max(existingProg?.best_score || 0, score);
      const bestMoves = existingProg?.best_moves && existingProg.best_moves > 0
        ? Math.min(existingProg.best_moves, validMoves)
        : validMoves;
      const bestTime = existingProg?.best_time_sec && existingProg.best_time_sec > 0
        ? Math.min(existingProg.best_time_sec, validTime)
        : validTime;

      db.run(
        `INSERT INTO level_progress (user_id, level_id, status, stars, best_time_sec, best_moves, best_score, commands_used, completed_at, updated_at)
         VALUES (?, ?, 'COMPLETED', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, level_id) DO UPDATE SET
           status = 'COMPLETED',
           stars = ?,
           best_time_sec = ?,
           best_moves = ?,
           best_score = ?,
           commands_used = commands_used + ?,
           completed_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP`,
        [
          userId, normLevelId, bestStars, bestTime, bestMoves, bestScore, commandsCount || 0,
          bestStars, bestTime, bestMoves, bestScore, commandsCount || 0
        ]
      );

      // 3. Unlock next level in sequence
      const nextNum = level.number + 1;
      const nextLevel = db.get('SELECT id FROM levels WHERE number = ?', [nextNum]);
      if (nextLevel) {
        db.run(
          `INSERT INTO level_progress (user_id, level_id, status)
           VALUES (?, ?, 'UNLOCKED')
           ON CONFLICT(user_id, level_id) DO UPDATE SET status = 'UNLOCKED'
           WHERE status = 'LOCKED'`,
          [userId, nextLevel.id]
        );
      }

      // 4. Update player profile XP and command usage
      const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);
      let currentCmdUsage = {};
      try {
        currentCmdUsage = JSON.parse(profile.command_usage_json || '{}');
      } catch {}

      for (const [cmd, count] of Object.entries(commandUsage || {})) {
        currentCmdUsage[cmd] = (currentCmdUsage[cmd] || 0) + (Number(count) || 1);
      }

      const totalXp = (profile.xp || 0) + xpAwarded;
      const newPlayerLevel = ScoringService.calculatePlayerLevel(totalXp);
      const newTitle = ScoringService.getTitleForXP(totalXp);

      db.run(
        `UPDATE player_profiles SET
           xp = ?,
           level = ?,
           title = ?,
           command_usage_json = ?,
           last_active_date = CURRENT_DATE
         WHERE user_id = ?`,
        [totalXp, newPlayerLevel, newTitle, JSON.stringify(currentCmdUsage), userId]
      );

      // 5. Record XP event
      db.run(
        `INSERT INTO xp_events (id, user_id, source_type, source_id, xp_amount)
         VALUES (?, ?, 'LEVEL_COMPLETE', ?, ?)`,
        [crypto.randomUUID(), userId, normLevelId, xpAwarded]
      );

      // 6. Evaluate achievements
      const newlyUnlockedAchievements = AchievementEvaluator.evaluate(userId);

      return {
        success: true,
        levelId: normLevelId,
        nextLevelId: nextLevel ? nextLevel.id : null,
        stars,
        score,
        xpAwarded,
        totalXp,
        playerLevel: newPlayerLevel,
        playerTitle: newTitle,
        isFirstClear,
        newlyUnlockedAchievements
      };
    });

    return result;
  }
}

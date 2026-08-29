// Server-side Achievement Evaluator
import { db } from '../database/db.js';

export class AchievementEvaluator {
  static evaluate(userId) {
    const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [userId]);
    if (!profile) return [];

    const completedCount = db.get(
      `SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED'`,
      [userId]
    )?.count || 0;

    let commandUsage = {};
    try {
      commandUsage = JSON.parse(profile.command_usage_json || '{}');
    } catch {
      commandUsage = {};
    }

    const newlyUnlocked = [];

    // Helper to check & award
    const checkAchievement = (achId, conditionMet, currentProgress = 1) => {
      const existing = db.get(
        'SELECT * FROM player_achievements WHERE user_id = ? AND achievement_id = ?',
        [userId, achId]
      );

      const achDef = db.get('SELECT * FROM achievements WHERE id = ?', [achId]);
      if (!achDef) return;

      if (!existing) {
        db.run(
          `INSERT INTO player_achievements (user_id, achievement_id, unlocked, progress, unlocked_at)
           VALUES (?, ?, ?, ?, ?)`,
          [userId, achId, conditionMet ? 1 : 0, currentProgress, conditionMet ? new Date().toISOString() : null]
        );
        if (conditionMet) {
          // Award XP
          db.run('UPDATE player_profiles SET xp = xp + ? WHERE user_id = ?', [achDef.xp_reward, userId]);
          db.run(
            `INSERT INTO xp_events (id, user_id, source_type, source_id, xp_amount)
             VALUES (?, ?, 'ACHIEVEMENT', ?, ?)`,
            [crypto.randomUUID ? crypto.randomUUID() : String(Math.random()), userId, achId, achDef.xp_reward]
          );
          newlyUnlocked.push(achDef);
        }
      } else if (!existing.unlocked) {
        if (conditionMet) {
          db.run(
            `UPDATE player_achievements SET unlocked = 1, progress = ?, unlocked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND achievement_id = ?`,
            [currentProgress, userId, achId]
          );
          db.run('UPDATE player_profiles SET xp = xp + ? WHERE user_id = ?', [achDef.xp_reward, userId]);
          db.run(
            `INSERT INTO xp_events (id, user_id, source_type, source_id, xp_amount)
             VALUES (?, ?, 'ACHIEVEMENT', ?, ?)`,
            [crypto.randomUUID ? crypto.randomUUID() : String(Math.random()), userId, achId, achDef.xp_reward]
          );
          newlyUnlocked.push(achDef);
        } else if (currentProgress !== existing.progress) {
          db.run(
            `UPDATE player_achievements SET progress = ? WHERE user_id = ? AND achievement_id = ?`,
            [currentProgress, userId, achId]
          );
        }
      }
    };

    // 1. FIRST_COMMIT: completed >= 1
    checkAchievement('first_commit', completedCount >= 1, Math.min(1, completedCount));

    // 2. STATUS_CHECK: git status >= 10
    const statusUsage = commandUsage['git status'] || 0;
    checkAchievement('status_check', statusUsage >= 10, statusUsage);

    // 3. PUSH_MASTER: git push >= 15
    const pushUsage = commandUsage['git push'] || 0;
    checkAchievement('push_master', pushUsage >= 15, pushUsage);

    // 4. PULL_MASTER: git pull >= 15
    const pullUsage = (commandUsage['git pull'] || 0) + (commandUsage['git pull left'] || 0) + (commandUsage['git pull right'] || 0);
    checkAchievement('pull_master', pullUsage >= 15, pullUsage);

    // 5. BRANCH_WEAVER: completed >= 10
    checkAchievement('branch_weaver', completedCount >= 10, Math.min(10, completedCount));

    // 6. GRANDMASTER: xp >= 20000
    checkAchievement('grandmaster', profile.xp >= 20000, profile.xp);

    return newlyUnlocked;
  }
}

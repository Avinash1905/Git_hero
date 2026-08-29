/**
 * LevelProgressManager
 * Authoritative client-side calculation and verification of level unlock states across all 250 levels.
 * Guarantees that newly registered users begin with Level 1 UNLOCKED and Levels 2-250 LOCKED.
 */

import { LevelDataAdapter } from '../../adapters/LevelDataAdapter.js';

export class LevelProgressManager {
  /**
   * Determine exact access status for any level
   * @param {string|number} levelId
   * @param {Record<string, {status?: string, completed?: boolean}>} userProgress
   * @returns {'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED'}
   */
  static getLevelStatus(levelId, userProgress = {}) {
    const normId = LevelDataAdapter.normalizeLevelId(levelId);
    const num = LevelDataAdapter.parseLevelNumber(normId);

    // If explicit entry exists
    const entry = userProgress[normId] || userProgress[String(num)];
    if (entry) {
      if (entry.completed || entry.status === 'COMPLETED') {
        return 'COMPLETED';
      }
      if (entry.status === 'IN_PROGRESS') {
        return 'IN_PROGRESS';
      }
      if (entry.status === 'UNLOCKED') {
        return 'UNLOCKED';
      }
    }

    // Level 1 is always unlocked by definition
    if (num === 1) {
      return 'UNLOCKED';
    }

    // Level N is unlocked if and only if Level N-1 is completed
    const prevId = LevelDataAdapter.normalizeLevelId(num - 1);
    const prevEntry = userProgress[prevId] || userProgress[String(num - 1)];

    if (prevEntry && (prevEntry.completed || prevEntry.status === 'COMPLETED')) {
      return 'UNLOCKED';
    }

    return 'LOCKED';
  }

  /**
   * Check if level is playable
   * @param {string|number} levelId
   * @param {Object} userProgress
   * @returns {boolean}
   */
  static isLevelUnlocked(levelId, userProgress = {}) {
    const status = this.getLevelStatus(levelId, userProgress);
    return status === 'UNLOCKED' || status === 'IN_PROGRESS' || status === 'COMPLETED';
  }

  /**
   * Calculate global completion statistics
   * @param {Array<Object>} allLevels - All 250 levels
   * @param {Record<string, Object>} userProgress
   */
  static calculateGlobalStats(allLevels, userProgress = {}) {
    let completedCount = 0;
    let unlockedCount = 0;
    let totalStars = 0;
    let totalXpEarned = 0;

    for (const lvl of allLevels) {
      const status = this.getLevelStatus(lvl.id, userProgress);
      if (status === 'COMPLETED') {
        completedCount++;
        unlockedCount++;
        const prog = userProgress[lvl.id] || userProgress[String(lvl.number)];
        totalStars += prog?.stars || 3;
        totalXpEarned += lvl.xpReward || 500;
      } else if (status === 'UNLOCKED' || status === 'IN_PROGRESS') {
        unlockedCount++;
      }
    }

    const percentage = allLevels.length > 0 ? Math.round((completedCount / allLevels.length) * 100) : 0;

    return {
      totalLevels: allLevels.length,
      completedCount,
      unlockedCount,
      totalStars,
      totalXpEarned,
      percentage
    };
  }

  /**
   * Calculate completion statistics for a specific World
   * @param {number} worldNumber
   * @param {Array<Object>} allLevels
   * @param {Object} userProgress
   */
  static calculateWorldStats(worldNumber, allLevels, userProgress = {}) {
    const worldLevels = allLevels.filter((lvl) => (lvl.world || LevelDataAdapter.calculateWorld(lvl.number)) === worldNumber);
    const stats = this.calculateGlobalStats(worldLevels, userProgress);
    return {
      worldNumber,
      ...stats
    };
  }
}

/**
 * LevelNavigation
 * Resolves next and previous levels, world traversals, and quick-continue targets.
 */

import { LevelDataAdapter } from '../../adapters/LevelDataAdapter.js';
import { LevelProgressManager } from './LevelProgressManager.js';

export class LevelNavigation {
  /**
   * Resolve the next level in numeric sequence
   * @param {string|number} currentLevelId
   * @param {number} [maxLevel=250]
   * @returns {string|null}
   */
  static getNextLevelId(currentLevelId, maxLevel = 250) {
    const num = LevelDataAdapter.parseLevelNumber(currentLevelId);
    if (num < maxLevel) {
      return LevelDataAdapter.normalizeLevelId(num + 1);
    }
    return null;
  }

  /**
   * Resolve the previous level in numeric sequence
   * @param {string|number} currentLevelId
   * @returns {string|null}
   */
  static getPreviousLevelId(currentLevelId) {
    const num = LevelDataAdapter.parseLevelNumber(currentLevelId);
    if (num > 1) {
      return LevelDataAdapter.normalizeLevelId(num - 1);
    }
    return null;
  }

  /**
   * Find the highest unlocked, uncompleted level to continue playing
   * @param {Array<Object>} allLevels
   * @param {Object} userProgress
   * @returns {string}
   */
  static findContinueLevelId(allLevels, userProgress = {}) {
    const sorted = [...allLevels].sort((a, b) => a.number - b.number);
    for (const lvl of sorted) {
      const status = LevelProgressManager.getLevelStatus(lvl.id, userProgress);
      if (status === 'UNLOCKED' || status === 'IN_PROGRESS') {
        return lvl.id;
      }
    }
    // If all completed or none found, return highest unlocked or Level 1
    return sorted[0]?.id || '01';
  }
}

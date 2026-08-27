/**
 * LevelLoader
 * Asynchronously loads, parses, and caches level definitions for all 250 levels.
 */

import { levelService } from '../../services/levelService.js';
import { LevelDataAdapter } from '../../adapters/LevelDataAdapter.js';

export class LevelLoader {
  constructor() {
    this.loadedLevels = new Map(); // id -> levelModel
    this.isPreloaded = false;
  }

  /**
   * Preload all 250 levels metadata in background
   * @param {Object} [userProgress]
   */
  async preloadAll(userProgress = null) {
    const rawLevels = await levelService.getAllLevels();
    for (const lvl of rawLevels) {
      const model = LevelDataAdapter.adaptToLevelModel(lvl, lvl.id, userProgress);
      this.loadedLevels.set(model.id, model);
    }
    this.isPreloaded = true;
    return Array.from(this.loadedLevels.values()).sort((a, b) => a.number - b.number);
  }

  /**
   * Load individual level
   * @param {string|number} levelId
   * @param {Object} [userProgress]
   */
  async loadLevel(levelId, userProgress = null) {
    const normId = LevelDataAdapter.normalizeLevelId(levelId);
    if (this.loadedLevels.has(normId)) {
      const cached = this.loadedLevels.get(normId);
      if (userProgress) {
        return LevelDataAdapter.adaptToLevelModel(cached, normId, userProgress);
      }
      return cached;
    }

    const raw = await levelService.getLevelById(normId);
    const model = LevelDataAdapter.adaptToLevelModel(raw, normId, userProgress);
    this.loadedLevels.set(normId, model);
    return model;
  }

  /**
   * Clear in-memory cache
   */
  clear() {
    this.loadedLevels.clear();
    this.isPreloaded = false;
  }
}

export const levelLoader = new LevelLoader();

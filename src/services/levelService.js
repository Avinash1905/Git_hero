/**
 * LevelService
 * Handles fetching, caching, and access verification for all 250 GitQuest levels.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';
import { LevelDataAdapter } from '../adapters/LevelDataAdapter.js';

export class LevelService {
  constructor() {
    this.levelsCache = null;
    this.lastFetched = 0;
    this.cacheDuration = 60000; // 1 minute
  }

  /**
   * Fetch all 250 levels sorted numerically
   * @param {boolean} forceRefresh
   * @returns {Promise<Array<Object>>}
   */
  async getAllLevels(forceRefresh = false) {
    if (!forceRefresh && this.levelsCache && (Date.now() - this.lastFetched < this.cacheDuration)) {
      return this.levelsCache;
    }

    try {
      const res = await apiClient.get(ENDPOINTS.LEVELS.LIST);
      if (res.success && Array.isArray(res.levels)) {
        // Sort strictly numerically: 1, 2, 3 ... 250
        this.levelsCache = res.levels.sort((a, b) => (a.number || parseInt(a.id, 10)) - (b.number || parseInt(b.id, 10)));
        this.lastFetched = Date.now();
        return this.levelsCache;
      }
    } catch (err) {
      console.warn('[LevelService] Failed to load levels from backend, building from engine ALL_LEVELS registry:', err.message);
    }

    // Engine fallback
    const fallback = Object.entries(ALL_LEVELS)
      .map(([id, def]) => LevelDataAdapter.adaptToLevelModel(def, id))
      .sort((a, b) => a.number - b.number);

    this.levelsCache = fallback;
    this.lastFetched = Date.now();
    return this.levelsCache;
  }

  /**
   * Fetch specific level by ID
   * @param {string|number} levelId
   * @returns {Promise<Object>}
   */
  async getLevelById(levelId) {
    const normId = LevelDataAdapter.normalizeLevelId(levelId);
    try {
      const res = await apiClient.get(ENDPOINTS.LEVELS.DETAIL(normId));
      if (res.success && res.level) {
        return res.level;
      }
    } catch (err) {
      console.warn(`[LevelService] Error fetching level ${normId} from API, using engine registry:`, err.message);
    }

    const rawDef = ALL_LEVELS[normId] || ALL_LEVELS[String(parseInt(normId, 10))];
    if (rawDef) {
      return LevelDataAdapter.adaptToLevelModel(rawDef, normId);
    }
    return null;
  }

  /**
   * Check if player has unlocked the level
   * @param {string|number} levelId
   * @returns {Promise<{unlocked: boolean, reason?: string}>}
   */
  async checkAccess(levelId) {
    const normId = LevelDataAdapter.normalizeLevelId(levelId);
    const num = LevelDataAdapter.parseLevelNumber(normId);

    if (num === 1) {
      return { unlocked: true };
    }

    try {
      const res = await apiClient.get(ENDPOINTS.LEVELS.CHECK_ACCESS(normId));
      if (res.success) {
        return { unlocked: Boolean(res.unlocked) };
      }
    } catch (err) {
      console.warn(`[LevelService] Access check API failed for ${normId}:`, err.message);
    }

    return { unlocked: false, reason: 'Level locked. Complete previous level.' };
  }
}

export const levelService = new LevelService();

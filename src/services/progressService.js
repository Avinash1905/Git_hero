/**
 * ProgressService
 * Manages player progression across all 250 levels, completion states, stars, and checkpoints.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class ProgressService {
  /**
   * Fetch authenticated player's full progress dictionary
   * @returns {Promise<Record<string, {status: string, completed: boolean, stars: number, bestMoves: number, bestTime: number}>>}
   */
  async getProgress() {
    try {
      const res = await apiClient.get(ENDPOINTS.PROGRESS.GET);
      if (res.success && res.progress) {
        return res.progress;
      }
    } catch (err) {
      console.warn('[ProgressService] Failed to fetch progress from API, using local fallback:', err.message);
    }

    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      try {
        const local = localStorage.getItem('gitquest_user_state');
        if (local) {
          const parsed = JSON.parse(local);
          return parsed.progress?.levels || {};
        }
      } catch {}
    }

    return {
      '01': { status: 'UNLOCKED', completed: false, stars: 0 }
    };
  }

  /**
   * Save level progress checkpoint
   * @param {string|number} levelId
   * @param {Object} stats
   */
  async saveProgress(levelId, stats) {
    return apiClient.post(ENDPOINTS.PROGRESS.SAVE, { levelId, ...stats });
  }

  /**
   * Fetch progress summary (total completed, total stars, total XP)
   */
  async getSummary() {
    return apiClient.get(ENDPOINTS.PROGRESS.SUMMARY);
  }
}

export const progressService = new ProgressService();

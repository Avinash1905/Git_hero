/**
 * LeaderboardService
 * Handles player rankings, global tier rankings, weekly standings, and pagination.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class LeaderboardService {
  /**
   * Fetch global leaderboard
   * @param {number} [limit=50]
   * @param {number} [offset=0]
   * @returns {Promise<{rankings: Array<Object>, totalCount: number}>}
   */
  async getGlobal(limit = 50, offset = 0) {
    try {
      const res = await apiClient.get(`${ENDPOINTS.LEADERBOARD.GLOBAL}?limit=${limit}&offset=${offset}`);
      if (res.success && Array.isArray(res.rankings)) {
        return {
          rankings: res.rankings,
          totalCount: res.totalCount || res.rankings.length
        };
      }
    } catch (err) {
      console.warn('[LeaderboardService] Error fetching global rankings:', err.message);
    }

    return { rankings: [], totalCount: 0 };
  }

  /**
   * Fetch weekly sprint standings
   * @returns {Promise<{rankings: Array<Object>}>}
   */
  async getWeekly() {
    try {
      const res = await apiClient.get(ENDPOINTS.LEADERBOARD.WEEKLY);
      if (res.success && Array.isArray(res.rankings)) {
        return { rankings: res.rankings };
      }
    } catch (err) {
      console.warn('[LeaderboardService] Error fetching weekly rankings:', err.message);
    }

    return { rankings: [] };
  }

  /**
   * Fetch authenticated player's rank card
   * @returns {Promise<Object>}
   */
  async getPlayerRank() {
    return apiClient.get(ENDPOINTS.LEADERBOARD.PLAYER_RANK);
  }
}

export const leaderboardService = new LeaderboardService();

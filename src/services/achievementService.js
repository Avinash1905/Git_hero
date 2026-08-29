/**
 * AchievementService
 * Manages achievement queries, progress evaluation, and reward claims.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class AchievementService {
  constructor() {
    this.cache = null;
  }

  /**
   * Fetch all global achievements catalog
   * @returns {Promise<Array<Object>>}
   */
  async getAchievements() {
    try {
      const res = await apiClient.get(ENDPOINTS.ACHIEVEMENTS.LIST);
      if (res.success && Array.isArray(res.achievements)) {
        this.cache = res.achievements;
        return res.achievements;
      }
    } catch (err) {
      console.warn('[AchievementService] Failed to load achievements from API, using fallback:', err.message);
    }

    return this.getFallbackAchievements();
  }

  /**
   * Fetch player's unlocked achievements and progress
   * @returns {Promise<Array<Object>>}
   */
  async getUserAchievements() {
    return apiClient.get(ENDPOINTS.ACHIEVEMENTS.USER_PROGRESS);
  }

  /**
   * Claim achievement rewards
   * @param {string} achievementId
   */
  async claimReward(achievementId) {
    return apiClient.post(ENDPOINTS.ACHIEVEMENTS.CLAIM(achievementId), {});
  }

  getFallbackAchievements() {
    return [
      { id: 'first_commit', code: 'FIRST_COMMIT', title: 'FIRST COMMIT', description: 'Complete your first level.', icon: 'emoji_events', xp_reward: 100, max_progress: 1, unlocked: false, progress: 0 },
      { id: 'push_master', code: 'PUSH_MASTER', title: 'PUSH MASTER', description: 'Complete a level using only push commands.', icon: 'upload', xp_reward: 250, max_progress: 1, unlocked: false, progress: 0 },
      { id: 'status_check', code: 'STATUS_CHECK', title: 'STATUS CHECK', description: 'Use git status 10 times across levels.', icon: 'find_in_page', xp_reward: 150, max_progress: 10, unlocked: false, progress: 0 },
      { id: 'pull_master', code: 'PULL_MASTER', title: 'PULL MASTER', description: 'Successfully execute 15 directional pulls.', icon: 'download', xp_reward: 300, max_progress: 15, unlocked: false, progress: 0 },
      { id: 'branch_weaver', code: 'BRANCH_WEAVER', title: 'BRANCH WEAVER', description: 'Complete 10 levels across World 2 and beyond.', icon: 'alt_route', xp_reward: 400, max_progress: 10, unlocked: false, progress: 0 },
      { id: 'speed_demon', code: 'SPEED_DEMON', title: 'SPEED DEMON', description: 'Complete any level in under 60 seconds.', icon: 'speed', xp_reward: 500, max_progress: 1, unlocked: false, progress: 0 },
      { id: 'grandmaster', code: 'GRANDMASTER', title: 'GIT GRANDMASTER', description: 'Reach 20,000 XP and master repositories.', icon: 'military_tech', xp_reward: 1000, max_progress: 20000, unlocked: false, progress: 0 }
    ];
  }
}

export const achievementService = new AchievementService();

/**
 * ChallengeService
 * Manages daily challenges, rules, rewards, and player completion submissions.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class ChallengeService {
  /**
   * Fetch today's daily challenge
   * @returns {Promise<Object>}
   */
  async getTodayChallenge() {
    try {
      const res = await apiClient.get(ENDPOINTS.CHALLENGES.TODAY);
      if (res.success && res.challenge) {
        return res.challenge;
      }
    } catch (err) {
      console.warn('[ChallengeService] Error fetching daily challenge, using local generator:', err.message);
    }

    return this.getFallbackChallenge();
  }

  /**
   * Submit completion of daily challenge
   * @param {Object} completionData
   */
  async completeChallenge(completionData) {
    return apiClient.post(ENDPOINTS.CHALLENGES.COMPLETE, completionData);
  }

  getFallbackChallenge() {
    const today = new Date().toISOString().split('T')[0];
    return {
      challengeDate: today,
      title: 'Memory Leak Substation',
      description: 'A severe memory leak has been detected in the core module. Navigate the fragmented memory grid to isolate and terminate the rogue processes.',
      difficulty: 'HARD',
      rewardXp: 1000,
      gridSize: '8x8',
      isCompleted: false,
      config: {
        gridSize: 8,
        player: { x: 1, y: 1 },
        box: { x: 3, y: 3 },
        goal: { x: 6, y: 6 },
        walls: [{ x: 2, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 5 }],
        hazards: [{ x: 3, y: 4 }, { x: 4, y: 3 }]
      }
    };
  }
}

export const challengeService = new ChallengeService();

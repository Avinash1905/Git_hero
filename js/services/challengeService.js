// ChallengeService: Real daily challenge queries and completions
import { apiClient } from './apiClient.js';

export const challengeService = {
  async getDailyChallenge() {
    const res = await apiClient.get('/api/challenges/daily');
    return res.challenge;
  },

  async completeDailyChallenge() {
    return apiClient.post('/api/challenges/daily/complete', {});
  }
};

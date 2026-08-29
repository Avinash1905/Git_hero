// LeaderboardService: Real player rankings query
import { apiClient } from './apiClient.js';

export const leaderboardService = {
  async getLeaderboard(tab = 'global') {
    const res = await apiClient.get(`/api/leaderboard?tab=${encodeURIComponent(tab)}`);
    return res.leaderboard || [];
  }
};

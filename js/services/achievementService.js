// AchievementService: Real player achievements tracker
import { apiClient } from './apiClient.js';

export const achievementService = {
  async getAchievements() {
    const res = await apiClient.get('/api/achievements');
    return {
      achievements: res.achievements || [],
      unlockedCount: res.unlockedCount || 0,
      completionPct: res.completionPct || 0,
      total: res.total || 0
    };
  }
};

// PlayerService: Live player profile and statistics
import { apiClient } from './apiClient.js';

export const playerService = {
  async getProfile() {
    const res = await apiClient.get('/api/player/profile');
    return res.player;
  },

  async updateProfile(updates) {
    const res = await apiClient.put('/api/player/profile', updates);
    return res.profile;
  },

  async getStats() {
    return apiClient.get('/api/player/stats');
  }
};

// LevelService: Fetches 250 handcrafted levels with progressive unlock state
import { apiClient } from './apiClient.js';

export const levelService = {
  async getLevels() {
    const res = await apiClient.get('/api/levels');
    return res.levels || [];
  },

  async getLevelById(levelId) {
    const res = await apiClient.get(`/api/levels/${levelId}`);
    return res.level;
  },

  async getLevelsByWorld(worldNum) {
    const res = await apiClient.get(`/api/levels/world/${worldNum}`);
    return res.levels || [];
  }
};

// ProgressService: Retrieves progressive unlocking map from backend
import { apiClient } from './apiClient.js';

export const progressService = {
  async getProgress() {
    const res = await apiClient.get('/api/progress');
    return res.progress;
  }
};

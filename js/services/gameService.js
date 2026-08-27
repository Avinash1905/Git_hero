// GameService: Starts game sessions and submits server-authoritative completions
import { apiClient } from './apiClient.js';

export const gameService = {
  async startSession(levelId) {
    return apiClient.post('/api/game/session/start', { levelId });
  },

  async completeSession(payload) {
    return apiClient.post('/api/game/session/complete', payload);
  },

  async abandonSession(sessionId) {
    return apiClient.post('/api/game/session/abandon', { sessionId });
  }
};

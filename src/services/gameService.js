/**
 * GameService
 * Manages game sessions, telemetry ingestion, move verification, anti-cheat validation,
 * and completion processing with the backend server.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class GameService {
  /**
   * Start a new gameplay session
   * @param {string|number} levelId
   * @returns {Promise<{success: boolean, sessionId?: string}>}
   */
  async startSession(levelId) {
    return apiClient.post(ENDPOINTS.GAME.START_SESSION, { levelId });
  }

  /**
   * Submit live telemetry snapshot
   * @param {string} sessionId
   * @param {Object} telemetryData
   */
  async sendTelemetry(sessionId, telemetryData) {
    return apiClient.post(ENDPOINTS.GAME.TELEMETRY, { sessionId, ...telemetryData });
  }

  /**
   * Complete session and verify score/XP
   * @param {Object} sessionResult
   * @returns {Promise<Object>}
   */
  async completeSession(sessionResult) {
    return apiClient.post(ENDPOINTS.GAME.COMPLETE_SESSION, sessionResult);
  }

  /**
   * Get replay for a completed session
   * @param {string} sessionId
   */
  async getReplay(sessionId) {
    return apiClient.get(ENDPOINTS.GAME.REPLAY(sessionId));
  }
}

export const gameService = new GameService();

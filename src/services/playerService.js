/**
 * PlayerService
 * Manages player profile, cosmetics, stats, and persistent user settings.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';
import { authService } from './authService.js';

export class PlayerService {
  /**
   * Fetch authenticated player's full profile
   * @returns {Promise<Object>}
   */
  async getProfile() {
    const res = await apiClient.get(ENDPOINTS.PLAYER.PROFILE);
    if (res.success && res.profile) {
      authService.updateProfile(res.profile);
    }
    return res;
  }

  /**
   * Update avatar, title, or bio
   * @param {Object} profileUpdates
   * @returns {Promise<Object>}
   */
  async updateProfile(profileUpdates) {
    const res = await apiClient.put(ENDPOINTS.PLAYER.UPDATE_PROFILE, profileUpdates);
    if (res.success && res.profile) {
      authService.updateProfile(res.profile);
    }
    return res;
  }

  /**
   * Update audio, theme, and language preferences
   * @param {Object} settings
   * @returns {Promise<Object>}
   */
  async updateSettings(settings) {
    const res = await apiClient.put(ENDPOINTS.PLAYER.UPDATE_SETTINGS, { settings });
    if (res.success && res.settings) {
      authService.updateProfile({ settings: res.settings });
    }
    return res;
  }

  /**
   * Fetch detailed player game statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    return apiClient.get(ENDPOINTS.PLAYER.STATS);
  }
}

export const playerService = new PlayerService();

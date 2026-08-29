/**
 * PlayerStore
 * Manages player profile data, progression XP, streak counts, lives, and user settings.
 */

import { Store } from './Store.js';
import { playerService } from '../services/playerService.js';
import { authService } from '../services/authService.js';

export class PlayerStore extends Store {
  constructor() {
    super({
      profile: authService.getProfile() || {
        username: 'Guest',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8',
        title: 'Novice Contributor',
        level: 1,
        xp: 0,
        lives: 3,
        streak_days: 1,
        settings: {
          soundEffects: true,
          backgroundMusic: true,
          volume: 70,
          language: 'English (US)',
          theme: 'Terminal (Dark)'
        }
      },
      stats: null,
      isLoading: false
    });

    authService.subscribe((isAuth, user, profile) => {
      if (profile) {
        this.setState({ profile }, 'PLAYER_PROFILE_UPDATED');
      }
    });
  }

  async loadPlayerProfile() {
    this.setState({ isLoading: true }, 'PLAYER_FETCH_START');
    try {
      const res = await playerService.getProfile();
      if (res.success && res.profile) {
        this.setState({ profile: res.profile, isLoading: false }, 'PLAYER_FETCH_SUCCESS');
      }
    } catch (err) {
      this.setState({ isLoading: false }, 'PLAYER_FETCH_ERROR');
    }
  }

  async updateSettings(settings) {
    this.setState((prev) => ({
      profile: {
        ...prev.profile,
        settings: { ...prev.profile.settings, ...settings }
      }
    }), 'PLAYER_SETTINGS_LOCAL_UPDATE');

    try {
      await playerService.updateSettings(settings);
    } catch (err) {
      console.warn('[PlayerStore] Failed to save settings to server:', err);
    }
  }

  addXp(amount) {
    this.setState((prev) => {
      const newXp = (prev.profile.xp || 0) + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return {
        profile: {
          ...prev.profile,
          xp: newXp,
          level: newLevel
        }
      };
    }, 'PLAYER_ADD_XP');
  }
}

export const playerStore = new PlayerStore();

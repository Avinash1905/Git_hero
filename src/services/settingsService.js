// GitHero Settings & Configuration Service
// Manages client preferences, terminal colors, keybindings, and accessibility settings.

export class SettingsService {
  static STORAGE_KEY = 'githero_user_settings';

  static DEFAULT_SETTINGS = {
    volume: 80,
    soundEffects: true,
    musicEnabled: false,
    terminalTheme: 'CYBERPUNK',
    scanlines: true,
    reducedMotion: false,
    fontSize: 14,
    showMinimap: true,
    keybindings: {
      moveUp: ['ArrowUp', 'w', 'W'],
      moveDown: ['ArrowDown', 's', 'S'],
      moveLeft: ['ArrowLeft', 'a', 'A'],
      moveRight: ['ArrowRight', 'd', 'D'],
      undo: ['z', 'Z'],
      reset: ['r', 'R']
    }
  };

  /**
   * Load user settings from localStorage
   * @returns {Object}
   */
  static getSettings() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
          return { ...this.DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
      }
    } catch (e) {
      console.warn('[SettingsService] Failed to read settings from storage:', e);
    }
    return { ...this.DEFAULT_SETTINGS };
  }

  /**
   * Save partial or complete settings
   * @param {Object} partialSettings 
   * @returns {Object} updated settings
   */
  static saveSettings(partialSettings = {}) {
    const current = this.getSettings();
    const updated = { ...current, ...partialSettings };
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('[SettingsService] Failed to write settings to storage:', e);
    }
    return updated;
  }

  /**
   * Reset all settings to factory default
   * @returns {Object}
   */
  static resetDefaults() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (e) {}
    return { ...this.DEFAULT_SETTINGS };
  }
}

// Global Singleton
export const settingsService = SettingsService;

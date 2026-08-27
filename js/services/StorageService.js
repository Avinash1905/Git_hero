// StorageService: Client settings & offline audio/theme preferences ONLY (Zero mock data)

const SETTINGS_KEY = 'gitquest_client_settings_v3';

const DEFAULT_SETTINGS = {
  language: 'English (US)',
  theme: 'Terminal (Dark)',
  soundEffects: true,
  backgroundMusic: true,
  volume: 70,
  crtFilter: false,
  screenShake: true,
  highContrast: false,
  largeTerminalFont: false,
  vimKeybindings: false
};

export class StorageService {
  static loadSettings() {
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        const data = localStorage.getItem(SETTINGS_KEY);
        if (data) {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
      }
    } catch (e) {
      console.warn('StorageService loadSettings failed', e);
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings) {
    try {
      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('StorageService saveSettings failed', e);
    }
  }

  static updateSettings(partial) {
    const current = this.loadSettings();
    const updated = { ...current, ...partial };
    this.saveSettings(updated);
    return updated;
  }

  static getCommandUsage() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const data = localStorage.getItem('gitquest_command_usage');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static updateCommandUsage(cmd) {
    if (!cmd || typeof localStorage === 'undefined') return;
    try {
      const usage = this.getCommandUsage();
      usage[cmd] = (usage[cmd] || 0) + 1;
      localStorage.setItem('gitquest_command_usage', JSON.stringify(usage));
    } catch {}
  }

  // Compatibility helper
  static load() {
    return {
      settings: this.loadSettings()
    };
  }
}

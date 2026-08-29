/**
 * GitQuest Feature: Settings Controller & Audio / Keyboard Configuration Engine
 */

import { StorageService } from '../../../js/services/StorageService.js';
import { soundFX } from '../../../js/audio.js';
import { notificationStore } from '../../state/DomainStores.js';

export class SettingsController {
  constructor() {
    this.settings = StorageService.loadSettings();
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    StorageService.saveSettings(this.settings);

    if (key === 'soundEffects') {
      soundFX.setMuted(!value);
    }
    if (key === 'volume') {
      soundFX.setVolume(value / 100);
    }
    if (key === 'crtFilter') {
      const crtEl = document.getElementById('crt-overlay');
      if (crtEl) {
        crtEl.style.display = value ? 'block' : 'none';
      }
    }

    notificationStore.addNotification('Settings Updated', `Preferences saved for ${key}.`, 'info', 2000);
  }

  resetDefaults() {
    const defaults = {
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
    this.settings = defaults;
    StorageService.saveSettings(defaults);
    soundFX.setMuted(false);
    soundFX.setVolume(0.7);
    notificationStore.addNotification('Settings Reset', 'Restored system defaults.', 'info', 3000);
    return defaults;
  }
}

/**
 * SettingsStore
 * Persistent reactive store managing player preferences:
 * audio volumes, terminal themes, CRT scanline toggles, and keybindings.
 */

import { Store } from './Store.js';

export class SettingsStore extends Store {
  constructor() {
    const saved = SettingsStore.loadFromStorage();
    super(saved || {
      sfxVolume: 0.8,
      musicVolume: 0.5,
      soundEnabled: true,
      terminalTheme: 'matrix-cyan',
      crtFilter: true,
      fontSize: 13,
      screenShake: true,
      autoCommitStaging: false,
      keybindings: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        terminalFocus: 'Enter',
        undo: 'KeyZ'
      }
    });

    this.subscribe((state) => {
      SettingsStore.persistToStorage(state);
    });
  }

  static loadFromStorage() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('githero_settings');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  static persistToStorage(state) {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem('githero_settings', JSON.stringify(state));
    } catch (e) {
      console.error('[SettingsStore] Failed to persist settings:', e);
    }
  }

  setTerminalTheme(themeName) {
    this.setState({ terminalTheme: themeName });
  }

  setSfxVolume(volume) {
    this.setState({ sfxVolume: Math.max(0, Math.min(1, volume)) });
  }

  setMusicVolume(volume) {
    this.setState({ musicVolume: Math.max(0, Math.min(1, volume)) });
  }

  toggleSound() {
    this.setState({ soundEnabled: !this.state.soundEnabled });
  }

  toggleCrt() {
    this.setState({ crtFilter: !this.state.crtFilter });
  }

  toggleScreenShake() {
    this.setState({ screenShake: !this.state.screenShake });
  }
}

export const settingsStore = new SettingsStore();

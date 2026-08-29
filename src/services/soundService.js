/**
 * SoundService
 * Manages audio synthesizer cues, SFX volume, and mute preferences.
 */

import { soundFX } from '../../js/audio.js';

export class SoundService {
  constructor() {
    this.isMuted = false;
    this.volume = 0.7;
    this.init();
  }

  init() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      try {
        const stored = localStorage.getItem('gitquest_user_state');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.settings) {
            this.isMuted = !parsed.settings.soundEffects;
            this.volume = (parsed.settings.volume || 70) / 100;
          }
        }
      } catch {}
    }
    soundFX.setMuted(this.isMuted);
    soundFX.setVolume(this.volume);
  }

  playMove() {
    if (!this.isMuted) soundFX.playMove();
  }

  playPush() {
    if (!this.isMuted) soundFX.playPush();
  }

  playPull() {
    if (!this.isMuted) soundFX.playPull();
  }

  playVictory() {
    if (!this.isMuted) {
      if (typeof soundFX.playVictory === 'function') {
        soundFX.playVictory();
      } else if (typeof soundFX.playSuccess === 'function') {
        soundFX.playSuccess();
      }
    }
  }

  playError() {
    if (!this.isMuted && typeof soundFX.playError === 'function') {
      soundFX.playError();
    }
  }

  playKey() {
    if (!this.isMuted) soundFX.playKey();
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    soundFX.setMuted(this.isMuted);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    soundFX.setVolume(this.volume);
  }
}

export const soundService = new SoundService();

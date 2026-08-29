/**
 * AudioStore
 * State store managing audio synth channels, master volume, mute states, and procedural audio effects.
 */

import { Store } from './Store.js';

export class AudioStore extends Store {
  constructor() {
    super({
      masterVolume: 0.8,
      sfxVolume: 0.8,
      bgmVolume: 0.4,
      isMuted: false,
      currentTrack: 'synthwave-ambient'
    });
  }

  setMasterVolume(val) {
    this.setState({ masterVolume: Math.max(0, Math.min(1, val)) });
  }

  setSfxVolume(val) {
    this.setState({ sfxVolume: Math.max(0, Math.min(1, val)) });
  }

  setBgmVolume(val) {
    this.setState({ bgmVolume: Math.max(0, Math.min(1, val)) });
  }

  toggleMute() {
    this.setState({ isMuted: !this.state.isMuted });
  }
}

export const audioStore = new AudioStore();

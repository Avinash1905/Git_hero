/**
 * GitQuest Utility: Web Audio API Realtime Synthesizer for SFX & Cyberpunk Tones
 */

export class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.7;
  }

  _initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, Number(vol) || 0.7));
  }

  playTone(frequency, type = 'sine', durationSec = 0.1, gainVal = 0.2) {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      const effectiveGain = gainVal * this.masterVolume;
      gain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {}
  }

  playKey() {
    this.playTone(800 + Math.random() * 200, 'sine', 0.04, 0.1);
  }

  playPush() {
    this.playTone(180, 'square', 0.12, 0.2);
  }

  playPull() {
    this.playTone(320, 'triangle', 0.15, 0.25);
  }

  playSuccess() {
    this.playTone(523.25, 'sine', 0.08, 0.2);
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.25), 60);
  }

  playError() {
    this.playTone(150, 'sawtooth', 0.25, 0.3);
  }

  playLevelComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.2, 0.3);
      }, idx * 90);
    });
  }
}

export const soundSynthesizer = new SoundSynthesizer();

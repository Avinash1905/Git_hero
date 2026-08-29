/**
 * GitQuest Frontend - Audio Synthesizer Engine
 * Web Audio API procedural sound generator for player footsteps,
 * push impacts, magnetic pulls, commit fanfares, and error buzzers.
 */

export class AudioSynthesizerEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.masterVolume = 0.25;
  }

  _initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  playTone(frequency, durationMs, type = 'sine', gainDecay = true) {
    if (this.isMuted) return;
    this._initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      const startTime = this.audioCtx.currentTime;
      const endTime = startTime + durationMs / 1000;

      gain.gain.setValueAtTime(this.masterVolume, startTime);
      if (gainDecay) {
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);
      }

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(endTime);
    } catch (e) {
      // Audio context policy or headless environment
    }
  }

  playFootstep() {
    this.playTone(180, 50, 'triangle');
  }

  playPush() {
    this.playTone(120, 120, 'square');
  }

  playPull() {
    this.playTone(280, 150, 'sine');
  }

  playCommitSuccess() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880]; // A Major arpeggio
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 200, 'triangle');
      }, i * 80);
    });
  }

  playErrorBuzzer() {
    this.playTone(90, 250, 'sawtooth');
  }

  playPortalWarp() {
    this.playTone(600, 300, 'sine');
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }
}

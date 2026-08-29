/**
 * useAudioSynth
 * Client hook for Web Audio API procedural synthesizers (UI clicks, laser hums, commit victory chimes, error beeps).
 */

export class ProceduralAudioSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensureContext() {
    if (this.ctx) return this.ctx;
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1, gain = 0.1) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be suspended or blocked by user gesture
    }
  }

  playVictoryChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 'triangle', 0.25, 0.15), i * 90);
    });
  }

  playErrorBuzzer() {
    this.playBeep(150, 'sawtooth', 0.2, 0.2);
  }

  playCommitSound() {
    this.playBeep(880, 'sine', 0.15, 0.12);
  }
}

export const proceduralAudioSynth = new ProceduralAudioSynth();

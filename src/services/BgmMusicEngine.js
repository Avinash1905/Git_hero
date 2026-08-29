/**
 * BgmMusicEngine
 * Web Audio API synthesizer for ambient procedural cyberpunk background chords.
 */

export class BgmMusicEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.3;
    this.chordInterval = null;
  }

  ensureContext() {
    if (this.ctx) return this.ctx;
    if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    return this.ctx;
  }

  playChord(notes = [220, 277.18, 329.63]) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    notes.forEach(freq => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.05, ctx.currentTime + 1.5);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 4.0);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 4.0);
      } catch {}
    });
  }

  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const chords = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [196, 246.94, 293.66], // G
      [164.81, 196, 246.94]  // Em
    ];
    let currentIdx = 0;

    this.playChord(chords[currentIdx]);
    this.chordInterval = setInterval(() => {
      if (!this.isPlaying) return;
      currentIdx = (currentIdx + 1) % chords.length;
      this.playChord(chords[currentIdx]);
    }, 4500);
  }

  stop() {
    this.isPlaying = false;
    if (this.chordInterval) {
      clearInterval(this.chordInterval);
      this.chordInterval = null;
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
}

export const bgmMusicEngine = new BgmMusicEngine();

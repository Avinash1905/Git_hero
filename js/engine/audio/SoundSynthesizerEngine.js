/**
 * GitQuest Engine - Procedural Web Audio Synthetic Sound Engine
 * Generates custom 8-bit / 16-bit retro arcade synth sounds procedurally with zero external asset dependencies.
 */

export class SoundSynthesizerEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
  }

  _initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
  }

  playMove() {
    this._playTone(220, 330, 0.06, 'triangle');
  }

  playPush() {
    this._playTone(110, 80, 0.12, 'sawtooth');
  }

  playPull() {
    this._playTone(180, 260, 0.1, 'sine');
  }

  playSwitch() {
    this._playTone(520, 650, 0.08, 'square');
  }

  playLaser() {
    this._playTone(880, 440, 0.15, 'sawtooth');
  }

  playPortal() {
    this._playTone(300, 900, 0.25, 'sine');
  }

  playError() {
    this._playTone(130, 90, 0.2, 'sawtooth');
  }

  playCommitVictory() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C chord
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this._playTone(freq, freq * 1.05, 0.25, 'triangle');
      }, i * 70);
    });
  }

  _playTone(startFreq, endFreq, duration, type = 'sine') {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }
}

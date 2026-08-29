/**
 * GitQuest Game Engine - Procedural Sound Synthesizer
 * Sound FX generation for engine events: footsteps, push impact thuds,
 * magnetic pulls, laser crackles, hazard triggers, portal warps, and victory fanfares.
 */

export class ProceduralSoundSynthesizer {
  constructor(audioContext = null) {
    this.ctx = audioContext;
    this.volume = 0.3;
    this.isMuted = false;
  }

  setAudioContext(ctx) {
    this.ctx = ctx;
  }

  playBeep(freq = 440, durationSec = 0.1, type = 'sine') {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch (e) {}
  }

  playMoveSound() {
    this.playBeep(320, 0.04, 'sine');
  }

  playPushSound() {
    this.playBeep(140, 0.12, 'square');
  }

  playPullSound() {
    this.playBeep(260, 0.14, 'triangle');
  }

  playCommitSound() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playBeep(freq, 0.25, 'sine'), idx * 70);
    });
  }

  playHazardSound() {
    this.playBeep(90, 0.3, 'sawtooth');
  }

  playPortalSound() {
    this.playBeep(650, 0.2, 'sine');
  }
}

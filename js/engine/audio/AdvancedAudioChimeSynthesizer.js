/**
 * GitQuest Game Engine - Advanced Audio Chime Synthesizer
 * Generates harmonic overtone sequences, arpeggiated victory fanfares,
 * portal transition swooshes, and magnetic resonance pulses.
 */

export class AdvancedAudioChimeSynthesizer {
  constructor(audioContext = null) {
    this.ctx = audioContext;
    this.masterGain = 0.2;
  }

  playArpeggio(frequencies = [440, 554.37, 659.25, 880], stepDelayMs = 60, type = 'sine') {
    if (!this.ctx) return;

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(this.masterGain, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.3);
        } catch (e) {}
      }, i * stepDelayMs);
    });
  }

  playVictoryChime() {
    this.playArpeggio([523.25, 659.25, 783.99, 1046.50, 1318.51], 80, 'triangle');
  }

  playLevelUnlockChime() {
    this.playArpeggio([392.00, 493.88, 587.33, 783.99], 70, 'sine');
  }

  playMagneticHum() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }
}

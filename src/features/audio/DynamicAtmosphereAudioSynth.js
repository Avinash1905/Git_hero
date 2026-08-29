/**
 * GitQuest Frontend - Dynamic Atmosphere Audio Synthesizer
 * Ambient chord generators, world-specific musical modes (Cyberpunk Dorian,
 * Void Aeolian, Monorepo Lydian), and adaptive move pacing tempo.
 */

export const WorldThemes = {
  CYBER_CITADEL: { rootFreq: 110, scale: [0, 3, 5, 7, 10], waveform: 'sawtooth' },
  DISTRIBUTED_VOID: { rootFreq: 82.4, scale: [0, 2, 3, 5, 7, 8, 10], waveform: 'sine' },
  REFLOG_ABYSS: { rootFreq: 65.4, scale: [0, 1, 4, 5, 7, 8, 11], waveform: 'triangle' },
  GITOPS_NEBULA: { rootFreq: 130.8, scale: [0, 4, 7, 9, 11], waveform: 'sine' },
  MONOREPO_FORTRESS: { rootFreq: 98.0, scale: [0, 2, 4, 6, 7, 9, 11], waveform: 'square' }
};

export class DynamicAtmosphereAudioSynth {
  constructor(audioCtx = null) {
    this.audioCtx = audioCtx;
    this.currentTheme = WorldThemes.CYBER_CITADEL;
    this.isPlaying = false;
    this.droneGainNode = null;
  }

  setTheme(themeName) {
    if (WorldThemes[themeName]) {
      this.currentTheme = WorldThemes[themeName];
    }
  }

  playAtmosphereChord() {
    if (!this.audioCtx) return;

    try {
      const root = this.currentTheme.rootFreq;
      const notes = [root, root * 1.5, root * 1.78]; // Root, 5th, 7th

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = this.currentTheme.waveform;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 3.0);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 3.0);
      });
    } catch (e) {}
  }
}

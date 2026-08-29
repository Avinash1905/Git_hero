/**
 * SoundEffectLibrary
 * Procedural synthesizer configurations and frequency sequences for GitHero UI and gameplay events.
 */

export const SOUND_DEFINITIONS = {
  UI_CLICK: { freq: 600, type: 'sine', duration: 0.05, gain: 0.08 },
  UI_HOVER: { freq: 400, type: 'triangle', duration: 0.03, gain: 0.04 },
  COMMAND_EXECUTE: { freq: 880, type: 'sine', duration: 0.1, gain: 0.1 },
  COMMAND_ERROR: { freq: 140, type: 'sawtooth', duration: 0.25, gain: 0.2 },
  BOX_PUSH: { freq: 220, type: 'square', duration: 0.08, gain: 0.12 },
  BOX_PULL: { freq: 280, type: 'square', duration: 0.08, gain: 0.12 },
  BRANCH_SWITCH: { freq: 520, type: 'sine', duration: 0.15, gain: 0.1 },
  MERGE_SUCCESS: { freq: 740, type: 'triangle', duration: 0.2, gain: 0.15 },
  LASER_TELEPORT: { freq: 1100, type: 'sine', duration: 0.18, gain: 0.1 },
  STASH_POP: { freq: 480, type: 'triangle', duration: 0.12, gain: 0.1 },
  VICTORY_FANFARE: [
    { freq: 523.25, delay: 0 },
    { freq: 659.25, delay: 80 },
    { freq: 783.99, delay: 160 },
    { freq: 1046.50, delay: 240 }
  ]
};

export class SoundEffectLibrary {
  getDefinition(name) {
    return SOUND_DEFINITIONS[name] || null;
  }
}

export const soundEffectLibrary = new SoundEffectLibrary();

/**
 * GitQuest Engine - Sensory Perception & Acoustic Diffraction Grid
 * Models sound wave propagation, footstep acoustics, and box impact vibrations alerting CI bot patrols.
 */

import { Vector2D } from '../core/Types.js';

export class AcousticWave {
  constructor(origin, volume = 5, soundType = 'footstep') {
    this.origin = Vector2D.from(origin);
    this.volume = volume;
    this.soundType = soundType;
    this.timestamp = Date.now();
  }
}

export class SensoryPerceptionGrid {
  constructor(tileMap) {
    this.tileMap = tileMap;
    this.activeWaves = [];
  }

  emitSound(x, y, volume = 5, soundType = 'push') {
    const wave = new AcousticWave({ x, y }, volume, soundType);
    this.activeWaves.push(wave);
    return wave;
  }

  getAudibleVolume(listenerCoord) {
    let maxAudible = 0;
    const pos = Vector2D.from(listenerCoord);

    for (const wave of this.activeWaves) {
      const dist = pos.manhattanDistance(wave.origin);
      const intensity = Math.max(0, wave.volume - dist);
      if (intensity > maxAudible) {
        maxAudible = intensity;
      }
    }

    return maxAudible;
  }

  clear() {
    this.activeWaves = [];
  }
}

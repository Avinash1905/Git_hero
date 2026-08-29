/**
 * GitQuest Engine - Expanded Level Registry (Worlds 21 - 25, Levels 251 - 300)
 * Scalable level management for advanced endgame worlds, query filters, and world metadata.
 */

import { WORLD_21_LEVELS } from './data/World21CyberCitadel.js';
import { WORLD_22_LEVELS } from './data/World22DistributedVoid.js';
import { WORLD_23_LEVELS } from './data/World23ReflogAbyss.js';
import { WORLD_24_LEVELS } from './data/World24GitOpsNebula.js';
import { WORLD_25_LEVELS } from './data/World25MonorepoFortress.js';
import { LevelDefinition, LevelValidator } from './LevelDefinition.js';
import { GlobalLevelRegistry } from './LevelRegistry.js';

export const EXPANDED_LEVELS = Object.freeze({
  ...WORLD_21_LEVELS,
  ...WORLD_22_LEVELS,
  ...WORLD_23_LEVELS,
  ...WORLD_24_LEVELS,
  ...WORLD_25_LEVELS
});

export const EXPANDED_WORLD_METADATA = Object.freeze({
  21: {
    id: 21,
    name: 'Cyber Citadel',
    theme: 'cyber_optics',
    levelRange: [251, 260],
    description: 'High-tech optical prisms, magnetic dipole grids, and hydraulic conduits.',
    unlockRequirement: { minStars: 500, previousWorldCleared: 20 }
  },
  22: {
    id: 22,
    name: 'Distributed Void',
    theme: 'quantum_distributed',
    levelRange: [261, 270],
    description: 'Asynchronous remote replicas, Byzantine quorum, and quantum wormholes.',
    unlockRequirement: { minStars: 550, previousWorldCleared: 21 }
  },
  23: {
    id: 23,
    name: 'Reflog Abyss',
    theme: 'historical_abyss',
    levelRange: [271, 280],
    description: 'Dangling blobs, lost commit rescue, and chronosphere state reversal.',
    unlockRequirement: { minStars: 600, previousWorldCleared: 22 }
  },
  24: {
    id: 24,
    name: 'GitOps Nebula',
    theme: 'ci_cd_nebula',
    levelRange: [281, 290],
    description: 'Declarative GitOps reconciliation, automated canary rollouts, and mesh proxies.',
    unlockRequirement: { minStars: 650, previousWorldCleared: 23 }
  },
  25: {
    id: 25,
    name: 'Monorepo Fortress',
    theme: 'enterprise_monorepo',
    levelRange: [291, 300],
    description: 'The Ultimate Grandmaster Endgame: 50GB monorepo scale, submodules, and sparse cones.',
    unlockRequirement: { minStars: 700, previousWorldCleared: 24 }
  }
});

export class ExpandedLevelRegistry {
  constructor() {
    this.levels = new Map();
    this.initExpandedLevels();
  }

  initExpandedLevels() {
    for (const [id, rawDef] of Object.entries(EXPANDED_LEVELS)) {
      const def = new LevelDefinition(rawDef);
      this.levels.set(id, def);
      // Also register to the global registry as custom level so engine can load seamlessly
      try {
        GlobalLevelRegistry.registerCustomLevel(rawDef);
      } catch (err) {
        // already registered or schema handled
      }
    }
  }

  get(levelId) {
    const norm = String(levelId);
    return this.levels.get(norm) || null;
  }

  getAll() {
    return Array.from(this.levels.values());
  }

  getByWorld(worldNumber) {
    return this.getAll().filter(l => l.world === Number(worldNumber));
  }

  getByDifficulty(difficulty) {
    return this.getAll().filter(l => l.difficulty === difficulty);
  }

  getWorldMetadata(worldNumber) {
    return EXPANDED_WORLD_METADATA[Number(worldNumber)] || null;
  }

  count() {
    return this.levels.size;
  }
}

export const GlobalExpandedLevelRegistry = new ExpandedLevelRegistry();

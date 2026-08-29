/**
 * GitQuest Engine - Level Registry & Loader
 * Central repository uniting all 250 levels across Worlds 1-20 with dynamic query and custom level support.
 */

import { WORLD_1_LEVELS } from './data/World1Foundations.js';
import { WORLD_2_LEVELS } from './data/World2BranchValley.js';
import { WORLD_3_LEVELS } from './data/World3MergePeaks.js';
import { WORLD_4_LEVELS } from './data/World4RebaseWasteland.js';
import { WORLD_5_LEVELS } from './data/World5KernelCore.js';
import { WORLD_6_LEVELS } from './data/World6GrandmasterTrials.js';
import { WORLD_7_LEVELS } from './data/World7CommunityExpansions.js';
import { WORLD_8_LEVELS } from './data/World8GrandmasterInfinity.js';
import { WORLD_9_LEVELS } from './data/World9SecretOmniverse.js';
import { WORLD_10_LEVELS } from './data/World10Ascension.js';
import { WORLD_11_LEVELS } from './data/World11MultiverseMatrix.js';
import { WORLD_12_LEVELS } from './data/World12FinalGodheadInfinity.js';
import { WORLD_13_LEVELS } from './data/World13CataclysmCore.js';
import { WORLD_14_LEVELS } from './data/World14EternalGenesis.js';
import { WORLD_15_LEVELS } from './data/World15InfinityNexus.js';
import { WORLD_16_LEVELS } from './data/World16SupremeDeityPantheon.js';
import { WORLD_17_LEVELS } from './data/World17InfiniteChambers.js';
import { WORLD_18_LEVELS } from './data/World18TheFinalOmniversePantheon.js';
import { WORLD_19_LEVELS } from './data/World19OmnipotentAscendancy.js';
import { WORLD_20_LEVELS } from './data/World20TheEternalGodheadOmniverse.js';
import { LevelDefinition, LevelValidator } from './LevelDefinition.js';

export const ALL_LEVELS = Object.freeze({
  ...WORLD_1_LEVELS,
  ...WORLD_2_LEVELS,
  ...WORLD_3_LEVELS,
  ...WORLD_4_LEVELS,
  ...WORLD_5_LEVELS,
  ...WORLD_6_LEVELS,
  ...WORLD_7_LEVELS,
  ...WORLD_8_LEVELS,
  ...WORLD_9_LEVELS,
  ...WORLD_10_LEVELS,
  ...WORLD_11_LEVELS,
  ...WORLD_12_LEVELS,
  ...WORLD_13_LEVELS,
  ...WORLD_14_LEVELS,
  ...WORLD_15_LEVELS,
  ...WORLD_16_LEVELS,
  ...WORLD_17_LEVELS,
  ...WORLD_18_LEVELS,
  ...WORLD_19_LEVELS,
  ...WORLD_20_LEVELS
});

export class LevelRegistry {
  constructor() {
    this.levels = new Map(); // id -> LevelDefinition
    this.customLevels = new Map();
    this.initDefaultLevels();
  }

  initDefaultLevels() {
    for (const [id, rawDef] of Object.entries(ALL_LEVELS)) {
      const def = new LevelDefinition(rawDef);
      this.levels.set(id, def);
    }
  }

  get(levelId) {
    const norm = String(levelId || '07').padStart(2, '0');
    return this.customLevels.get(norm) || this.levels.get(norm) || this.levels.get('07') || null;
  }

  has(levelId) {
    const norm = String(levelId).padStart(2, '0');
    return this.levels.has(norm) || this.customLevels.has(norm);
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

  registerCustomLevel(customDef) {
    const def = new LevelDefinition(customDef);
    const validation = LevelValidator.validate(def);
    if (!validation.isValid) {
      throw new Error(`Invalid custom level: ${validation.errors.join(', ')}`);
    }
    this.customLevels.set(def.id, def);
    return def;
  }

  count() {
    return this.levels.size + this.customLevels.size;
  }
}

export class LevelLoader {
  constructor(registry = new LevelRegistry()) {
    this.registry = registry;
  }

  loadLevel(levelId, customData = null) {
    if (customData) {
      return this.registry.registerCustomLevel(customData);
    }
    const level = this.registry.get(levelId);
    if (!level) {
      throw new Error(`Level "${levelId}" not found in registry.`);
    }
    return level;
  }
}

export const GlobalLevelRegistry = new LevelRegistry();
export const GlobalLevelLoader = new LevelLoader(GlobalLevelRegistry);

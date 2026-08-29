/**
 * GitQuest Engine - CompatibilityAdapter
 * Seamless bridge connecting legacy frontend calls to the modern GitQuest engine.
 */

import { GitQuestEngine } from './EngineFacade.js';
import { GlobalLevelRegistry } from '../levels/LevelRegistry.js';

export class CompatibilityAdapter {
  static createEngineInstance(levelId = '07', onStateChange = null) {
    const engine = new GitQuestEngine();
    if (onStateChange) {
      engine.onStateChange(onStateChange);
    }
    engine.loadLevel(levelId);
    return engine;
  }

  static getLevelsMap() {
    const map = {};
    for (const lvl of GlobalLevelRegistry.getAll()) {
      map[lvl.id] = lvl.toJSON ? lvl.toJSON() : lvl;
    }
    return map;
  }
}

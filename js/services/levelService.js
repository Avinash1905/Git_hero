/**
 * GitHero Level Discovery & Ordering Service
 * Manages access to all 30+ handcrafted levels across the 6 worlds.
 */

import { LEVELS, WORLDS } from '../engine/Levels.js';
import { appStore } from '../state/appStore.js';

export class LevelService {
  getAllLevels() {
    return Object.values(LEVELS).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  }

  getLevelById(id) {
    const formattedId = String(id).padStart(2, '0');
    return LEVELS[formattedId] || LEVELS[id] || null;
  }

  getAllWorlds() {
    return WORLDS;
  }

  getWorldById(worldId) {
    return WORLDS.find(w => w.id === parseInt(worldId, 10)) || null;
  }

  getLevelsByWorld(worldId) {
    const wId = parseInt(worldId, 10);
    return this.getAllLevels().filter(lvl => lvl.world === wId);
  }

  isLevelUnlocked(levelId) {
    const numId = parseInt(levelId, 10);
    if (numId === 1) return true; // Level 01 is always unlocked

    const progress = appStore.getState().progress.levels || {};
    const prevId = String(numId - 1).padStart(2, '0');
    return !!progress[prevId]?.completed;
  }

  isWorldUnlocked(worldId) {
    const wId = parseInt(worldId, 10);
    if (wId === 1) return true;

    // World unlocked if at least 1 level in that world is unlocked or previous world completed
    const prevWorldLevels = this.getLevelsByWorld(wId - 1);
    if (!prevWorldLevels.length) return true;

    const progress = appStore.getState().progress.levels || {};
    return prevWorldLevels.every(lvl => progress[lvl.id]?.completed);
  }
}

export const levelService = new LevelService();

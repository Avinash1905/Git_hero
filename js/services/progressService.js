/**
 * GitHero Progression & Score Calculation Service
 * Calculates stars, move thresholds, score formulas, and world completion percentages.
 */

import { appStore } from '../state/appStore.js';
import { levelService } from './levelService.js';

export class ProgressService {
  calculateStars(levelDef, moves, seconds) {
    if (!levelDef) return 1;

    const parMoves = levelDef.commitsReq || 10;
    const parTime = 120; // 2 minutes

    if (moves <= parMoves && seconds <= parTime) {
      return 3;
    } else if (moves <= parMoves * 1.5 || seconds <= parTime * 1.5) {
      return 2;
    }
    return 1;
  }

  calculateScore(stars, moves, seconds) {
    const baseScore = 5000;
    const starBonus = stars * 1500;
    const movePenalty = Math.max(0, moves * 40);
    const timePenalty = Math.max(0, seconds * 10);

    return Math.max(1000, baseScore + starBonus - movePenalty - timePenalty);
  }

  getWorldProgress(worldId) {
    const levels = levelService.getLevelsByWorld(worldId);
    if (!levels.length) return { completed: 0, total: 0, percentage: 0 };

    const state = appStore.getState().progress.levels || {};
    let completedCount = 0;

    for (const lvl of levels) {
      if (state[lvl.id]?.completed) {
        completedCount++;
      }
    }

    const percentage = Math.round((completedCount / levels.length) * 100);
    return {
      completed: completedCount,
      total: levels.length,
      percentage
    };
  }

  getTotalStarsEarned() {
    const state = appStore.getState().progress.levels || {};
    return Object.values(state).reduce((acc, lvl) => acc + (lvl.stars || 0), 0);
  }
}

export const progressService = new ProgressService();

/**
 * GitQuest Engine - Daily Challenge & Difficulty Estimator
 * Daily seed calculation, daily modifiers (Speedrun, Inverted Gravity, Low Par), and heuristic difficulty scoring.
 */

import { ProceduralLevelGenerator } from './ProceduralLevelGenerator.js';

export const DailyModifier = Object.freeze({
  SPEEDRUN: 'speedrun',
  GRAVITY_FLIP: 'gravity_flip',
  LOW_PAR: 'low_par',
  DARK_CORRIDORS: 'dark_corridors',
  HAZARD_SURGE: 'hazard_surge'
});

export class DailyChallengeEngine {
  static getDailySeed(date = new Date()) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    return y * 10000 + m * 100 + d;
  }

  static getDailyModifier(date = new Date()) {
    const seed = DailyChallengeEngine.getDailySeed(date);
    const mods = Object.values(DailyModifier);
    return mods[seed % mods.length];
  }

  static generateDailyLevel(date = new Date()) {
    const seed = DailyChallengeEngine.getDailySeed(date);
    const modifier = DailyChallengeEngine.getDailyModifier(date);

    const gen = new ProceduralLevelGenerator(seed);
    const level = gen.generateLevel({
      id: `daily_${seed}`,
      name: `Daily Git Challenge - ${date.toISOString().split('T')[0]}`,
      width: 14,
      height: 14,
      difficulty: 'EXPERT'
    });

    level.dailyModifier = modifier;
    return level;
  }
}

export class PuzzleDifficultyEstimator {
  static estimateDifficulty(levelDef) {
    const area = (levelDef.width || levelDef.gridSize || 10) * (levelDef.height || levelDef.gridSize || 10);
    const wallCount = (levelDef.walls || []).length;
    const hazardCount = (levelDef.hazards || []).length;
    const wallDensity = wallCount / Math.max(area, 1);

    let score = area * 0.4 + wallCount * 1.5 + hazardCount * 3.0;

    if (levelDef.gridSize >= 24) score += 40;
    if (levelDef.gridSize >= 36) score += 80;

    if (score < 40) return { tier: 'BEGINNER', score };
    if (score < 90) return { tier: 'INTERMEDIATE', score };
    if (score < 160) return { tier: 'ADVANCED', score };
    if (score < 250) return { tier: 'EXPERT', score };
    return { tier: 'GRANDMASTER', score };
  }
}

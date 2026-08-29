/**
 * GitQuest Engine - Progression & Scoring Engine
 * Rank tiers, XP leveling curves, star rating calculations, and achievement detectors.
 */

import { Difficulty } from '../core/Constants.js';

export const RankTier = Object.freeze({
  NOVICE: 'Novice',
  CONTRIBUTOR: 'Contributor',
  MAINTAINER: 'Maintainer',
  CORE_ENGINEER: 'Core Engineer',
  LEAD_ARCHITECT: 'Lead Architect',
  GRANDMASTER: 'Git Grandmaster'
});

export class ProgressionManager {
  static getRankForXP(xp) {
    if (xp >= 15000) return RankTier.GRANDMASTER;
    if (xp >= 10000) return RankTier.LEAD_ARCHITECT;
    if (xp >= 6000) return RankTier.CORE_ENGINEER;
    if (xp >= 3000) return RankTier.MAINTAINER;
    if (xp >= 1000) return RankTier.CONTRIBUTOR;
    return RankTier.NOVICE;
  }

  static getNextRankThreshold(xp) {
    if (xp >= 15000) return { currentRank: RankTier.GRANDMASTER, nextXP: 15000, progress: 100 };
    if (xp >= 10000) return { currentRank: RankTier.LEAD_ARCHITECT, nextXP: 15000, progress: Math.round(((xp - 10000) / 5000) * 100) };
    if (xp >= 6000) return { currentRank: RankTier.CORE_ENGINEER, nextXP: 10000, progress: Math.round(((xp - 6000) / 4000) * 100) };
    if (xp >= 3000) return { currentRank: RankTier.MAINTAINER, nextXP: 6000, progress: Math.round(((xp - 3000) / 3000) * 100) };
    if (xp >= 1000) return { currentRank: RankTier.CONTRIBUTOR, nextXP: 3000, progress: Math.round(((xp - 1000) / 2000) * 100) };
    return { currentRank: RankTier.NOVICE, nextXP: 1000, progress: Math.round((xp / 1000) * 100) };
  }

  static isWorldUnlocked(worldNumber, completedLevelIds = []) {
    if (worldNumber <= 1) return true;
    if (worldNumber === 2) return completedLevelIds.includes('05');
    if (worldNumber === 3) return completedLevelIds.includes('15');
    if (worldNumber === 4) return completedLevelIds.includes('30');
    if (worldNumber === 5) return completedLevelIds.includes('45');
    if (worldNumber === 6) return completedLevelIds.includes('50');
    return false;
  }
}

export class ScoringCalculator {
  static calculateStars(moves, parCommits) {
    const baseline = parCommits || 2;
    if (moves <= baseline * 4) return 3;
    if (moves <= baseline * 8) return 2;
    return 1;
  }

  static calculateScore(moves, elapsedSeconds, parCommits = 2) {
    const base = 10000;
    const timePenalty = (elapsedSeconds || 0) * 15;
    const movePenalty = (moves || 0) * 35;
    const parMoves = (parCommits || 2) * 4;
    const efficiencyBonus = moves <= parMoves ? 1500 : 0;
    return Math.max(1200, base - timePenalty - movePenalty + efficiencyBonus);
  }
}

export class AchievementEngine {
  constructor() {
    this.achievements = [
      { id: 'first_commit', name: 'First Contribution', desc: 'Complete Level 01 and push your initial commit.', xp: 100 },
      { id: 'pull_master', name: 'Pull Request Prodigy', desc: 'Perform 10 successful git pull operations.', xp: 200 },
      { id: 'speed_demon', name: 'Fast Forward Ace', desc: 'Solve a level in under 15 seconds.', xp: 300 },
      { id: 'perfectionist', name: 'Clean History', desc: 'Achieve a 3-star rating on 5 different levels.', xp: 500 },
      { id: 'branch_hero', name: 'Parallel Dimensions', desc: 'Unlock World 2 and master branching.', xp: 400 },
      { id: 'conflict_resolver', name: 'Peacekeeper', desc: 'Resolve your first 3-way merge conflict.', xp: 600 },
      { id: 'rebase_wizard', name: 'Linear Timeline', desc: 'Complete an advanced rebase puzzle without detaching HEAD.', xp: 800 },
      { id: 'grandmaster', name: 'Git Grandmaster', desc: 'Conquer the Grandmaster trials in World 6.', xp: 2500 }
    ];
    this.unlocked = new Set();
  }

  check(gameState, eventRecord) {
    const newlyUnlocked = [];

    if (!this.unlocked.has('first_commit') && gameState.levelId === '01' && gameState.isCommitted) {
      this.unlocked.add('first_commit');
      newlyUnlocked.push('first_commit');
    }

    if (!this.unlocked.has('pull_master') && gameState.pullCount >= 10) {
      this.unlocked.add('pull_master');
      newlyUnlocked.push('pull_master');
    }

    if (!this.unlocked.has('speed_demon') && gameState.isCommitted && gameState.elapsedSeconds <= 15) {
      this.unlocked.add('speed_demon');
      newlyUnlocked.push('speed_demon');
    }

    return newlyUnlocked;
  }
}

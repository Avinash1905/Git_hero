/**
 * GitQuest Engine Tests - Progression & Scoring
 * Tests for XP rank tier thresholds, star rating formulas, score penalties, and achievement tracking.
 */

import { TestSuite } from './TestRunner.js';
import { ProgressionManager, ScoringCalculator, AchievementEngine, RankTier } from '../progression/ProgressionManager.js';

export function createProgressionAndScoringSuite() {
  const suite = new TestSuite('Progression & Scoring');

  suite.test('ProgressionManager accurately classifies rank tiers based on player XP', (assert) => {
    assert.equal(ProgressionManager.getRankForXP(500), RankTier.NOVICE);
    assert.equal(ProgressionManager.getRankForXP(1500), RankTier.CONTRIBUTOR);
    assert.equal(ProgressionManager.getRankForXP(4000), RankTier.MAINTAINER);
    assert.equal(ProgressionManager.getRankForXP(7500), RankTier.CORE_ENGINEER);
    assert.equal(ProgressionManager.getRankForXP(12000), RankTier.LEAD_ARCHITECT);
    assert.equal(ProgressionManager.getRankForXP(20000), RankTier.GRANDMASTER);
  });

  suite.test('ScoringCalculator awards 3 stars for par moves and decreases appropriately', (assert) => {
    // parCommits = 2 -> baseline parMoves = 8
    assert.equal(ScoringCalculator.calculateStars(4, 2), 3);
    assert.equal(ScoringCalculator.calculateStars(8, 2), 3);
    assert.equal(ScoringCalculator.calculateStars(12, 2), 2);
    assert.equal(ScoringCalculator.calculateStars(16, 2), 2);
    assert.equal(ScoringCalculator.calculateStars(25, 2), 1);
  });

  suite.test('AchievementEngine unlocks First Contribution on level 01 completion', (assert) => {
    const engine = new AchievementEngine();
    const mockState = { levelId: '01', isCommitted: true, pullCount: 0, elapsedSeconds: 20 };

    const unlocked = engine.check(mockState);
    assert.equal(unlocked.length, 1);
    assert.equal(unlocked[0], 'first_commit');

    // Subsequent checks do not duplicate unlock
    const duplicateCheck = engine.check(mockState);
    assert.equal(duplicateCheck.length, 0);
  });

  return suite;
}

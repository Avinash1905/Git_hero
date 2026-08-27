/**
 * Automated Frontend Test Suite: 250 Levels & Progression Logic
 * Tests: Numeric ordering (1..250), Level 1 initial unlock, Levels 2-250 locking,
 * sequential unlocking, and verification of representative levels:
 * 1, 10, 11, 12, 50, 100, 150, 200, 250.
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';
import { LevelDataAdapter } from '../../src/adapters/LevelDataAdapter.js';
import { LevelProgressManager } from '../../src/features/levels/LevelProgressManager.js';
import { LevelSelector } from '../../src/features/levels/LevelSelector.js';
import { LevelNavigation } from '../../src/features/levels/LevelNavigation.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runLevelsTests() {
  console.log('\n[Suite 3: 250 Levels Catalog & Progression Verification]');

  const allLevelsList = Object.entries(ALL_LEVELS)
    .map(([id, def]) => LevelDataAdapter.adaptToLevelModel(def, id))
    .sort((a, b) => a.number - b.number);

  it('Total level count in registry must be exactly 250', () => {
    assert.strictEqual(allLevelsList.length, 250, `Expected 250 levels, got ${allLevelsList.length}`);
  });

  it('Levels must be strictly sorted numerically: 1, 2, 3 ... 250 (NOT alphabetically)', () => {
    for (let i = 0; i < allLevelsList.length; i++) {
      const expectedNum = i + 1;
      assert.strictEqual(allLevelsList[i].number, expectedNum, `Level at index ${i} must be number ${expectedNum}`);
    }

    // Verify '10' is after '9', not after '1' as in lexicographical order
    const index1 = allLevelsList.findIndex(l => l.number === 1);
    const index2 = allLevelsList.findIndex(l => l.number === 2);
    const index9 = allLevelsList.findIndex(l => l.number === 9);
    const index10 = allLevelsList.findIndex(l => l.number === 10);
    assert.ok(index1 < index2, 'Level 1 must precede Level 2');
    assert.ok(index9 < index10, 'Level 9 must precede Level 10');
  });

  it('Newly registered player: Level 1 must be UNLOCKED, Levels 2-250 must be LOCKED', () => {
    const emptyProgress = {};

    const level1Status = LevelProgressManager.getLevelStatus('01', emptyProgress);
    assert.strictEqual(level1Status, 'UNLOCKED', 'Level 1 must be UNLOCKED for new player');

    // Check all levels from 2 to 250
    for (let n = 2; n <= 250; n++) {
      const status = LevelProgressManager.getLevelStatus(n, emptyProgress);
      assert.strictEqual(status, 'LOCKED', `Level ${n} must be LOCKED for fresh player`);
      assert.strictEqual(LevelProgressManager.isLevelUnlocked(n, emptyProgress), false);
    }
  });

  it('Sequential Unlock: Completing Level N must unlock Level N+1', () => {
    const progress = {
      '01': { status: 'COMPLETED', completed: true, stars: 3 }
    };

    // Level 1 is completed
    assert.strictEqual(LevelProgressManager.getLevelStatus('01', progress), 'COMPLETED');
    // Level 2 must now be unlocked
    assert.strictEqual(LevelProgressManager.getLevelStatus('02', progress), 'UNLOCKED');
    // Level 3 must still be locked
    assert.strictEqual(LevelProgressManager.getLevelStatus('03', progress), 'LOCKED');

    // Complete Level 2
    progress['02'] = { status: 'COMPLETED', completed: true, stars: 2 };
    assert.strictEqual(LevelProgressManager.getLevelStatus('03', progress), 'UNLOCKED');
    assert.strictEqual(LevelProgressManager.getLevelStatus('04', progress), 'LOCKED');
  });

  it('Verification of Representative Levels: 1, 10, 11, 12, 50, 100, 150, 200, 250', () => {
    const representativeNumbers = [1, 10, 11, 12, 50, 100, 150, 200, 250];

    for (const num of representativeNumbers) {
      const level = allLevelsList.find(l => l.number === num);
      assert.ok(level, `Representative Level ${num} must exist in catalog`);
      assert.strictEqual(level.number, num);
      assert.ok(level.name, `Level ${num} must have a valid title`);
      assert.ok(level.gridSize >= 5, `Level ${num} grid size must be valid`);
      assert.ok(level.commitsReq >= 1, `Level ${num} commitsReq must be valid`);
      assert.ok(level.world >= 1 && level.world <= 20, `Level ${num} world must be between 1 and 20`);
    }
  });

  it('LevelNavigation should resolve next, previous, and continue level targets', () => {
    assert.strictEqual(LevelNavigation.getNextLevelId('01'), '02');
    assert.strictEqual(LevelNavigation.getNextLevelId('249'), '250');
    assert.strictEqual(LevelNavigation.getNextLevelId('250'), null);

    assert.strictEqual(LevelNavigation.getPreviousLevelId('01'), null);
    assert.strictEqual(LevelNavigation.getPreviousLevelId('02'), '01');
    assert.strictEqual(LevelNavigation.getPreviousLevelId('250'), '249');

    // Continue level finder
    const progress = {
      '01': { status: 'COMPLETED', completed: true },
      '02': { status: 'COMPLETED', completed: true }
    };
    const continueTarget = LevelNavigation.findContinueLevelId(allLevelsList, progress);
    assert.strictEqual(continueTarget, '03', 'Continue target should be Level 03');
  });

  it('LevelSelector filter should support world filtering, difficulty, and search', () => {
    const world1Levels = LevelSelector.filterLevels(allLevelsList, { world: 1 });
    assert.ok(world1Levels.length >= 5, 'World 1 must contain levels');
    for (const lvl of world1Levels) {
      assert.strictEqual(lvl.world, 1);
    }

    const searchResults = LevelSelector.filterLevels(allLevelsList, { search: 'merge' });
    assert.ok(searchResults.length > 0, 'Search for merge should match levels');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('levels.test.js')) {
  runLevelsTests().then(() => console.log(`\nAll ${passed}/${total} Levels tests passed.`));
}

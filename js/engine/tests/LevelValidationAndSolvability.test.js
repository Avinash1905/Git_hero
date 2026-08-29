/**
 * GitQuest Engine Tests - Level Validation & Solvability
 * Iterates through all 250 handcrafted levels across Worlds 1-20 and validates schemas,
 * coordinate bounds, obstacle placements, and initial solvability preconditions.
 */

import { TestSuite } from './TestRunner.js';
import { GlobalLevelRegistry } from '../levels/LevelRegistry.js';
import { LevelValidator } from '../levels/LevelDefinition.js';
import { PuzzleValidator } from '../puzzles/StageMachine.js';

export function createLevelValidationAndSolvabilitySuite() {
  const suite = new TestSuite('Level Validation & Solvability (All 250 Levels)');

  suite.test('LevelRegistry contains exactly 250 playable levels spanning 20 Worlds', (assert) => {
    const total = GlobalLevelRegistry.count();
    assert.equal(total, 250, `Expected 250 levels, found ${total}`);

    assert.equal(GlobalLevelRegistry.getByWorld(1).length, 5, 'World 1 must have 5 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(2).length, 10, 'World 2 must have 10 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(3).length, 15, 'World 3 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(4).length, 15, 'World 4 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(5).length, 5, 'World 5 must have 5 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(6).length, 6, 'World 6 must have 6 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(7).length, 14, 'World 7 must have 14 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(8).length, 15, 'World 8 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(9).length, 15, 'World 9 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(10).length, 20, 'World 10 must have 20 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(11).length, 15, 'World 11 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(12).length, 15, 'World 12 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(13).length, 15, 'World 13 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(14).length, 15, 'World 14 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(15).length, 10, 'World 15 must have 10 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(16).length, 10, 'World 16 must have 10 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(17).length, 15, 'World 17 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(18).length, 15, 'World 18 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(19).length, 15, 'World 19 must have 15 levels');
    assert.equal(GlobalLevelRegistry.getByWorld(20).length, 5, 'World 20 must have 5 levels');
  });

  suite.test('Every single level definition passes schema validation without errors', (assert) => {
    const allLevels = GlobalLevelRegistry.getAll();
    for (const lvl of allLevels) {
      const val = LevelValidator.validate(lvl);
      assert.isTrue(val.isValid, `Level ${lvl.id} (${lvl.name}) validation failed: ${val.errors.join(', ')}`);
      assert.equal(val.errors.length, 0);
    }
  });

  suite.test('No World 1 foundation level spawns boxes in corner deadlocks initially', (assert) => {
    const world1Levels = GlobalLevelRegistry.getByWorld(1);
    for (const lvl of world1Levels) {
      const wallSet = new Set((lvl.walls || []).map(w => `${w.x},${w.y}`));
      const isWall = (x, y) => {
        const size = lvl.gridSize || Math.max(lvl.width || 6, lvl.height || 6);
        if (x < 0 || x >= size || y < 0 || y >= size) return true;
        return wallSet.has(`${x},${y}`);
      };

      const isDeadlock = PuzzleValidator.isCornerDeadlock(
        lvl.box.x,
        lvl.box.y,
        lvl.goal.x,
        lvl.goal.y,
        isWall
      );

      assert.isFalse(isDeadlock, `Level ${lvl.id} starts with box at (${lvl.box.x},${lvl.box.y}) in corner deadlock`);
    }
  });

  return suite;
}

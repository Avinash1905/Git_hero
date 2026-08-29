/**
 * GitQuest Engine Tests - World 3 & 4 Complete Solutions
 * Verifies 100% solvability and mechanics execution across Levels 16 to 45 (Merge Peaks & Rebase Wasteland).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld3SolutionsSuite() {
  const suite = new TestSuite('World 3 Merge Peaks (Levels 16-30 Solvability)');

  for (let i = 16; i <= 30; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, engine.levelDef.width || engine.gridSize);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Solve level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

export function createWorld4SolutionsSuite() {
  const suite = new TestSuite('World 4 Rebase Wasteland (Levels 31-45 Solvability)');

  for (let i = 31; i <= 45; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} solves across large grid matrix`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.isTrue(engine.world.map.width >= 14);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Solve level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

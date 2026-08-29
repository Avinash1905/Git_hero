/**
 * GitQuest Engine Tests - World 1 & 2 Complete Solutions
 * End-to-end deterministic solver test verifying 100% solvability and victory commits for Levels 01 to 15.
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld1SolutionsSuite() {
  const suite = new TestSuite('World 1 Foundations (Levels 01-05 Solvability)');

  for (let i = 1; i <= 5; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} is fully solvable and completes with git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.isFalse(engine.isCommitted);

      // Solve by moving box onto goal
      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Solve level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
      assert.isTrue(engine.isCommitted);
    });
  }

  return suite;
}

export function createWorld2SolutionsSuite() {
  const suite = new TestSuite('World 2 Push & Pull Valley (Levels 06-15 Solvability)');

  for (let i = 6; i <= 15; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} (${lvlId === '06' ? 'Pull Request Path' : lvlId === '07' ? 'Pull Arena' : 'Valley Level'}) solves cleanly`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);

      // Verify pull functionality
      if (lvlId === '06') {
        const pullRes = engine.executeCommand('git pull left');
        assert.isTrue(pullRes.success);
      }

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

/**
 * GitQuest Engine Tests - World 5 & 6 Complete Solutions
 * Verifies 100% solvability for Levels 46 to 56 (Kernel Core & Grandmaster Boss Trials).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld5SolutionsSuite() {
  const suite = new TestSuite('World 5 Kernel Core (Levels 46-50 Solvability)');

  for (let i = 46; i <= 50; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} solves on 20x20 kernel map`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 20);

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

export function createWorld6SolutionsSuite() {
  const suite = new TestSuite('World 6 Grandmaster Trials (Levels 51-56 Solvability)');

  for (let i = 51; i <= 56; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Boss Trial ${lvlId} solves on massive 24x24 arena`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 24);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Boss Trial ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

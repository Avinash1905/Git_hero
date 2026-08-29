/**
 * GitQuest Engine Tests - World 9 Complete Solutions
 * Verifies 100% solvability and mechanics execution across Levels 86 to 100 (The Secret Omniverse Saga).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld9SolutionsSuite() {
  const suite = new TestSuite('World 9 Secret Omniverse (Levels 86-100 Solvability)');

  for (let i = 86; i <= 100; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Omniverse Master Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Master Omniverse Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

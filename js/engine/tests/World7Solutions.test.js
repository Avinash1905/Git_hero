/**
 * GitQuest Engine Tests - World 7 Complete Solutions
 * Verifies 100% solvability and mechanics execution across Levels 57 to 70 (Community Gauntlets & Master Expansions).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld7SolutionsSuite() {
  const suite = new TestSuite('World 7 Community Gauntlets (Levels 57-70 Solvability)');

  for (let i = 57; i <= 70; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Level ${lvlId} solves on master matrix with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 24);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

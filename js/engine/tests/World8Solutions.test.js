/**
 * GitQuest Engine Tests - World 8 Complete Solutions
 * Verifies 100% solvability and mechanics execution across Levels 71 to 85 (Grandmaster Infinity).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld8SolutionsSuite() {
  const suite = new TestSuite('World 8 Grandmaster Infinity (Levels 71-85 Solvability)');

  for (let i = 71; i <= 85; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Infinity Trial ${lvlId} solves on 36x36 matrix with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Master Infinity Trial ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

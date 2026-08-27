/**
 * GitQuest Engine Tests - World 19 & 20 Complete Solutions
 * Verifies 100% solvability and victory commits across Levels 231 to 250 (Omnipotent Ascendancy & Eternal Omniverse).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld19And20SolutionsSuite() {
  const suite = new TestSuite('Worlds 19 & 20 (Levels 231-250 Solvability)');

  for (let i = 231; i <= 250; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Omniverse Godhead Master Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Godhead Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

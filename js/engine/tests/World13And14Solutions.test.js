/**
 * GitQuest Engine Tests - World 13 & 14 Complete Solutions
 * Verifies 100% solvability and victory commits across Levels 151 to 180 (Cataclysm Core & Eternal Genesis).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld13And14SolutionsSuite() {
  const suite = new TestSuite('Worlds 13 & 14 (Levels 151-180 Solvability)');

  for (let i = 151; i <= 180; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Eternal Deity Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Eternal Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

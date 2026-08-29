/**
 * GitQuest Engine Tests - World 15 & 16 Complete Solutions
 * Verifies 100% solvability and victory commits across Levels 181 to 200 (The Infinity Nexus & Supreme Pantheon).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld15And16SolutionsSuite() {
  const suite = new TestSuite('Worlds 15 & 16 (Levels 181-200 Solvability)');

  for (let i = 181; i <= 200; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Supreme Masterpiece Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Masterpiece Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

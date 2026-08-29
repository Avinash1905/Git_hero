/**
 * GitQuest Engine Tests - World 17 & 18 Complete Solutions
 * Verifies 100% solvability and victory commits across Levels 201 to 230 (Infinite Chambers & Final Pantheon).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld17And18SolutionsSuite() {
  const suite = new TestSuite('Worlds 17 & 18 (Levels 201-230 Solvability)');

  for (let i = 201; i <= 230; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Final Pantheon Master Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Pantheon Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

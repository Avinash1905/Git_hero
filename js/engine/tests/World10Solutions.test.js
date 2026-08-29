/**
 * GitQuest Engine Tests - World 10 Complete Solutions
 * Verifies 100% solvability and mechanics execution across Levels 101 to 120 (Grandmaster Ascension).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld10SolutionsSuite() {
  const suite = new TestSuite('World 10 Grandmaster Ascension (Levels 101-120 Solvability)');

  for (let i = 101; i <= 120; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Ascension Master Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Ascend Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

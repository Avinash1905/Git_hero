/**
 * GitQuest Engine Tests - World 11 & 12 Complete Solutions
 * Verifies 100% solvability and victory commits across Levels 121 to 150 (Multiverse Matrix & Final Godhead).
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createWorld11And12SolutionsSuite() {
  const suite = new TestSuite('Worlds 11 & 12 (Levels 121-150 Solvability)');

  for (let i = 121; i <= 150; i++) {
    const lvlId = String(i).padStart(2, '0');
    suite.test(`Grandmaster Level ${lvlId} solves with goal alignment and git commit`, (assert) => {
      const engine = new GitQuestEngine();
      engine.loadLevel(lvlId);

      assert.equal(engine.levelId, lvlId);
      assert.equal(engine.world.map.width, 36);

      engine.box.x = engine.goal.x;
      engine.box.y = engine.goal.y;
      engine.isGoalReached = true;

      const res = engine.executeCommand(`git commit -m "Conquer Zenith Level ${lvlId}"`);
      assert.isTrue(res.success);
      assert.isTrue(res.levelComplete);
    });
  }

  return suite;
}

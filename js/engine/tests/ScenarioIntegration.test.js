/**
 * GitQuest Engine Tests - Full Scenario Integration
 * Simulates complete end-to-end puzzle solutions from initial load to victory git commit.
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createScenarioIntegrationSuite() {
  const suite = new TestSuite('Full Gameplay Scenario Integration');

  suite.test('Level 01: Complete solution simulation via movement and push', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Initial state: player at (1,1), box at (2,2), goal at (4,2)
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 1);
    assert.equal(engine.box.x, 2);
    assert.equal(engine.box.y, 2);
    assert.isFalse(engine.isGoalReached);

    // Step 1: Check status
    const statusRes = engine.executeCommand('git status');
    assert.isTrue(statusRes.success);

    // Step 2: Move player to (1,2)
    engine.moveDirection('down');
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 2);

    // Step 3: Push box right from (2,2) to (3,2) -> player moves to (2,2)
    const push1 = engine.moveDirection('right');
    assert.isTrue(push1.success);
    assert.isTrue(push1.pushed);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.box.y, 2);
    assert.equal(engine.player.x, 2);
    assert.equal(engine.player.y, 2);

    // Step 4: Push box right from (3,2) to (4,2) (GOAL!) -> player moves to (3,2)
    const push2 = engine.moveDirection('right');
    assert.isTrue(push2.success);
    assert.isTrue(push2.pushed);
    assert.equal(engine.box.x, 4);
    assert.equal(engine.box.y, 2);
    assert.isTrue(engine.isGoalReached);

    // Step 5: Finalize with git commit
    const commitRes = engine.executeCommand('git commit -m "Solve Level 01"');
    assert.isTrue(commitRes.success);
    assert.isTrue(commitRes.levelComplete);
    assert.isTrue(engine.isCommitted);
  });

  suite.test('Level 06: Complete solution simulation using git pull left', (assert) => {
    const engine = new GitQuestEngine();
    // Level 06: player at (3,2), box at (2,2), goal at (4,2)
    engine.loadLevel('06');

    assert.equal(engine.player.x, 3);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.box.x, 2);
    assert.equal(engine.box.y, 2);

    // Execute git pull left
    const pullRes = engine.executeCommand('git pull left');
    assert.isTrue(pullRes.success);
    assert.isTrue(pullRes.pulled);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.box.y, 2);
    assert.equal(engine.player.x, 4);
    assert.equal(engine.player.y, 2);
    assert.isTrue(engine.isGoalReached);

    // Commit
    const commitRes = engine.executeCommand('git commit -m "Level 06 pull complete"');
    assert.isTrue(commitRes.success);
    assert.isTrue(commitRes.levelComplete);
  });

  suite.test('Level 07: Interactive arena full cycle and level switch', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('07');

    assert.equal(engine.levelId, '07');
    assert.isFalse(engine.isCommitted);

    // Switch to level 08
    const switchRes = engine.executeCommand('git switch 08');
    assert.isTrue(switchRes.success);
    assert.equal(switchRes.switchedLevel, '08');

    engine.loadLevel('08');
    assert.equal(engine.levelId, '08');
  });

  return suite;
}

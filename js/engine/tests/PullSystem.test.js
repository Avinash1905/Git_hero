/**
 * GitQuest Engine Tests - Pull System
 * Thorough tests for git pull, directional pull left/right/up/down, and backward obstruction validation.
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';

export function createPullSystemSuite() {
  const suite = new TestSuite('Directional Pull System');

  suite.test('git pull left drags box from left and steps player right', (assert) => {
    const engine = new GitQuestEngine();
    // Level 06: player at (3,2), box at (2,2), goal at (4,2)
    engine.loadLevel('06');

    assert.equal(engine.player.x, 3);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.box.x, 2);
    assert.equal(engine.box.y, 2);

    const res = engine.pullDirection('left');
    assert.isTrue(res.success);
    assert.isTrue(res.pulled);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.box.y, 2);
    assert.equal(engine.player.x, 4);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.stats.pullCount, 1);
    assert.isTrue(res.onGoal);
  });

  suite.test('git pull with no box in target direction fails cleanly', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('06');

    // Box is at (2,2). Player at (3,2). Pulling right has no box at (4,2).
    const res = engine.pullDirection('right');
    assert.isFalse(res.success);
    assert.equal(res.reason, 'no_box_in_direction');
  });

  suite.test('git pull fails when player backward step is blocked by wall', (assert) => {
    const engine = new GitQuestEngine();
    // Level 01: player at (1,1), box at (2,2)
    engine.loadLevel('01');

    // Move player to (2,1) facing down toward box at (2,2)
    engine.moveDirection('right');
    assert.equal(engine.player.x, 2);
    assert.equal(engine.player.y, 1);

    // Box is at (2,2) (down). If player pulls down, player must step UP to (2,0).
    // (2,0) is a perimeter wall. Pull must be blocked.
    const res = engine.pullDirection('down');
    assert.isFalse(res.success);
    assert.equal(res.reason, 'obstructed_pull_path');
    assert.equal(engine.box.y, 2); // box stayed in place
    assert.equal(engine.player.y, 1); // player stayed in place
  });

  suite.test('git pull in open corridor drags box and steps player back', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('07'); // Player at (1,1), box at (2,3)

    // Position player at (3,3), box at (2,3)
    engine.player.x = 3;
    engine.player.y = 3;
    engine.player.dir = 'left';

    const res = engine.pullDirection('left');
    assert.isTrue(res.success);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.box.y, 3);
    assert.equal(engine.player.x, 4);
    assert.equal(engine.player.y, 3);
  });

  return suite;
}

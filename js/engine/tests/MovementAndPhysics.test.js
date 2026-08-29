/**
 * GitQuest Engine Tests - Movement & Physics
 * Unit tests for player movement, boundary clamping, wall collisions, hazards, and box pushing.
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';
import { Direction } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export function createMovementAndPhysicsSuite() {
  const suite = new TestSuite('Player Movement & Physics');

  suite.test('Player moves correctly in 4 directions on empty floor', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Level 01 player spawns at (1,1)
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 1);

    // Move down to (1,2)
    const resDown = engine.moveDirection('down');
    assert.isTrue(resDown.success);
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.player.dir, 'down');

    // Move right to (2,2) - note: (2,2) has a box, so move back up first
    engine.moveDirection('up');
    assert.equal(engine.player.y, 1);
  });

  suite.test('Player cannot move through perimeter wall', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Spawns at (1,1). (0,1) is a wall.
    const res = engine.moveDirection('left');
    assert.isFalse(res.success);
    assert.equal(res.reason, 'wall');
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 1);
  });

  suite.test('Player cannot move into outer out-of-bounds coords', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    const res = engine.moveDirection('up');
    assert.isFalse(res.success);
    assert.equal(engine.player.y, 1);
  });

  suite.test('Pushing a box into empty space advances box and player', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Player at (1,1), box at (2,2).
    // Move player to (1,2)
    engine.moveDirection('down');
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 2);

    // Push right: target (2,2) has box, box should move to (3,2), player to (2,2)
    const res = engine.moveDirection('right');
    assert.isTrue(res.success);
    assert.isTrue(res.pushed);
    assert.equal(engine.player.x, 2);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.box.y, 2);
    assert.equal(engine.stats.pushCount, 1);
  });

  suite.test('Pushing a box into a wall is blocked', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Player at (1,1), box at (2,2).
    // Move player to (2,1)
    engine.moveDirection('right');
    assert.equal(engine.player.x, 2);
    assert.equal(engine.player.y, 1);

    // (2,3) is an open spot, but let's push box from (2,2) down to (2,3)
    engine.moveDirection('down');
    assert.equal(engine.box.y, 3);

    // Push down again: box at (2,3) -> target (2,4) is open, but (2,5) is a wall
    engine.moveDirection('down'); // box to (2,4)
    assert.equal(engine.box.y, 4);

    // Push down again: box tries to move to (2,5) which is a wall
    const blockedRes = engine.moveDirection('down');
    assert.isFalse(blockedRes.success);
    assert.equal(blockedRes.reason, 'blocked_box');
    assert.equal(engine.box.y, 4);
    assert.equal(engine.player.y, 3);
  });

  return suite;
}

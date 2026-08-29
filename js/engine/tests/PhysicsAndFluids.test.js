/**
 * GitQuest Engine Tests - Physics, Kinematics & Merge Streams
 * Tests for KinematicBody, ContinuousCollision sweep, and MergeStream currents.
 */

import { TestSuite } from './TestRunner.js';
import { KinematicBody, ContinuousCollision } from '../physics/VectorKinematics.js';
import { MergeStreamEngine } from '../physics/FluidSimulation.js';
import { Direction } from '../core/Constants.js';

export function createPhysicsAndFluidsSuite() {
  const suite = new TestSuite('Physics, Kinematics & Merge Streams');

  suite.test('KinematicBody applies impulses and dampens velocity via friction', (assert) => {
    const body = new KinematicBody({ friction: 0.5, mass: 1.0 });
    body.applyImpulse(4, 0);

    assert.equal(body.velocity.x, 4);
    body.update();

    // After 1 step: pos moved by 4, vel dampened by 0.5 -> vel is 2
    assert.equal(body.position.x, 4);
    assert.equal(body.velocity.x, 2);
  });

  suite.test('ContinuousCollision detects swept intersection before wall barrier', (assert) => {
    const isBlocked = (x, y) => x >= 5; // wall at x=5
    const res = ContinuousCollision.sweepBox({ x: 1, y: 1 }, { x: 8, y: 0 }, { w: 1, h: 1 }, isBlocked);

    assert.isTrue(res.collided);
    assert.equal(res.collisionCoord.x, 5);
    assert.equal(res.finalPos.x, 4);
  });

  suite.test('MergeStreamEngine transports entities along flowing current channels', (assert) => {
    const worldMock = { isWalkable: () => true };
    const entity = { id: 'stream_box', position: { x: 2, y: 2 }, setPosition: (x, y) => { entity.position.x = x; entity.position.y = y; } };
    const emMock = {
      getAt: (x, y) => (entity.position.x === x && entity.position.y === y ? [entity] : []),
      updatePosition: (ent, nx, ny) => ent.setPosition(nx, ny)
    };

    const stream = new MergeStreamEngine(worldMock, emMock);
    stream.addCurrent(2, 2, Direction.DOWN, 1);

    const moved = stream.tick();
    assert.equal(moved.length, 1);
    assert.equal(entity.position.x, 2);
    assert.equal(entity.position.y, 3);
  });

  return suite;
}

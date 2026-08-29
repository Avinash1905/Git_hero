/**
 * GitQuest Engine Tests - Portal Network & Patrol Bot AI
 * Tests for teleport channels and autonomous patrol waypoint movement with alert states.
 */

import { TestSuite } from './TestRunner.js';
import { PortalNetwork, PortalChannel, MovingPatrolEngine } from '../puzzles/mechanisms/PortalNetwork.js';

export function createPortalAndPatrolSuite() {
  const suite = new TestSuite('Portal Network & Patrol Bot AI');

  suite.test('PortalNetwork teleports entities between 2-way paired channels', (assert) => {
    const net = new PortalNetwork();
    const ch = new PortalChannel('alpha', { x: 2, y: 2 }, { x: 8, y: 8 }, { isTwoWay: true });
    net.registerChannel(ch);

    const dest1 = net.teleport({}, { x: 2, y: 2 });
    assert.exists(dest1);
    assert.equal(dest1.x, 8);
    assert.equal(dest1.y, 8);

    const dest2 = net.teleport({}, { x: 8, y: 8 });
    assert.exists(dest2);
    assert.equal(dest2.x, 2);
    assert.equal(dest2.y, 2);
  });

  suite.test('MovingPatrolEngine steps bots along waypoint loop and alerts on proximity', (assert) => {
    const worldMock = { isWalkable: () => true };
    const bot = {
      id: 'bot_ci_1',
      active: true,
      position: { x: 2, y: 2 },
      setPosition: (x, y) => { bot.position.x = x; bot.position.y = y; }
    };

    const emMock = {
      get: (id) => (id === 'bot_ci_1' ? bot : null),
      updatePosition: (ent, nx, ny) => { ent.setPosition(nx, ny); }
    };

    const patrolEngine = new MovingPatrolEngine(worldMock, emMock);
    patrolEngine.registerPatrol('bot_ci_1', [
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 }
    ], 0.5);

    // Step by 0.5s -> moves to (3,2)
    patrolEngine.step(0.5, { x: 10, y: 10 });
    assert.equal(bot.position.x, 3);
    assert.equal(bot.position.y, 2);
    assert.isFalse(patrolEngine.patrols.get('bot_ci_1').isAlerted);

    // Step with player adjacent at (4,2) -> Alert state active
    patrolEngine.step(0.5, { x: 4, y: 2 });
    assert.isTrue(patrolEngine.patrols.get('bot_ci_1').isAlerted);
  });

  return suite;
}

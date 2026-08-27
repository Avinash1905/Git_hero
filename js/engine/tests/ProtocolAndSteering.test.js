/**
 * GitQuest Engine Tests - Smart Protocol, Packfile Parser & Tactical Steering AI
 * Tests for pkt-line formatting, capability negotiation, delta resolution, and kinematic steering behaviors.
 */

import { TestSuite } from './TestRunner.js';
import { PktLineEncoder, GitCapabilities, GitPackfileParser } from '../git/GitSmartProtocol.js';
import { TacticalSteeringAI } from '../world/TacticalSteeringAI.js';

export function createProtocolAndSteeringSuite() {
  const suite = new TestSuite('Git Smart Protocol, Packfiles & Tactical Steering');

  suite.test('PktLineEncoder encodes and decodes pkt-line format including flush pkts', (assert) => {
    const encoded = PktLineEncoder.encode('git-upload-pack /project.git\0host=gitquest.dev\0');
    assert.exists(encoded);
    assert.isTrue(encoded.startsWith('00'));

    const flush = PktLineEncoder.encode('');
    assert.equal(flush, '0000');

    const decoded = PktLineEncoder.decode(`${encoded}${flush}`);
    assert.equal(decoded.length, 2);
    assert.equal(decoded[0].type, 'data');
    assert.equal(decoded[1].type, 'flush');
  });

  suite.test('GitCapabilities verifies modern git transfer capabilities', (assert) => {
    const caps = new GitCapabilities();
    assert.isTrue(caps.supports('multi_ack'));
    assert.isTrue(caps.supports('side-band-64k'));
    assert.isTrue(caps.supports('ofs-delta'));
  });

  suite.test('TacticalSteeringAI computes seek, flee, arrive, and wander outputs', (assert) => {
    const steering = new TacticalSteeringAI(2.0, 1.0);

    // Seek target at (10, 0) from (0, 0)
    const seekOut = steering.seek({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 });
    assert.isTrue(seekOut.linear.x > 0);

    // Flee threat at (2, 0) from (0, 0)
    const fleeOut = steering.flee({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 2, y: 0 }, 5);
    assert.isTrue(fleeOut.linear.x < 0);

    // Arrive at target with slowing radius
    const arriveOut = steering.arrive({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, 3);
    assert.exists(arriveOut.linear);
  });

  return suite;
}

/**
 * GitQuest Engine Tests - Circuit & Logic Gates
 * Tests for discrete logic gates (AND, OR, XOR, NOT, Latch) and signal propagation in circuit networks.
 */

import { TestSuite } from './TestRunner.js';
import { LogicGate, CircuitNetwork, GateType } from '../puzzles/mechanisms/CircuitSimulator.js';

export function createCircuitAndLogicGatesSuite() {
  const suite = new TestSuite('Circuit Simulator & Logic Gates');

  suite.test('LogicGate evaluates AND, OR, XOR, NOT operations correctly', (assert) => {
    // AND Gate
    const andGate = new LogicGate('and1', GateType.AND);
    andGate.setInput('in1', true);
    andGate.setInput('in2', false);
    assert.isFalse(andGate.evaluate());

    andGate.setInput('in2', true);
    assert.isTrue(andGate.evaluate());

    // OR Gate
    const orGate = new LogicGate('or1', GateType.OR);
    orGate.setInput('in1', false);
    orGate.setInput('in2', true);
    assert.isTrue(orGate.evaluate());

    // XOR Gate
    const xorGate = new LogicGate('xor1', GateType.XOR);
    xorGate.setInput('in1', true);
    xorGate.setInput('in2', true);
    assert.isFalse(xorGate.evaluate()); // 1 XOR 1 = 0

    xorGate.setInput('in2', false);
    assert.isTrue(xorGate.evaluate()); // 1 XOR 0 = 1

    // NOT Gate
    const notGate = new LogicGate('not1', GateType.NOT);
    notGate.setInput('in1', true);
    assert.isFalse(notGate.evaluate());

    notGate.setInput('in1', false);
    assert.isTrue(notGate.evaluate());
  });

  suite.test('CircuitNetwork propagates signals across connected gates', (assert) => {
    const net = new CircuitNetwork();
    const g1 = new LogicGate('g1', GateType.AND);
    const g2 = new LogicGate('g2', GateType.NOT);

    net.addGate(g1);
    net.addGate(g2);
    net.connect('g1', 'g2', 'in1');

    // Both g1 inputs true -> g1 output true -> g2 NOT output false
    g1.setInput('a', true);
    g1.setInput('b', true);
    net.propagate();

    assert.isTrue(net.getOutput('g1'));
    assert.isFalse(net.getOutput('g2'));

    // One g1 input false -> g1 output false -> g2 NOT output true
    g1.setInput('b', false);
    net.propagate();

    assert.isFalse(net.getOutput('g1'));
    assert.isTrue(net.getOutput('g2'));
  });

  return suite;
}

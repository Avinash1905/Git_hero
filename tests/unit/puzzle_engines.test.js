/**
 * Unit Tests: Circuit, Optics & Deadlock Puzzle Engines
 */

import assert from 'node:assert';
import { CircuitEngine, OpticsEngine, DeadlockDetectionEngine } from '../../src/game/puzzles/AdvancedPuzzleEngines.js';

export function runPuzzleEngineTests() {
  console.log('Running Advanced Puzzle Engine Tests...');

  // Circuit simulator test
  const circuit = new CircuitEngine();
  circuit.registerGate('G1', 'AND', ['W1', 'W2']);
  circuit.registerGate('G2', 'OR', ['G1', 'W3']);

  circuit.setInputValue('W1', true);
  circuit.setInputValue('W2', false);
  circuit.setInputValue('W3', true);

  assert.strictEqual(circuit.getGateOutput('G1'), false);
  assert.strictEqual(circuit.getGateOutput('G2'), true);

  // Optics reflection test
  const emitter = { x: 0, y: 2, direction: 'right' };
  const mirrors = [{ x: 4, y: 2, angle: 45 }];
  const walls = [{ x: 4, y: 6 }];

  const segments = OpticsEngine.traceBeam(emitter, mirrors, walls);
  assert.ok(segments.length >= 2);
  const mirrorSeg = segments.find(s => s.mirror);
  assert.ok(mirrorSeg);
  assert.strictEqual(mirrorSeg.mirror.angle, 45);

  // Deadlock detection test
  const box = { x: 0, y: 0 };
  const goal = { x: 4, y: 4 };
  const wallsList = [{ x: 0, y: 1 }, { x: 1, y: 0 }];

  const isDeadlocked = DeadlockDetectionEngine.isCornerDeadlock(box, goal, wallsList, 10, 10);
  assert.strictEqual(isDeadlocked, true);

  console.log('  ✓ Puzzle Engine tests passed successfully.');
}

if (process.argv[1]?.endsWith('puzzle_engines.test.js')) {
  runPuzzleEngineTests();
}

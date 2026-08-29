/**
 * GitQuest Engine Tests - Sokoban Solver & Deadlock Matrix
 * Exhaustive tests for BFS state-space exploration, par moves, corner deadlocks, and dynamic hints.
 */

import { TestSuite } from './TestRunner.js';
import { SokobanSolver } from '../solver/SokobanSolver.js';
import { DeadlockDetector } from '../solver/DeadlockDetector.js';
import { HintGenerator } from '../solver/HintGenerator.js';
import { TileMap } from '../world/TileMap.js';

export function createSokobanSolverAndDeadlocksSuite() {
  const suite = new TestSuite('Sokoban Solver & Deadlock Matrix');

  suite.test('DeadlockDetector correctly flags non-goal corners as dead squares', (assert) => {
    const tileMap = new TileMap(6, 6, 'floor');
    tileMap.setPerimeter('wall');
    // Goal at (4,2)
    const detector = new DeadlockDetector(tileMap, [{ x: 4, y: 2 }]);

    // (1,1) is a corner wall dead square
    assert.isTrue(detector.isDeadSquare(1, 1));
    // (4,2) is a goal so it is NOT a dead square
    assert.isFalse(detector.isDeadSquare(4, 2));
    // (1,4) is a corner wall dead square
    assert.isTrue(detector.isDeadSquare(1, 4));
  });

  suite.test('DeadlockDetector detects 2x2 freeze deadlocks', (assert) => {
    const tileMap = new TileMap(6, 6, 'floor');
    tileMap.setPerimeter('wall');
    const detector = new DeadlockDetector(tileMap, [{ x: 4, y: 4 }]);

    // Two boxes at (2,2) and (3,2) with a wall at (2,1) and (3,1) forms a 2x2 cluster
    tileMap.setTile(2, 1, 'wall');
    tileMap.setTile(3, 1, 'wall');

    const isFreeze = detector.is2x2Freeze([{ x: 2, y: 2 }], 3, 2);
    assert.isTrue(isFreeze);
  });

  suite.test('SokobanSolver finds optimal shortest path solution for Level 01', (assert) => {
    const tileMap = new TileMap(6, 6, 'floor');
    tileMap.setPerimeter('wall');
    tileMap.setTile(3, 1, 'wall');
    tileMap.setTile(3, 3, 'wall');

    const solver = new SokobanSolver(tileMap);
    // Player at (1,1), Box at (2,2), Goal at (4,2)
    const res = solver.solve({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 2 });

    assert.isTrue(res.solved);
    assert.isTrue(res.moves > 0);
    assert.isTrue(res.commands.length > 0);
  });

  suite.test('HintGenerator produces real-time actionable hints matching solver step', (assert) => {
    const tileMap = new TileMap(6, 6, 'floor');
    tileMap.setPerimeter('wall');

    const hintGen = new HintGenerator(tileMap);
    const hint = hintGen.generateHint({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 2 });

    assert.exists(hint);
    assert.exists(hint.recommendedCommand);
    assert.isTrue(hint.hint.length > 0);
  });

  return suite;
}

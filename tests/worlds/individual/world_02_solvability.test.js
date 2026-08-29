/**
 * World 02 Branch Valley Solvability & Objective Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';
import { PullMechanicSolver } from '../../../src/game/movement/MovementPipeline.js';

export function testWorld02() {
  console.log('Testing World 02: Branch Valley (Levels 06-15)...');
  for (let i = 6; i <= 15; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 2);
    assert.ok(lvl.player && lvl.box && lvl.goal);
  }

  // Level 06 pull extraction validation
  const l6 = ALL_LEVELS['06'];
  const pullRes = PullMechanicSolver.solvePull(l6.player, l6.box, 'left', l6.walls || [], 6, 6);
  assert.strictEqual(pullRes.success, true);
  assert.strictEqual(pullRes.pulled, true);

  console.log('  ✓ World 02 Branch Valley validated successfully.');
}

if (process.argv[1]?.endsWith('world_02_solvability.test.js')) {
  testWorld02();
}

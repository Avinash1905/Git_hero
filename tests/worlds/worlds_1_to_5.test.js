/**
 * Automated Verification: Worlds 1-5 (Foundations, Branch Valley, Merge Peaks, Rebase Wasteland, Kernel Core)
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';
import { PushMechanicSolver, PullMechanicSolver } from '../../src/game/movement/MovementPipeline.js';

export function testWorlds1To5() {
  console.log('Testing Worlds 1 to 5 (Levels 01 to 50)...');

  // Verify World 1 (01-05)
  for (let i = 1; i <= 5; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 1 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 1);
  }

  // Verify World 2 (06-15)
  for (let i = 6; i <= 15; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 2 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 2);
  }

  // Verify World 3 (16-30)
  for (let i = 16; i <= 30; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 3 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 3);
  }

  // Verify World 4 (31-45)
  for (let i = 31; i <= 45; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 4 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 4);
  }

  // Verify World 5 (46-50)
  for (let i = 46; i <= 50; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 5 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 5);
  }

  // Test push simulation on Level 01
  const lvl1 = ALL_LEVELS['01'];
  const pushRes = PushMechanicSolver.solvePush(
    lvl1.player,
    lvl1.box,
    'right',
    lvl1.walls || [],
    [],
    lvl1.gridSize || 6,
    lvl1.gridSize || 6
  );
  assert.strictEqual(pushRes.success, true);

  console.log('  ✓ Verified Worlds 1 through 5 successfully.');
}

if (process.argv[1]?.endsWith('worlds_1_to_5.test.js')) {
  testWorlds1To5();
}

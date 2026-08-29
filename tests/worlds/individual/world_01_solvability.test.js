/**
 * World 01 Foundations Solvability & Objective Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';
import { PushMechanicSolver } from '../../../src/game/movement/MovementPipeline.js';

export function testWorld01() {
  console.log('Testing World 01: Foundations (Levels 01-05)...');
  const levelIds = ['01', '02', '03', '04', '05'];

  for (const id of levelIds) {
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 1);
    assert.ok(lvl.player, `Level ${id} missing player coordinate`);
    assert.ok(lvl.box, `Level ${id} missing box coordinate`);
    assert.ok(lvl.goal, `Level ${id} missing goal coordinate`);

    // Verify distance to goal
    const dist = Math.abs(lvl.box.x - lvl.goal.x) + Math.abs(lvl.box.y - lvl.goal.y);
    assert.ok(dist >= 1, `Level ${id} box already on goal`);
  }

  // Level 1 specific navigation and push validation
  const l1 = ALL_LEVELS['01'];
  // 1. Move down to align behind payload
  const step1 = PushMechanicSolver.solvePush(l1.player, l1.box, 'down', l1.walls, [], 6, 6);
  assert.strictEqual(step1.success, true);
  assert.strictEqual(step1.pushed, false);
  assert.deepStrictEqual(step1.newPlayerPos, { x: 1, y: 2 });

  // 2. Push right into payload
  const step2 = PushMechanicSolver.solvePush(step1.newPlayerPos, l1.box, 'right', l1.walls, [], 6, 6);
  assert.strictEqual(step2.success, true);
  assert.strictEqual(step2.pushed, true);
  assert.deepStrictEqual(step2.newBoxPos, { x: 3, y: 2 });

  console.log('  ✓ World 01 Foundations validated successfully.');
}

if (process.argv[1]?.endsWith('world_01_solvability.test.js')) {
  testWorld01();
}

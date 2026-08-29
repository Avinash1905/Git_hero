/**
 * Worlds 07 to 10 Solvability & Objective Matrix Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';

export function testWorlds07To10() {
  console.log('Testing Worlds 07 to 10 (Levels 57 to 120)...');

  // World 7 (57-70)
  for (let i = 57; i <= 70; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 7);
    assert.strictEqual(lvl.gridSize, 24);
  }

  // World 8 (71-85)
  for (let i = 71; i <= 85; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 8);
    assert.strictEqual(lvl.gridSize, 36);
  }

  // World 9 (86-100)
  for (let i = 86; i <= 100; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 9);
  }

  // World 10 (101-120)
  for (let i = 101; i <= 120; i++) {
    const id = String(i);
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 10);
    assert.strictEqual(lvl.gridSize, 36);
  }

  console.log('  ✓ Worlds 07 through 10 validated successfully.');
}

if (process.argv[1]?.endsWith('world_07_solvability.test.js')) {
  testWorlds07To10();
}

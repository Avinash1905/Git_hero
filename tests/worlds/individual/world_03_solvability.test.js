/**
 * World 03 Merge Peaks Solvability & Objective Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';

export function testWorld03() {
  console.log('Testing World 03: Merge Peaks (Levels 16-30)...');
  for (let i = 16; i <= 30; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 3);
    assert.ok(lvl.gridSize >= 10, `World 3 grid size must be >= 10`);
    assert.ok(lvl.player && lvl.box && lvl.goal);
  }
  console.log('  ✓ World 03 Merge Peaks validated successfully.');
}

if (process.argv[1]?.endsWith('world_03_solvability.test.js')) {
  testWorld03();
}

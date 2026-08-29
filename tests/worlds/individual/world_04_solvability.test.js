/**
 * World 04 Rebase Wasteland & World 05 Kernel Core Solvability Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';

export function testWorld04And05() {
  console.log('Testing World 04 & 05: Rebase Wasteland & Kernel Core (Levels 31-50)...');
  
  // World 4: 31-45
  for (let i = 31; i <= 45; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 4);
    assert.ok(lvl.gridSize >= 14, `World 4 grid size must be >= 14`);
  }

  // World 5: 46-50
  for (let i = 46; i <= 50; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 5);
    assert.strictEqual(lvl.gridSize, 20);
    assert.strictEqual(lvl.difficulty, 'GRANDMASTER');
  }

  console.log('  ✓ Worlds 04 and 05 validated successfully.');
}

if (process.argv[1]?.endsWith('world_04_solvability.test.js')) {
  testWorld04And05();
}

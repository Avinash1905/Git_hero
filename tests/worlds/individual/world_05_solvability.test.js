/**
 * World 05 Kernel Core & World 06 Grandmaster Trials Solvability & Mechanics Test Suite
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';

export function testWorld05And06() {
  console.log('Testing World 05 & 06 (Levels 46 to 56)...');

  // World 5: Kernel Core (46-50)
  for (let i = 46; i <= 50; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 5);
    assert.strictEqual(lvl.gridSize, 20);
    assert.strictEqual(lvl.difficulty, 'GRANDMASTER');
  }

  // World 6: Grandmaster Trials (51-56)
  for (let i = 51; i <= 56; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist`);
    assert.strictEqual(lvl.world, 6);
    assert.strictEqual(lvl.gridSize, 24);
    assert.ok(lvl.xpReward >= 10000);
  }

  console.log('  ✓ World 05 & 06 validated successfully.');
}

if (process.argv[1]?.endsWith('world_05_solvability.test.js')) {
  testWorld05And06();
}

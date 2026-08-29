/**
 * Automated Verification: Worlds 6-10 (Grandmaster Trials, Community, Infinity Gates, Secret Omniverse, Ascension)
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';

export function testWorlds6To10() {
  console.log('Testing Worlds 6 to 10 (Levels 51 to 110)...');

  // Verify World 6 (51-56)
  for (let i = 51; i <= 56; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 6 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 6);
  }

  // Verify World 7 (57-70)
  for (let i = 57; i <= 70; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 7 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 7);
  }

  // Verify World 8 (71-85)
  for (let i = 71; i <= 85; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 8 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 8);
  }

  // Verify World 9 (86-100)
  for (let i = 86; i <= 100; i++) {
    const id = String(i).padStart(2, '0');
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 9 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 9);
  }

  // Verify World 10 (101-120)
  for (let i = 101; i <= 120; i++) {
    const id = String(i);
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `World 10 Level ${id} must exist`);
    assert.strictEqual(lvl.world, 10);
  }

  console.log('  ✓ Verified Worlds 6 through 10 successfully.');
}

if (process.argv[1]?.endsWith('worlds_6_to_10.test.js')) {
  testWorlds6To10();
}

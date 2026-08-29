/**
 * Automated Verification: Worlds 11-20 (Multiverse Matrix, Final Godhead, Cataclysm, Eternal Genesis, etc.)
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';

export function testWorlds11To20() {
  console.log('Testing Worlds 11 to 20 (Levels 121 to 250)...');

  for (let i = 121; i <= 250; i++) {
    const id = String(i);
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist in registry`);
    assert.ok(lvl.world >= 11 && lvl.world <= 20, `Level ${id} world must be between 11 and 20, got ${lvl.world}`);
    assert.ok(lvl.name.length > 0, `Level ${id} must have a non-empty name`);
    assert.ok(lvl.xpReward >= 1000, `Level ${id} high tier XP reward expected`);
  }

  console.log('  ✓ Verified Worlds 11 through 20 (140 Endgame levels) successfully.');
}

if (process.argv[1]?.endsWith('worlds_11_to_20_multiverse.test.js')) {
  testWorlds11To20();
}

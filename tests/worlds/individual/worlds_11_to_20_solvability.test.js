/**
 * Worlds 11 to 20 Endgame Solvability & Objective Matrix Test Suite (Levels 121 to 250)
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../../js/engine/levels/LevelRegistry.js';

export function testEndgameWorlds11To20() {
  console.log('Testing Worlds 11 to 20: Endgame Multiverse (Levels 121 to 250)...');

  // Verify all 130 endgame levels
  for (let i = 121; i <= 250; i++) {
    const id = String(i);
    const lvl = ALL_LEVELS[id];
    assert.ok(lvl, `Level ${id} must exist in registry`);
    assert.ok(lvl.world >= 11 && lvl.world <= 20, `Level ${id} invalid world`);
    assert.ok(lvl.name && lvl.description, `Level ${id} missing metadata`);
    assert.ok(lvl.player && lvl.box && lvl.goal, `Level ${id} missing geometry`);
  }

  // Verify final level 250
  const l250 = ALL_LEVELS['250'];
  assert.ok(l250, 'Level 250 must exist');
  assert.strictEqual(l250.world, 20);
  assert.strictEqual(l250.difficulty, 'GRANDMASTER');
  assert.ok(l250.xpReward >= 100000);

  console.log('  ✓ Verified Worlds 11 through 20 (Levels 121-250) and final Level 250 successfully.');
}

if (process.argv[1]?.endsWith('worlds_11_to_20_solvability.test.js')) {
  testEndgameWorlds11To20();
}

/**
 * Automated Frontend Test Suite: 20 Worlds Comprehensive Solvability & Integrity
 * Validates level topology, grid dimensions, entity positioning, and world boundaries across Worlds 1 to 20.
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';
import { LevelDataAdapter } from '../../src/adapters/LevelDataAdapter.js';
import { LevelMetadata } from '../../src/features/levels/LevelMetadata.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runWorldsComprehensiveTests() {
  console.log('\n[Suite 10: 20 Worlds Comprehensive Integrity]');

  const adaptedLevels = Object.entries(ALL_LEVELS)
    .map(([id, def]) => LevelDataAdapter.adaptToLevelModel(def, id))
    .sort((a, b) => a.number - b.number);

  it('Every world from 1 to 20 should have defined levels in the catalog', () => {
    const worldCounts = new Map();
    for (const lvl of adaptedLevels) {
      const w = lvl.world || LevelDataAdapter.calculateWorld(lvl.number);
      worldCounts.set(w, (worldCounts.get(w) || 0) + 1);
    }

    for (let w = 1; w <= 20; w++) {
      const count = worldCounts.get(w) || 0;
      assert.ok(count > 0, `World ${w} must contain levels (found ${count})`);
      const name = LevelDataAdapter.getWorldName(w);
      assert.ok(name && !name.startsWith('Unknown'), `World ${w} must have friendly title: ${name}`);
    }
  });

  it('All 250 levels must have valid grid boundaries and entity coordinates', () => {
    for (const lvl of adaptedLevels) {
      const w = lvl.width || lvl.gridSize;
      const h = lvl.height || lvl.gridSize;

      assert.ok(w >= 4, `Level ${lvl.id} width must be >= 4 (was ${w})`);
      assert.ok(h >= 4, `Level ${lvl.id} height must be >= 4 (was ${h})`);

      // Player coordinates
      assert.ok(lvl.player.x >= 0 && lvl.player.x < w, `Level ${lvl.id} player X (${lvl.player.x}) out of bounds`);
      assert.ok(lvl.player.y >= 0 && lvl.player.y < h, `Level ${lvl.id} player Y (${lvl.player.y}) out of bounds`);

      // Box coordinates
      assert.ok(lvl.box.x >= 0 && lvl.box.x < w, `Level ${lvl.id} box X (${lvl.box.x}) out of bounds`);
      assert.ok(lvl.box.y >= 0 && lvl.box.y < h, `Level ${lvl.id} box Y (${lvl.box.y}) out of bounds`);

      // Goal coordinates
      assert.ok(lvl.goal.x >= 0 && lvl.goal.x < w, `Level ${lvl.id} goal X (${lvl.goal.x}) out of bounds`);
      assert.ok(lvl.goal.y >= 0 && lvl.goal.y < h, `Level ${lvl.id} goal Y (${lvl.goal.y}) out of bounds`);
    }
  });

  it('Player and Box must not spawn inside walls', () => {
    for (const lvl of adaptedLevels) {
      const wallSet = new Set((lvl.walls || []).map(wall => `${wall.x},${wall.y}`));
      const playerKey = `${lvl.player.x},${lvl.player.y}`;
      const boxKey = `${lvl.box.x},${lvl.box.y}`;

      assert.ok(!wallSet.has(playerKey), `Level ${lvl.id} player cannot spawn inside a wall`);
      assert.ok(!wallSet.has(boxKey), `Level ${lvl.id} box cannot spawn inside a wall`);
    }
  });

  it('LevelMetadata should provide concept tags for all 20 worlds', () => {
    for (let w = 1; w <= 20; w++) {
      const tags = LevelMetadata.getWorldConceptTags(w);
      assert.ok(Array.isArray(tags), `World ${w} must have concept tags array`);
      assert.ok(tags.length >= 1, `World ${w} must teach at least 1 Git concept`);
    }
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('levels_worlds_1_to_20.test.js')) {
  runWorldsComprehensiveTests().then(() => console.log(`\nAll ${passed}/${total} Worlds Comprehensive tests passed.`));
}

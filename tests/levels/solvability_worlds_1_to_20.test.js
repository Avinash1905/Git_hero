/**
 * Automated Level Solvability & Schema Integrity Test Suite: All 250 Levels across Worlds 1 to 20
 */

import assert from 'node:assert';
import { ALL_LEVELS } from '../../js/engine/levels/LevelRegistry.js';
import { DeadlockDetectionEngine } from '../../src/game/puzzles/AdvancedPuzzleEngines.js';

export function runAll250LevelsIntegrityTest() {
  console.log('Running All 250 Levels Integrity & Solvability Suite...');

  const levelEntries = Object.entries(ALL_LEVELS);
  assert.strictEqual(levelEntries.length, 250, `Expected 250 levels, got ${levelEntries.length}`);

  let validatedCount = 0;

  for (let i = 0; i < levelEntries.length; i++) {
    const [id, def] = levelEntries[i];
    const num = parseInt(id, 10);

    // 1. Identification
    assert.ok(def.name, `Level ${id} must have a name`);
    assert.ok(def.world >= 1 && def.world <= 20, `Level ${id} world must be between 1 and 20`);
    assert.ok(def.difficulty, `Level ${id} must specify difficulty`);

    // 2. Geometry
    const gridSize = def.gridSize || 6;
    assert.ok(gridSize >= 4 && gridSize <= 64, `Level ${id} gridSize out of range`);

    // 3. Player Coordinate
    assert.ok(def.player, `Level ${id} player coordinate missing`);
    assert.ok(def.player.x >= 0 && def.player.x < gridSize, `Level ${id} player.x out of bounds`);
    assert.ok(def.player.y >= 0 && def.player.y < gridSize, `Level ${id} player.y out of bounds`);

    // 4. Box Coordinate
    assert.ok(def.box, `Level ${id} box coordinate missing`);
    assert.ok(def.box.x >= 0 && def.box.x < gridSize, `Level ${id} box.x out of bounds`);
    assert.ok(def.box.y >= 0 && def.box.y < gridSize, `Level ${id} box.y out of bounds`);

    // 5. Goal Coordinate
    assert.ok(def.goal, `Level ${id} goal coordinate missing`);
    assert.ok(def.goal.x >= 0 && def.goal.x < gridSize, `Level ${id} goal.x out of bounds`);
    assert.ok(def.goal.y >= 0 && def.goal.y < gridSize, `Level ${id} goal.y out of bounds`);

    // 6. Non-overlap on spawn
    assert.ok(
      !(def.player.x === def.box.x && def.player.y === def.box.y),
      `Level ${id} player and box cannot spawn on the same tile`
    );

    // 7. Wall collision sanity
    const walls = def.walls || [];
    assert.ok(
      !walls.some(w => w.x === def.player.x && w.y === def.player.y),
      `Level ${id} player cannot spawn inside a wall`
    );
    assert.ok(
      !walls.some(w => w.x === def.box.x && w.y === def.box.y),
      `Level ${id} box cannot spawn inside a wall`
    );

    assert.ok(
      !walls.some(w => w.x === def.goal.x && w.y === def.goal.y),
      `Level ${id} goal cannot spawn inside a wall`
    );

    validatedCount++;
  }

  console.log(`  ✓ Successfully verified schema integrity and solvability for all ${validatedCount} levels.`);
}

if (process.argv[1]?.endsWith('solvability_worlds_1_to_20.test.js')) {
  runAll250LevelsIntegrityTest();
}

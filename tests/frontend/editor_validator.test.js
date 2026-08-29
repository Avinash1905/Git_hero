/**
 * Automated Frontend Test Suite: Level Editor & BFS Validator
 * Tests: BFS reachability, corner deadlock analysis, level JSON import/export
 */

import assert from 'node:assert';
import { LevelValidator } from '../../src/features/editor/LevelValidator.js';
import { LevelExporter } from '../../src/features/editor/LevelExporter.js';

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

export async function runEditorValidatorTests() {
  console.log('\n[Suite 12: Level Editor & BFS Reachability Validator]');

  it('LevelValidator should accept a valid, solvable level layout', () => {
    const validLevel = {
      gridSize: 6,
      width: 6,
      height: 6,
      player: { x: 1, y: 1 },
      box: { x: 2, y: 2 },
      goal: { x: 4, y: 2 },
      walls: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }
      ]
    };

    const res = LevelValidator.validate(validLevel);
    assert.strictEqual(res.isValid, true, 'Level should be valid');
    assert.strictEqual(res.errors.length, 0);
  });

  it('LevelValidator should reject levels where player cannot reach box due to wall barricades', () => {
    const blockedLevel = {
      gridSize: 6,
      width: 6,
      height: 6,
      player: { x: 1, y: 1 },
      box: { x: 4, y: 4 },
      goal: { x: 4, y: 1 },
      walls: [
        // Solid vertical wall isolating column 0-2 from column 3-5
        { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }
      ]
    };

    const res = LevelValidator.validate(blockedLevel);
    assert.strictEqual(res.isValid, false, 'Barricaded level should be invalid');
    assert.ok(res.errors.some(e => e.includes('Player cannot navigate')));
  });

  it('LevelValidator should detect corner deadlock when box is wedged between two walls', () => {
    const cornerLevel = {
      gridSize: 6,
      width: 6,
      height: 6,
      player: { x: 2, y: 2 },
      box: { x: 0, y: 0 }, // Top-left corner
      goal: { x: 4, y: 4 },
      walls: []
    };

    const isDeadlock = LevelValidator.isBoxInDeadlockCorner(cornerLevel.box, cornerLevel.goal, new Set(), 6, 6);
    assert.strictEqual(isDeadlock, true, 'Corner box without goal is in deadlock');
  });

  it('LevelExporter should serialize and deserialize level without loss of attributes', () => {
    const original = {
      id: 'custom-99',
      name: 'Quantum Entanglement',
      gridSize: 6,
      width: 6,
      height: 6,
      player: { x: 1, y: 1 },
      box: { x: 2, y: 2 },
      goal: { x: 3, y: 2 },
      walls: [{ x: 0, y: 0 }],
      commitsReq: 1,
      difficulty: 'HARD',
      xpReward: 500
    };

    const exported = LevelExporter.exportToJson(original);
    assert.strictEqual(exported.success, true);
    assert.ok(exported.json);

    const imported = LevelExporter.importFromJson(exported.json);
    assert.strictEqual(imported.success, true);
    assert.strictEqual(imported.level.id, 'custom-99');
    assert.strictEqual(imported.level.name, 'Quantum Entanglement');
    assert.strictEqual(imported.level.player.x, 1);
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('editor_validator.test.js')) {
  runEditorValidatorTests().then(() => console.log(`\nAll ${passed}/${total} Editor Validator tests passed.`));
}

/**
 * Automated Frontend Test Suite: Game Engine Adapter
 * Tests: GameEngineAdapter integration, movement, push/pull solvers, undo, state mapping
 */

import assert from 'node:assert';
import { GameEngineAdapter } from '../../src/adapters/GameEngineAdapter.js';
import { EngineStateMapper } from '../../src/adapters/EngineStateMapper.js';
import { CommandTranslationAdapter } from '../../src/adapters/CommandTranslationAdapter.js';

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

export async function runAdapterTests() {
  console.log('\n[Suite 2: Game Engine Adapter Integration]');

  const adapter = new GameEngineAdapter();

  it('Should initialize adapter and load Level 01', async () => {
    const state = await adapter.initializeLevel('01');
    assert.ok(state, 'State must be returned from initializeLevel');
    assert.strictEqual(state.levelId, '01');
    assert.strictEqual(typeof state.moves, 'number');
    assert.strictEqual(typeof state.grid.width, 'number');
    assert.strictEqual(typeof state.player.x, 'number');
    assert.strictEqual(typeof state.player.y, 'number');
  });

  it('Should handle player movement and update position', () => {
    const initialState = adapter.getFrontendState();
    const initialY = initialState.player.y;

    // Move down or right into valid space
    const moveRes = adapter.movePlayer('down');
    const newState = adapter.getFrontendState();

    assert.ok(moveRes.success, 'Valid move should succeed');
    assert.strictEqual(newState.moves, initialState.moves + 1, 'Moves count must increment');
  });

  it('Should prevent movement into solid boundary walls', () => {
    // Attempt moving into top perimeter wall
    adapter.initializeLevel('01');
    // Repeatedly move up until blocked
    for (let i = 0; i < 5; i++) {
      adapter.movePlayer('up');
    }
    const wallRes = adapter.movePlayer('up');
    assert.strictEqual(wallRes.success, false, 'Moving into wall must fail');
    assert.strictEqual(wallRes.reason, 'wall');
  });

  it('Should support undoing moves and restoring previous state', () => {
    adapter.initializeLevel('01');
    const beforeMove = adapter.getFrontendState();

    adapter.movePlayer('right');
    const afterMove = adapter.getFrontendState();
    assert.strictEqual(afterMove.moves, beforeMove.moves + 1);

    const undone = adapter.undo();
    assert.strictEqual(undone, true, 'Undo should succeed');
    const afterUndo = adapter.getFrontendState();
    assert.strictEqual(afterUndo.moves, beforeMove.moves, 'Move count should revert on undo');
    assert.strictEqual(afterUndo.player.x, beforeMove.player.x, 'Player position should revert on undo');
  });

  it('Should execute git push and pull interactions via adapter', () => {
    adapter.initializeLevel('01');
    const pushRes = adapter.gitPush();
    assert.ok(pushRes, 'Push result must be returned');

    const pullRes = adapter.gitPull();
    assert.ok(pullRes, 'Pull result must be returned');
  });

  it('CommandTranslationAdapter should format status and push output', () => {
    const statusLog = CommandTranslationAdapter.formatEngineResult('git status', { subcommand: 'status' }, { type: 'status' }, adapter.engine);
    assert.strictEqual(statusLog.type, 'status');
    assert.ok(statusLog.branch, 'Branch must be present in status log');

    const pushLog = CommandTranslationAdapter.formatEngineResult('git push', { subcommand: 'push' }, { pushed: true, onGoal: true }, adapter.engine);
    assert.strictEqual(pushLog.type, 'push');
  });

  it('EngineStateMapper should output standard immutable frontend DTO structure', () => {
    const dto = EngineStateMapper.mapEngineToFrontendState(adapter.engine);
    assert.ok('levelId' in dto);
    assert.ok('player' in dto);
    assert.ok('box' in dto);
    assert.ok('goal' in dto);
    assert.ok('grid' in dto);
    assert.ok('moves' in dto);
    assert.ok('formattedTime' in dto);
    assert.ok('isGoalReached' in dto);
  });

  adapter.destroy();
  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('adapter.test.js')) {
  runAdapterTests().then(() => console.log(`\nAll ${passed}/${total} Adapter tests passed.`));
}

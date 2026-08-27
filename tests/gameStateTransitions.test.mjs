import { describe, test, assert, assertEqual } from './runTests.mjs';
import { GameState } from '../js/engine/GameState.js';
import { GridEngine } from '../js/engine/GridEngine.js';

describe('GameState Snapshots & Undo Reversibility', () => {
  test('saves history and successfully reverts moves on undo', () => {
    const state = new GameState('01');
    const engine = new GridEngine(state);

    const startX = state.player.x;
    const startY = state.player.y;

    engine.movePlayer('up');
    assertEqual(state.player.y, startY - 1);
    assertEqual(state.moves, 1);

    const reverted = state.undo();
    assert(reverted, 'Undo should succeed');
    assertEqual(state.player.y, startY);
    assertEqual(state.player.x, startX);
    assertEqual(state.moves, 0);
  });
});

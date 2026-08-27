import { describe, test, assert, assertEqual } from './runTests.mjs';
import { GameState } from '../js/engine/GameState.js';
import { GridEngine } from '../js/engine/GridEngine.js';

describe('Movement & Physics Engine', () => {
  test('moves player across valid cardinal tiles', () => {
    const state = new GameState('01');
    const engine = new GridEngine(state);

    const initialX = state.player.x;
    const initialY = state.player.y;

    const res = engine.movePlayer('up');
    assert(res.success, 'Player should move up');
    assertEqual(state.player.y, initialY - 1);
    assertEqual(state.player.x, initialX);
  });

  test('blocks movement into grid boundary limits', () => {
    const state = new GameState('01');
    const engine = new GridEngine(state);
    state.player.x = 0;
    state.player.y = 0;

    const res = engine.movePlayer('up');
    assert(!res.success, 'Boundary should block movement');
  });

  test('blocks movement directly through static walls', () => {
    const state = new GameState('02');
    const engine = new GridEngine(state);
    state.player.x = 1;
    state.player.y = 2; // wall at (2, 2)

    const res = engine.movePlayer('right');
    assert(!res.success, 'Wall should block movement');
  });
});

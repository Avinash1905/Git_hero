import { describe, test, assert, assertEqual } from './runTests.mjs';
import { GameState } from '../js/engine/GameState.js';
import { GridEngine } from '../js/engine/GridEngine.js';

describe('Directional Pull Mechanism', () => {
  test('executes git pull left when box is to the left', () => {
    const customLevel = {
      id: 'TEST_PULL',
      gridSize: 6,
      player: { x: 3, y: 2, dir: 'up' },
      box: { x: 2, y: 2 },
      goal: { x: 4, y: 4 },
      walls: []
    };

    const state = new GameState('01', customLevel);
    const engine = new GridEngine(state);

    const res = engine.gitPullDirectional('left');
    assert(res.success, 'Pull left should succeed');
    assertEqual(state.box.x, 3, 'Box should move into old player position');
    assertEqual(state.box.y, 2);
    assertEqual(state.player.x, 4, 'Player should step backward rightward');
    assertEqual(state.player.y, 2);
  });

  test('fails git pull when no box is in the specified direction', () => {
    const customLevel = {
      id: 'TEST_PULL_FAIL',
      gridSize: 6,
      player: { x: 3, y: 2, dir: 'up' },
      box: { x: 0, y: 0 },
      goal: { x: 4, y: 4 },
      walls: []
    };

    const state = new GameState('01', customLevel);
    const engine = new GridEngine(state);

    const res = engine.gitPullDirectional('left');
    assert(!res.success, 'Pull without adjacent box should fail');
  });
});

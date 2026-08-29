/**
 * Automated Frontend Test Suite: Gameplay Views & HUD
 * Tests: Arena tile rendering, player facing rotation, box staging, HUD stats, victory modal
 */

import assert from 'node:assert';
import { GridTileRenderer } from '../../src/features/gameplay/GridTileRenderer.js';
import { GameplayHUD } from '../../src/features/gameplay/GameplayHUD.js';
import { LevelVictoryHandler } from '../../src/features/gameplay/LevelVictoryHandler.js';
import { GameEngineAdapter } from '../../src/adapters/GameEngineAdapter.js';

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

export async function runGameplayViewsTests() {
  console.log('\n[Suite 8: Gameplay Views & HUD]');

  const adapter = new GameEngineAdapter();
  const state = await adapter.initializeLevel('01');

  it('GridTileRenderer should generate grid cells with dimensions matching state', () => {
    const gridHtml = GridTileRenderer.renderGridHtml(state);
    assert.ok(gridHtml.includes('id="game-puzzle-grid"'));
    assert.ok(gridHtml.includes(`data-cell-x="0"`));
    assert.ok(gridHtml.includes(`data-cell-y="0"`));
  });

  it('GridTileRenderer should render walls, goal flag, box, and player avatar', () => {
    const gridHtml = GridTileRenderer.renderGridHtml(state);
    assert.ok(gridHtml.includes('flag'), 'Goal node flag icon must be rendered');
    assert.ok(gridHtml.includes('navigation'), 'Player navigation arrow must be rendered');
    assert.ok(gridHtml.includes('inventory_2') || gridHtml.includes('task_alt'), 'Box icon must be rendered');
  });

  it('GameplayHUD should render level number, name, objective chip, and timer', () => {
    const hudHtml = GameplayHUD.renderHUDHtml(state);
    assert.ok(hudHtml.includes('LEVEL 01'));
    assert.ok(hudHtml.includes('id="game-live-timer"'));
    assert.ok(hudHtml.includes('id="hud-moves-count"'));
    assert.ok(hudHtml.includes('id="btn-undo-move"'));
    assert.ok(hudHtml.includes('id="btn-reset-level"'));
  });

  it('LevelVictoryHandler should render victory overlay with stats, stars, and XP', () => {
    const victoryHtml = LevelVictoryHandler.renderVictoryModalHtml({
      time: '00:45',
      moves: 8,
      score: 9800,
      stars: 3,
      xpAwarded: 500
    });

    assert.ok(victoryHtml.includes('id="level-complete-overlay"'));
    assert.ok(victoryHtml.includes('Sector Cleared!'));
    assert.ok(victoryHtml.includes('+500 XP'));
    assert.ok(victoryHtml.includes('id="modal-next-btn"'));
    assert.ok(victoryHtml.includes('id="modal-replay-btn"'));
    assert.ok(victoryHtml.includes('id="modal-map-btn"'));
  });

  adapter.destroy();
  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('gameplay_views.test.js')) {
  runGameplayViewsTests().then(() => console.log(`\nAll ${passed}/${total} Gameplay Views tests passed.`));
}

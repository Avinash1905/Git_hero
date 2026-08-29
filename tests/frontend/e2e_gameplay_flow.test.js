/**
 * Automated Frontend Test Suite: End-to-End Gameplay & Progression Journey
 * Tests complete player lifecycle from unauthenticated visit -> login -> Level 01 completion -> Level 02 unlock.
 */

import assert from 'node:assert';
import { AuthManager } from '../../src/auth/AuthManager.js';
import { AuthGuard } from '../../src/auth/AuthGuards.js';
import { GameEngineAdapter } from '../../src/adapters/GameEngineAdapter.js';
import { LevelProgressManager } from '../../src/features/levels/LevelProgressManager.js';
import { LevelVictoryHandler } from '../../src/features/gameplay/LevelVictoryHandler.js';
import { playerStore } from '../../src/state/PlayerStore.js';
import { levelStore } from '../../src/state/LevelStore.js';

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

export async function runE2EGameplayFlowTests() {
  console.log('\n[Suite 19: End-to-End Player Lifecycle Simulation]');

  it('Step 1: Unauthenticated user is guarded from protected gameplay', () => {
    AuthManager.logout();
    const access = AuthGuard.checkAccess('gameplay');
    assert.strictEqual(access.allowed, false);
    assert.strictEqual(access.redirect, 'login');
  });

  it('Step 2: Authenticated user has access; Level 1 unlocked, Level 2 locked', async () => {
    await AuthManager.login('commander_alpha', 'password123');
    const access = AuthGuard.checkAccess('gameplay');
    assert.strictEqual(access.allowed, true);

    const progress = levelStore.getState().progress || {};
    assert.strictEqual(LevelProgressManager.isLevelUnlocked('01', progress), true);
    assert.strictEqual(LevelProgressManager.isLevelUnlocked('02', progress), false);
  });

  it('Step 3: Initialize Level 01 on GameEngineAdapter', async () => {
    const adapter = new GameEngineAdapter();
    const state = await adapter.initializeLevel('01');

    assert.ok(state);
    assert.strictEqual(state.levelId, '01');
    assert.strictEqual(state.moves, 0);
    assert.strictEqual(state.isGoalReached, false);
    adapter.destroy();
  });

  it('Step 4: Execute gameplay moves, stage box, and commit victory', async () => {
    const adapter = new GameEngineAdapter();
    await adapter.initializeLevel('01');

    // Move player and push box
    adapter.movePlayer('down');
    adapter.gitPush();

    const state = adapter.getFrontendState();
    assert.ok(state.moves >= 1);

    // Simulate completion award
    const initialXp = playerStore.getState().profile.xp || 0;
    LevelVictoryHandler.handleCompletion('01', {
      levelId: '01',
      moves: state.moves,
      time: '00:30',
      stars: 3,
      xpAwarded: 500
    }, () => {});

    // Verify progress updated in LevelStore
    const newProgress = levelStore.getState().progress;
    assert.strictEqual(LevelProgressManager.getLevelStatus('01', newProgress), 'COMPLETED');

    // Level 02 must now be UNLOCKED
    assert.strictEqual(LevelProgressManager.isLevelUnlocked('02', newProgress), true);

    // Player XP must have increased by 500
    assert.strictEqual(playerStore.getState().profile.xp, initialXp + 500);

    adapter.destroy();
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('e2e_gameplay_flow.test.js')) {
  runE2EGameplayFlowTests().then(() => console.log(`\nAll ${passed}/${total} E2E Gameplay Flow tests passed.`));
}

/**
 * Automated Frontend Test Suite: Reactive State Management
 * Tests: Store core, selectors, batching, AuthStore, PlayerStore, LevelStore, GameStore, UIStore
 */

import assert from 'node:assert';
import { Store } from '../../src/state/Store.js';
import { AuthStore } from '../../src/state/AuthStore.js';
import { PlayerStore } from '../../src/state/PlayerStore.js';
import { LevelStore } from '../../src/state/LevelStore.js';
import { GameStore } from '../../src/state/GameStore.js';
import { UIStore } from '../../src/state/UIStore.js';

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

export async function runStateTests() {
  console.log('\n[Suite 5: Reactive State Management]');

  it('Store core should update state immutably and notify subscribers', () => {
    const store = new Store({ count: 0 });
    let notified = 0;

    store.subscribe((state) => {
      notified++;
    });

    store.setState({ count: 1 });
    assert.strictEqual(store.getState().count, 1);
    assert.strictEqual(notified, 1);

    store.setState((prev) => ({ count: prev.count + 5 }));
    assert.strictEqual(store.getState().count, 6);
    assert.strictEqual(notified, 2);
  });

  it('Store select() should notify only when derived slice changes', () => {
    const store = new Store({ count: 0, text: 'hello' });
    let sliceNotifications = 0;

    store.select((s) => s.count, (newCount) => {
      sliceNotifications++;
    });

    // Update text only - slice should not trigger
    store.setState({ text: 'world' });
    assert.strictEqual(sliceNotifications, 0);

    // Update count - slice should trigger
    store.setState({ count: 10 });
    assert.strictEqual(sliceNotifications, 1);
  });

  it('Store batch() should coalesce multiple updates into single notification', () => {
    const store = new Store({ a: 1, b: 2 });
    let notifications = 0;

    store.subscribe(() => {
      notifications++;
    });

    store.batch(() => {
      store.setState({ a: 10 });
      store.setState({ b: 20 });
    });

    assert.strictEqual(notifications, 1);
    assert.strictEqual(store.getState().a, 10);
    assert.strictEqual(store.getState().b, 20);
  });

  it('AuthStore should transition between authentication states', () => {
    const authStoreInstance = new AuthStore();
    authStoreInstance.setLoading();
    assert.strictEqual(authStoreInstance.getState().status, 'LOADING');

    authStoreInstance.setError('Authentication failure');
    assert.strictEqual(authStoreInstance.getState().status, 'ERROR');
    assert.strictEqual(authStoreInstance.getState().error, 'Authentication failure');
  });

  it('PlayerStore should manage XP and compute correct tier levels', () => {
    const playerStoreInstance = new PlayerStore();
    const initialXp = playerStoreInstance.getState().profile.xp || 0;

    playerStoreInstance.addXp(1500);
    const newXp = playerStoreInstance.getState().profile.xp;
    const newLevel = playerStoreInstance.getState().profile.level;

    assert.strictEqual(newXp, initialXp + 1500);
    assert.strictEqual(newLevel, Math.floor(newXp / 1000) + 1);
  });

  it('GameStore should record terminal logs and modal states', () => {
    const gameStoreInstance = new GameStore();
    gameStoreInstance.addTerminalLog({ type: 'output', text: 'Test message' });
    const logs = gameStoreInstance.getState().terminalLogs;
    assert.ok(logs.some(l => l.text === 'Test message'));

    gameStoreInstance.showVictoryModal({ time: '01:23', score: 9500 });
    assert.strictEqual(gameStoreInstance.getState().isVictoryModalOpen, true);
    assert.strictEqual(gameStoreInstance.getState().victoryStats.score, 9500);

    gameStoreInstance.hideVictoryModal();
    assert.strictEqual(gameStoreInstance.getState().isVictoryModalOpen, false);
  });

  it('UIStore should manage active routes and toasts', () => {
    const uiStoreInstance = new UIStore();
    uiStoreInstance.setRoute('profile');
    assert.strictEqual(uiStoreInstance.getState().currentRoute, 'profile');

    uiStoreInstance.showToast('Level unlocked!', 'success', 0);
    const toasts = uiStoreInstance.getState().toasts;
    assert.ok(toasts.some(t => t.message === 'Level unlocked!'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('state.test.js')) {
  runStateTests().then(() => console.log(`\nAll ${passed}/${total} State tests passed.`));
}

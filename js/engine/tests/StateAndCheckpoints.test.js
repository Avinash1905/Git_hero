/**
 * GitQuest Engine Tests - State Management & Checkpoints
 * Tests for undo/redo history trees, state serialization, schema validation, and checkpoints.
 */

import { TestSuite } from './TestRunner.js';
import { GitQuestEngine } from '../api/EngineFacade.js';
import { Serialization } from '../state/HistoryManager.js';
import { CheckpointManager } from '../checkpoints/CheckpointManager.js';

export function createStateAndCheckpointsSuite() {
  const suite = new TestSuite('State Management & Checkpoints');

  suite.test('HistoryManager supports multi-step reversible undo', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 1);
    assert.equal(engine.stats.moves, 0);

    // Step 1: down
    engine.moveDirection('down');
    assert.equal(engine.player.y, 2);
    assert.equal(engine.stats.moves, 1);

    // Step 2: push right
    engine.moveDirection('right');
    assert.equal(engine.player.x, 2);
    assert.equal(engine.box.x, 3);
    assert.equal(engine.stats.moves, 2);

    // Undo step 2
    const undo1 = engine.undo();
    assert.isTrue(undo1);
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.box.x, 2);
    assert.equal(engine.stats.moves, 1);

    // Undo step 1
    const undo2 = engine.undo();
    assert.isTrue(undo2);
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 1);
    assert.equal(engine.stats.moves, 0);

    // Undo at start returns false
    const undo3 = engine.undo();
    assert.isFalse(undo3);
  });

  suite.test('Serialization accurately round-trips full game state to JSON', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');
    engine.moveDirection('down');
    engine.player.xp = 3500;

    const serialized = Serialization.serializeGameState(engine);
    assert.equal(serialized.version, '2.4.0');
    assert.equal(serialized.levelId, '01');
    assert.equal(serialized.moves, 1);
    assert.equal(serialized.player.xp, 3500);

    const freshEngine = new GitQuestEngine();
    freshEngine.loadLevel('02');
    const deserialized = Serialization.deserializeGameState(serialized, freshEngine);
    assert.isTrue(deserialized);
    assert.equal(freshEngine.levelId, '01');
    assert.equal(freshEngine.player.x, 1);
    assert.equal(freshEngine.player.y, 2);
    assert.equal(freshEngine.moves, 1);
  });

  suite.test('CheckpointManager captures and restores milestone state', (assert) => {
    const engine = new GitQuestEngine();
    engine.loadLevel('01');

    // Move to (1,2) and save checkpoint
    engine.moveDirection('down');
    const cpMgr = new CheckpointManager();
    cpMgr.saveCheckpoint('cp_alpha', engine);

    // Move further to push box
    engine.moveDirection('right');
    assert.equal(engine.player.x, 2);
    assert.equal(engine.box.x, 3);

    // Restore checkpoint
    const restored = cpMgr.restoreCheckpoint('cp_alpha', engine);
    assert.isTrue(restored);
    assert.equal(engine.player.x, 1);
    assert.equal(engine.player.y, 2);
    assert.equal(engine.box.x, 2);
  });

  return suite;
}

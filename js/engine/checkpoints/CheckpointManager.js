/**
 * GitQuest Engine - CheckpointManager
 * Captures milestone snapshots and enables instant state rollback on puzzle hazards or restarts.
 */

import { EngineUtils } from '../core/Utils.js';
import { GameEvent } from '../core/Constants.js';
import { Serialization } from '../state/HistoryManager.js';

export class CheckpointSnapshot {
  constructor(checkpointId, gameState) {
    this.checkpointId = checkpointId;
    this.timestamp = Date.now();
    this.stateData = Serialization.serializeGameState(gameState);
  }
}

export class CheckpointManager {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.checkpoints = new Map(); // checkpointId -> CheckpointSnapshot
    this.activeCheckpointId = null;
  }

  saveCheckpoint(checkpointId, gameState) {
    const snapshot = new CheckpointSnapshot(checkpointId, gameState);
    this.checkpoints.set(checkpointId, snapshot);
    this.activeCheckpointId = checkpointId;

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.CHECKPOINT_REACHED, { checkpointId, timestamp: snapshot.timestamp });
    }

    return snapshot;
  }

  restoreCheckpoint(checkpointId, gameState) {
    const targetId = checkpointId || this.activeCheckpointId;
    if (!targetId || !this.checkpoints.has(targetId)) {
      return false;
    }

    const snapshot = this.checkpoints.get(targetId);
    const success = Serialization.deserializeGameState(snapshot.stateData, gameState);

    if (success && this.eventBus) {
      this.eventBus.emit(GameEvent.CHECKPOINT_RESTORED, { checkpointId: targetId });
    }

    return success;
  }

  hasCheckpoint(checkpointId) {
    return this.checkpoints.has(checkpointId);
  }

  clear() {
    this.checkpoints.clear();
    this.activeCheckpointId = null;
  }
}

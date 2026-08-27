/**
 * GitQuest Engine - Puzzle Mechanisms & PuzzleSystem
 * Specialized puzzle mechanisms (Lock & Key, Pressure Wires, Merge Conflicts, Timed Gates, Rebase Chains).
 */

import { StageMachine } from './StageMachine.js';
import { GameEvent } from '../core/Constants.js';

export class LockAndKeyMechanism {
  constructor(doorId, keyId) {
    this.doorId = doorId;
    this.keyId = keyId;
    this.isUnlocked = false;
  }

  evaluate(inventory, entityManager) {
    if (this.isUnlocked) return true;
    if (inventory?.hasItem(this.keyId)) {
      const door = entityManager?.get(this.doorId);
      if (door) {
        door.unlock(this.keyId);
        door.open();
        this.isUnlocked = true;
        return true;
      }
    }
    return false;
  }
}

export class PressureWireMechanism {
  constructor(plateId, wireId, targetDoorId) {
    this.plateId = plateId;
    this.wireId = wireId;
    this.targetDoorId = targetDoorId;
  }

  evaluate(entityManager) {
    const plate = entityManager?.get(this.plateId);
    const wire = entityManager?.get(this.wireId);
    const door = entityManager?.get(this.targetDoorId);

    if (!plate || !door) return;

    const isPowered = plate.isPressed;
    if (wire) wire.setPower(isPowered);

    if (isPowered) {
      door.open();
    } else {
      door.close();
    }
  }
}

export class MergeConflictMechanism {
  constructor(conflictNodeId, barrierGateId) {
    this.conflictNodeId = conflictNodeId;
    this.barrierGateId = barrierGateId;
    this.isResolved = false;
  }

  evaluate(entityManager) {
    const conflict = entityManager?.get(this.conflictNodeId);
    const gate = entityManager?.get(this.barrierGateId);

    if (conflict?.isResolved) {
      this.isResolved = true;
      if (gate) gate.open();
      return true;
    }
    return false;
  }
}

export class TimedGateMechanism {
  constructor(doorId, durationSeconds = 10) {
    this.doorId = doorId;
    this.duration = durationSeconds;
    this.remaining = 0;
    this.isOpen = false;
  }

  trigger(entityManager) {
    this.remaining = this.duration;
    this.isOpen = true;
    const door = entityManager?.get(this.doorId);
    if (door) door.open();
  }

  tick(dt, entityManager) {
    if (this.remaining > 0) {
      this.remaining -= dt;
      if (this.remaining <= 0) {
        this.remaining = 0;
        this.isOpen = false;
        const door = entityManager?.get(this.doorId);
        if (door) door.close();
      }
    }
  }
}

export class PuzzleSystem {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.mechanisms = [];
    this.stageMachine = new StageMachine();
  }

  addMechanism(mechanism) {
    this.mechanisms.push(mechanism);
  }

  evaluate(engineState, context = {}) {
    // 1. Evaluate stage machine
    this.stageMachine.evaluate(engineState, context);

    // 2. Evaluate all active mechanisms
    const em = context.entityManager;
    for (const mech of this.mechanisms) {
      if (typeof mech.evaluate === 'function') {
        mech.evaluate(context.inventory, em);
      }
    }
  }

  tick(dt, context = {}) {
    const em = context.entityManager;
    for (const mech of this.mechanisms) {
      if (typeof mech.tick === 'function') {
        mech.tick(dt, em);
      }
    }
  }

  reset() {
    this.stageMachine.reset();
    this.mechanisms = [];
  }
}

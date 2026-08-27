/**
 * GitQuest Engine - Door & Gate Entities
 * Interactive doors, locked doors, and logic-controlled gates.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';

export class DoorEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.DOOR,
      layer: EntityLayer.OBSTACLES,
      solid: options.isOpen ? false : true
    });
    this.isOpen = Boolean(options.isOpen);
    this.isLocked = Boolean(options.isLocked);
    this.requiredKeyId = options.requiredKeyId || null;
    this.requiredBranch = options.requiredBranch || null;
    this.autoClose = Boolean(options.autoClose);
  }

  isSolid() {
    return this.active && !this.isOpen;
  }

  open() {
    if (this.isLocked) return false;
    this.isOpen = true;
    this.solid = false;
    return true;
  }

  close() {
    this.isOpen = false;
    this.solid = true;
    return true;
  }

  unlock(keyId = null) {
    if (this.requiredKeyId && this.requiredKeyId !== keyId) {
      return false;
    }
    this.isLocked = false;
    return true;
  }

  interact(interactor, context = {}) {
    if (this.isOpen) return { success: true, handled: true };

    if (this.isLocked) {
      if (this.requiredKeyId && context.inventory?.hasItem(this.requiredKeyId)) {
        this.unlock(this.requiredKeyId);
        this.open();
        return { success: true, handled: true, action: 'unlocked_and_opened' };
      }
      return { success: false, handled: true, reason: 'door_locked', requiredKey: this.requiredKeyId };
    }

    this.open();
    return { success: true, handled: true, action: 'opened' };
  }
}

export class GateEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.GATE,
      layer: EntityLayer.OBSTACLES,
      solid: options.isOpen ? false : true
    });
    this.isOpen = Boolean(options.isOpen);
    this.logicMode = options.logicMode || 'AND'; // AND, OR, XOR
    this.connectedInputs = new Set(options.connectedInputs || []);
    this.inputStates = new Map();
  }

  isSolid() {
    return this.active && !this.isOpen;
  }

  setInput(inputId, state) {
    this.inputStates.set(inputId, Boolean(state));
    this.evaluateLogic();
  }

  evaluateLogic() {
    if (this.connectedInputs.size === 0) return;

    let activeCount = 0;
    for (const inputId of this.connectedInputs) {
      if (this.inputStates.get(inputId)) {
        activeCount++;
      }
    }

    let shouldOpen = false;
    if (this.logicMode === 'AND') {
      shouldOpen = activeCount === this.connectedInputs.size;
    } else if (this.logicMode === 'OR') {
      shouldOpen = activeCount > 0;
    } else if (this.logicMode === 'XOR') {
      shouldOpen = activeCount === 1;
    }

    if (shouldOpen !== this.isOpen) {
      this.isOpen = shouldOpen;
      this.solid = !shouldOpen;
    }
  }
}

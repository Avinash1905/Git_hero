/**
 * GitQuest Engine - Switch, PressurePlate & Wire Entities
 * Interactive circuit components, logic switches, pressure triggers, and signal wires.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';

export class SwitchEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.SWITCH,
      layer: EntityLayer.OBSTACLES,
      solid: options.solid !== undefined ? options.solid : true
    });
    this.isActive = Boolean(options.isActive);
    this.isToggle = options.isToggle !== false; // if false, momentary push button
    this.targetEntityIds = options.targetEntityIds || [];
    this.color = options.color || 'cyan';
  }

  interact(interactor, context = {}) {
    if (this.isToggle) {
      this.isActive = !this.isActive;
    } else {
      this.isActive = true;
    }
    return {
      success: true,
      handled: true,
      isActive: this.isActive,
      targets: [...this.targetEntityIds]
    };
  }

  deactivate() {
    this.isActive = false;
  }
}

export class PressurePlateEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.PRESSURE_PLATE,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false // Walkable floor trigger
    });
    this.isPressed = Boolean(options.isPressed);
    this.requiredWeight = options.requiredWeight || 1;
    this.currentWeight = 0;
    this.targetEntityIds = options.targetEntityIds || [];
    this.latching = Boolean(options.latching); // Stays active once triggered
  }

  evaluateOccupants(occupants) {
    let totalWeight = 0;
    for (const occ of occupants) {
      if (occ.type === EntityType.PLAYER) {
        totalWeight += 1;
      } else if (occ.weight !== undefined) {
        totalWeight += occ.weight;
      } else {
        totalWeight += 1;
      }
    }

    this.currentWeight = totalWeight;
    const nowPressed = totalWeight >= this.requiredWeight;

    if (nowPressed && !this.isPressed) {
      this.isPressed = true;
      return { triggered: true, state: true, targets: [...this.targetEntityIds] };
    } else if (!nowPressed && this.isPressed && !this.latching) {
      this.isPressed = false;
      return { triggered: true, state: false, targets: [...this.targetEntityIds] };
    }

    return { triggered: false, state: this.isPressed };
  }
}

export class WireEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.WIRE,
      layer: EntityLayer.CIRCUITS,
      solid: false
    });
    this.isPowered = Boolean(options.isPowered);
    this.signalSourceId = options.signalSourceId || null;
    this.signalTargetId = options.signalTargetId || null;
    this.invertSignal = Boolean(options.invertSignal); // NOT gate wire
  }

  setPower(powered) {
    this.isPowered = this.invertSignal ? !powered : Boolean(powered);
    return this.isPowered;
  }
}

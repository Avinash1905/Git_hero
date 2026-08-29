/**
 * GitQuest Game Engine - Dynamic Hazard Grid
 * Simulates cyclic spike traps, toxic acid puddles with neutralization chemicals,
 * oscillating sweep lasers, and automated sentinel turrets.
 */

import { Vector2D } from '../core/MathUtils.js';
import { GameEvent } from '../core/Constants.js';

export const HazardType = {
  SPIKE_TRAP: 'SPIKE_TRAP',
  ACID_POOL: 'ACID_POOL',
  SWEEP_LASER: 'SWEEP_LASER',
  SENTRY_TURRET: 'SENTRY_TURRET',
  FIRE_JET: 'FIRE_JET'
};

export class DynamicHazard {
  constructor(id, position, type = HazardType.SPIKE_TRAP, cyclePeriod = 4, offset = 0) {
    this.id = id;
    this.position = new Vector2D(position.x, position.y);
    this.type = type;
    this.cyclePeriod = cyclePeriod; // Steps per cycle
    this.offset = offset;
    this.currentStep = 0;
    this.isLethal = false;
    this.isNeutralized = false;
    this.laserDirection = new Vector2D(1, 0); // For sweep laser
    this.laserRange = 5;
  }

  tick() {
    if (this.isNeutralized) {
      this.isLethal = false;
      return false;
    }

    this.currentStep = (this.currentStep + 1) % this.cyclePeriod;

    switch (this.type) {
      case HazardType.SPIKE_TRAP:
        // Extended for half the period
        this.isLethal = (this.currentStep + this.offset) % this.cyclePeriod >= Math.floor(this.cyclePeriod / 2);
        break;
      case HazardType.FIRE_JET:
        // Active on specific steps
        this.isLethal = (this.currentStep + this.offset) % this.cyclePeriod === 0;
        break;
      case HazardType.ACID_POOL:
        // Always lethal unless neutralized
        this.isLethal = true;
        break;
      case HazardType.SWEEP_LASER:
        this.isLethal = true;
        break;
      case HazardType.SENTRY_TURRET:
        this.isLethal = true;
        break;
    }

    return this.isLethal;
  }

  neutralize() {
    this.isNeutralized = true;
    this.isLethal = false;
  }
}

export class DynamicHazardGrid {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.hazards = new Map();
    this.neutralizerChemicals = new Map();
  }

  registerHazard(hazard) {
    this.hazards.set(hazard.id, hazard);
  }

  registerNeutralizer(id, position, targetHazardId) {
    this.neutralizerChemicals.set(id, {
      id,
      position: new Vector2D(position.x, position.y),
      targetHazardId,
      isUsed: false
    });
  }

  advanceStep() {
    const updatedHazards = [];
    for (const hazard of this.hazards.values()) {
      const lethal = hazard.tick();
      updatedHazards.push({ id: hazard.id, lethal, position: hazard.position });
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.HAZARD_TRIGGERED, { hazards: updatedHazards });
    }

    return updatedHazards;
  }

  checkPlayerCollision(playerPos) {
    for (const hazard of this.hazards.values()) {
      if (hazard.isLethal && !hazard.isNeutralized) {
        if (hazard.position.x === playerPos.x && hazard.position.y === playerPos.y) {
          return {
            collided: true,
            hazardId: hazard.id,
            hazardType: hazard.type,
            lethal: true
          };
        }
      }
    }
    return { collided: false };
  }

  checkNeutralizerPickup(playerPos) {
    for (const neutralizer of this.neutralizerChemicals.values()) {
      if (!neutralizer.isUsed && neutralizer.position.x === playerPos.x && neutralizer.position.y === playerPos.y) {
        neutralizer.isUsed = true;
        const targetHazard = this.hazards.get(neutralizer.targetHazardId);
        if (targetHazard) {
          targetHazard.neutralize();
        }
        return {
          picked: true,
          neutralizerId: neutralizer.id,
          neutralizedHazardId: neutralizer.targetHazardId
        };
      }
    }
    return { picked: false };
  }

  exportState() {
    return {
      hazards: Array.from(this.hazards.values()).map(h => ({
        id: h.id,
        currentStep: h.currentStep,
        isLethal: h.isLethal,
        isNeutralized: h.isNeutralized
      })),
      neutralizers: Array.from(this.neutralizerChemicals.values()).map(n => ({
        id: n.id,
        isUsed: n.isUsed
      }))
    };
  }

  restoreState(state) {
    if (!state) return;
    if (state.hazards) {
      for (const hs of state.hazards) {
        const h = this.hazards.get(hs.id);
        if (h) {
          h.currentStep = hs.currentStep;
          h.isLethal = hs.isLethal;
          h.isNeutralized = hs.isNeutralized;
        }
      }
    }
    if (state.neutralizers) {
      for (const ns of state.neutralizers) {
        const n = this.neutralizerChemicals.get(ns.id);
        if (n) {
          n.isUsed = ns.isUsed;
        }
      }
    }
  }
}

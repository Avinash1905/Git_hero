/**
 * GitQuest Game Engine - Heavy Payload Physics
 * Simulates heavy Git repositories, multi-stage strain resistance,
 * surface friction coefficients, momentum transfer, and pulley leverage.
 */

import { Vector2D } from '../core/MathUtils.js';

export const SurfaceFrictionType = {
  ICE: 0.1,
  CONCRETE: 0.5,
  RUBBER_MAT: 0.9,
  MUD: 1.5,
  CONVEYOR: -0.5
};

export class HeavyCrate {
  constructor(id, position, mass = 1.0, friction = SurfaceFrictionType.CONCRETE) {
    this.id = id;
    this.position = new Vector2D(position.x, position.y);
    this.mass = mass; // Mass in tons (e.g. huge git monorepo = 3.0)
    this.friction = friction;
    this.currentMomentum = Vector2D.zero();
    this.isAnchored = false;
    this.requiredPullEffort = Math.ceil(mass * 1.5);
    this.accumulatedPullEffort = 0;
  }

  applyPullEffort(effort = 1) {
    this.accumulatedPullEffort += effort;
    if (this.accumulatedPullEffort >= this.requiredPullEffort) {
      this.accumulatedPullEffort = 0;
      return { success: true, moved: true };
    }
    return {
      success: false,
      moved: false,
      current: this.accumulatedPullEffort,
      required: this.requiredPullEffort
    };
  }

  resetEffort() {
    this.accumulatedPullEffort = 0;
  }
}

export class HeavyPayloadPhysics {
  constructor() {
    this.crates = new Map();
    this.pulleys = new Map();
  }

  registerCrate(crate) {
    this.crates.set(crate.id, crate);
  }

  registerPulley(id, position, efficiency = 2.0) {
    this.pulleys.set(id, {
      id,
      position: new Vector2D(position.x, position.y),
      efficiency
    });
  }

  attemptPull(crateId, pullDirectionVector, playerStrength = 1.0) {
    const crate = this.crates.get(crateId);
    if (!crate) return { success: false, reason: 'Crate not found' };
    if (crate.isAnchored) return { success: false, reason: 'Crate is anchored to substrate' };

    // Check if player is utilizing an adjacent pulley system
    let effectiveStrength = playerStrength;
    for (const pulley of this.pulleys.values()) {
      if (pulley.position.manhattanDistanceTo(crate.position) <= 2) {
        effectiveStrength *= pulley.efficiency;
        break;
      }
    }

    const result = crate.applyPullEffort(effectiveStrength);
    if (result.moved) {
      crate.position = crate.position.add(pullDirectionVector);
      return {
        success: true,
        moved: true,
        newPosition: crate.position,
        mass: crate.mass
      };
    } else {
      return {
        success: true,
        moved: false,
        strainProgress: `${result.current}/${result.required}`,
        message: `Straining against heavy payload (${result.current}/${result.required} effort)... Pull again to shift!`
      };
    }
  }

  calculatePushResistance(crateId) {
    const crate = this.crates.get(crateId);
    if (!crate) return 1.0;
    return crate.mass * crate.friction;
  }
}

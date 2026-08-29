/**
 * GitQuest Game Engine - Magnetic Polarity Grid Mechanism
 * Simulates magnetic dipole emitters, polar crates (North/South),
 * attraction/repulsion field physics, and polarity inversion switches.
 */

import { Vector2D } from '../../core/MathUtils.js';
import { GameEvent } from '../../core/Constants.js';

export const MagneticPolarity = {
  NONE: 'NONE',
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  ATTRACT_ALL: 'ATTRACT_ALL',
  REPEL_ALL: 'REPEL_ALL'
};

export class MagneticEmitter {
  constructor(id, position, polarity = MagneticPolarity.NORTH, strength = 3, range = 5) {
    this.id = id;
    this.position = new Vector2D(position.x, position.y);
    this.polarity = polarity;
    this.strength = strength;
    this.range = range;
    this.isActive = true;
  }

  toggleActive() {
    this.isActive = !this.isActive;
    return this.isActive;
  }

  invertPolarity() {
    if (this.polarity === MagneticPolarity.NORTH) {
      this.polarity = MagneticPolarity.SOUTH;
    } else if (this.polarity === MagneticPolarity.SOUTH) {
      this.polarity = MagneticPolarity.NORTH;
    }
    return this.polarity;
  }

  getForceAt(targetPos, targetPolarity) {
    if (!this.isActive || targetPolarity === MagneticPolarity.NONE) {
      return Vector2D.zero();
    }

    const diff = this.position.subtract(targetPos);
    const dist = diff.manhattanDistance();

    if (dist === 0 || dist > this.range) {
      return Vector2D.zero();
    }

    let isAttraction = false;
    if (this.polarity === MagneticPolarity.ATTRACT_ALL) {
      isAttraction = true;
    } else if (this.polarity === MagneticPolarity.REPEL_ALL) {
      isAttraction = false;
    } else if (this.polarity !== targetPolarity) {
      isAttraction = true;
    } else {
      isAttraction = false;
    }

    const direction = diff.normalize();
    const magnitude = Math.max(1, this.strength - Math.floor(dist / 2));

    if (isAttraction) {
      return direction.multiply(magnitude);
    } else {
      return direction.multiply(-magnitude);
    }
  }
}

export class MagneticPolarityGrid {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.emitters = new Map();
    this.magneticCrates = new Map();
    this.polaritySwitches = new Map();
    this.activeFields = [];
  }

  registerEmitter(emitter) {
    this.emitters.set(emitter.id, emitter);
  }

  registerMagneticCrate(crateId, position, polarity = MagneticPolarity.NORTH) {
    this.magneticCrates.set(crateId, {
      id: crateId,
      position: new Vector2D(position.x, position.y),
      polarity,
      mass: 1.0,
      isGrounded: false
    });
  }

  registerPolaritySwitch(switchId, position, targetEmitterIds = []) {
    this.polaritySwitches.set(switchId, {
      id: switchId,
      position: new Vector2D(position.x, position.y),
      targetEmitterIds,
      isPressed: false
    });
  }

  triggerSwitch(switchId) {
    const sw = this.polaritySwitches.get(switchId);
    if (!sw) return false;

    sw.isPressed = !sw.isPressed;
    for (const emitterId of sw.targetEmitterIds) {
      const em = this.emitters.get(emitterId);
      if (em) {
        em.invertPolarity();
      }
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.CIRCUIT_STATE_CHANGED, {
        switchId,
        isPressed: sw.isPressed,
        affectedEmitters: sw.targetEmitterIds
      });
    }

    return true;
  }

  computeNetMagneticForce(crateId) {
    const crate = this.magneticCrates.get(crateId);
    if (!crate || crate.polarity === MagneticPolarity.NONE) {
      return Vector2D.zero();
    }

    let netForce = Vector2D.zero();

    for (const emitter of this.emitters.values()) {
      const force = emitter.getForceAt(crate.position, crate.polarity);
      netForce = netForce.add(force);
    }

    return netForce;
  }

  evaluateStep(gridWidth, gridHeight, isCellBlocked) {
    const movements = [];

    for (const [crateId, crate] of this.magneticCrates.entries()) {
      if (crate.isGrounded) continue;

      const netForce = this.computeNetMagneticForce(crateId);
      if (netForce.magnitude() >= 1.0) {
        const stepX = Math.sign(netForce.x);
        const stepY = Math.sign(netForce.y);

        const targetPos = new Vector2D(crate.position.x + stepX, crate.position.y + stepY);

        if (
          targetPos.x >= 0 &&
          targetPos.x < gridWidth &&
          targetPos.y >= 0 &&
          targetPos.y < gridHeight &&
          !isCellBlocked(targetPos.x, targetPos.y)
        ) {
          const oldPos = new Vector2D(crate.position.x, crate.position.y);
          crate.position = targetPos;
          movements.push({ crateId, from: oldPos, to: targetPos });
        }
      }
    }

    return movements;
  }

  exportState() {
    return {
      emitters: Array.from(this.emitters.values()).map(e => ({
        id: e.id,
        x: e.position.x,
        y: e.position.y,
        polarity: e.polarity,
        isActive: e.isActive
      })),
      crates: Array.from(this.magneticCrates.values()).map(c => ({
        id: c.id,
        x: c.position.x,
        y: c.position.y,
        polarity: c.polarity
      })),
      switches: Array.from(this.polaritySwitches.values()).map(s => ({
        id: s.id,
        isPressed: s.isPressed
      }))
    };
  }

  restoreState(state) {
    if (!state) return;
    if (state.emitters) {
      for (const e of state.emitters) {
        const em = this.emitters.get(e.id);
        if (em) {
          em.position.set(e.x, e.y);
          em.polarity = e.polarity;
          em.isActive = e.isActive;
        }
      }
    }
    if (state.crates) {
      for (const c of state.crates) {
        const crate = this.magneticCrates.get(c.id);
        if (crate) {
          crate.position.set(c.x, c.y);
          crate.polarity = c.polarity;
        }
      }
    }
    if (state.switches) {
      for (const s of state.switches) {
        const sw = this.polaritySwitches.get(s.id);
        if (sw) {
          sw.isPressed = s.isPressed;
        }
      }
    }
  }
}

/**
 * GitQuest Engine - Quantum Entanglement Solver & Dual-Crate Mechanics
 * Synchronized and mirrored quantum-entangled crate physics across parallel puzzle chambers.
 */

import { Vector2D } from '../../core/Types.js';

export const EntanglementMode = Object.freeze({
  SYNCHRONOUS: 'synchronous',
  MIRROR_X: 'mirror_x',
  MIRROR_Y: 'mirror_y',
  INVERTED: 'inverted'
});

export class QuantumEntangledPair {
  constructor(id, crateA, crateB, mode = EntanglementMode.SYNCHRONOUS) {
    this.id = id;
    this.crateA = crateA;
    this.crateB = crateB;
    this.mode = mode;
    this.isActive = true;
  }

  calculatePartnerMovement(movedCrate, dx, dy) {
    if (!this.isActive) return { dx: 0, dy: 0 };

    let targetDx = dx;
    let targetDy = dy;

    if (this.mode === EntanglementMode.MIRROR_X) {
      targetDx = -dx;
    } else if (this.mode === EntanglementMode.MIRROR_Y) {
      targetDy = -dy;
    } else if (this.mode === EntanglementMode.INVERTED) {
      targetDx = -dx;
      targetDy = -dy;
    }

    return { dx: targetDx, dy: targetDy };
  }
}

export class QuantumEntanglementSolver {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.pairs = new Map(); // id -> QuantumEntangledPair
  }

  registerPair(pair) {
    this.pairs.set(pair.id, pair);
  }

  notifyCrateMoved(crate, dx, dy) {
    for (const pair of this.pairs.values()) {
      if (pair.crateA === crate || pair.crateB === crate) {
        const partner = pair.crateA === crate ? pair.crateB : pair.crateA;
        const move = pair.calculatePartnerMovement(crate, dx, dy);

        const nextX = partner.position.x + move.dx;
        const nextY = partner.position.y + move.dy;

        if (this.world.isWalkable(nextX, nextY, partner)) {
          this.entityManager.updatePosition(partner, nextX, nextY);
        }
      }
    }
  }
}

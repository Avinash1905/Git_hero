/**
 * GitQuest Engine - Magnetic Field & Physics Constraint Solver
 * Polarity attraction/repulsion fields and distance/spring constraint physics for puzzle bodies.
 */

import { Vector2D } from '../core/Types.js';

export const MagneticPolarity = Object.freeze({
  NORTH: 'N',
  SOUTH: 'S',
  NEUTRAL: 'NONE'
});

export class MagneticNode {
  constructor(id, x, y, polarity = MagneticPolarity.NORTH, strength = 4) {
    this.id = id;
    this.coord = new Vector2D(x, y);
    this.polarity = polarity;
    this.strength = strength;
    this.isActive = true;
  }

  calculateForce(targetCoord, targetPolarity) {
    if (!this.isActive || targetPolarity === MagneticPolarity.NEUTRAL) {
      return { fx: 0, fy: 0 };
    }

    const target = Vector2D.from(targetCoord);
    const dist = this.coord.manhattanDistance(target);
    if (dist === 0 || dist > this.strength) {
      return { fx: 0, fy: 0 };
    }

    // Like repels, opposite attracts
    const isAttract = this.polarity !== targetPolarity;
    const sign = isAttract ? 1 : -1;

    const dx = Math.sign(this.coord.x - target.x) * sign;
    const dy = Math.sign(this.coord.y - target.y) * sign;

    return { fx: dx, fy: dy };
  }
}

export class MagneticFieldEngine {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.nodes = new Map(); // id -> MagneticNode
  }

  addNode(node) {
    this.nodes.set(node.id, node);
  }

  step() {
    const moved = [];
    for (const node of this.nodes.values()) {
      if (!node.isActive) continue;

      const entities = this.entityManager.getAll();
      for (const ent of entities) {
        if (!ent.polarity || ent.polarity === MagneticPolarity.NEUTRAL) continue;

        const force = node.calculateForce(ent.position, ent.polarity);
        if (force.fx !== 0 || force.fy !== 0) {
          const nextX = ent.position.x + force.fx;
          const nextY = ent.position.y + force.fy;

          if (this.world.isWalkable(nextX, nextY, ent)) {
            this.entityManager.updatePosition(ent, nextX, nextY);
            moved.push(ent);
          }
        }
      }
    }
    return moved;
  }
}

export class DistanceConstraint {
  constructor(entityA, entityB, maxDistance = 2) {
    this.entityA = entityA;
    this.entityB = entityB;
    this.maxDistance = maxDistance;
  }

  solve(world, entityManager) {
    const posA = Vector2D.from(this.entityA.position);
    const posB = Vector2D.from(this.entityB.position);
    const dist = posA.manhattanDistance(posB);

    if (dist > this.maxDistance) {
      // Pull entityB toward entityA
      const dirX = Math.sign(posA.x - posB.x);
      const dirY = Math.sign(posA.y - posB.y);

      const nextX = posB.x + dirX;
      const nextY = posB.y + dirY;

      if (world.isWalkable(nextX, nextY, this.entityB)) {
        entityManager.updatePosition(this.entityB, nextX, nextY);
        return true;
      }
    }
    return false;
  }
}

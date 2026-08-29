/**
 * GitQuest Engine - CollisionEngine
 * High-performance spatial collision queries, solid checks, and hazard triggers.
 */

import { Vector2D } from '../core/Types.js';
import { EntityType } from '../core/Constants.js';

export class CollisionEngine {
  constructor(world = null, entityManager = null) {
    this.world = world;
    this.entityManager = entityManager;
  }

  setWorld(world) {
    this.world = world;
  }

  setEntityManager(entityManager) {
    this.entityManager = entityManager;
  }

  /**
   * Check if coordinate is blocked by terrain or solid entity
   */
  isBlocked(x, y, ignoreEntity = null) {
    // 1. Boundary & terrain check
    if (!this.world || !this.world.map.isInBounds(x, y)) {
      return { blocked: true, reason: 'out_of_bounds' };
    }

    if (this.world.isWall(x, y)) {
      return { blocked: true, reason: 'wall', isWall: true };
    }

    // 2. Entity collision check
    if (this.entityManager) {
      const entities = this.entityManager.getAt(x, y);
      for (const ent of entities) {
        if (ent === ignoreEntity) continue;
        if (typeof ent.isSolid === 'function' && ent.isSolid()) {
          return {
            blocked: true,
            reason: 'solid_entity',
            entity: ent,
            entityType: ent.type
          };
        }
      }
    }

    return { blocked: false };
  }

  /**
   * Check if coordinate has a hazard
   */
  isHazard(x, y) {
    if (this.world && this.world.isHazard(x, y)) {
      return { isHazard: true, reason: 'terrain_hazard' };
    }

    if (this.entityManager) {
      const entities = this.entityManager.getAt(x, y);
      for (const ent of entities) {
        if (ent.type === EntityType.HAZARD && ent.active) {
          return { isHazard: true, entity: ent, damage: ent.damage || 1 };
        }
      }
    }

    return { isHazard: false };
  }

  /**
   * Get all solid entities at coordinate
   */
  getSolidEntitiesAt(x, y, ignoreEntity = null) {
    if (!this.entityManager) return [];
    return this.entityManager.getAt(x, y).filter(e => e !== ignoreEntity && e.isSolid && e.isSolid());
  }

  /**
   * Raycast query for first solid obstruction
   */
  raycastSolid(startCoord, direction, maxDistance = 20, ignoreEntity = null) {
    const start = Vector2D.from(startCoord);
    const dirNorm = direction.toLowerCase();
    let dx = 0;
    let dy = 0;
    if (dirNorm === 'left') dx = -1;
    else if (dirNorm === 'right') dx = 1;
    else if (dirNorm === 'up') dy = -1;
    else if (dirNorm === 'down') dy = 1;

    let current = start.clone();
    for (let dist = 1; dist <= maxDistance; dist++) {
      current = current.add({ x: dx, y: dy });
      const check = this.isBlocked(current.x, current.y, ignoreEntity);
      if (check.blocked) {
        return {
          hit: true,
          coord: current,
          distance: dist,
          reason: check.reason,
          entity: check.entity || null
        };
      }
    }

    return { hit: false, coord: current, distance: maxDistance };
  }
}

/**
 * GitQuest Engine - PushSolver
 * Handles box push mechanics, multi-box chain pushing, obstruction resolution, and goal triggering.
 */

import { MovementResult, Vector2D } from '../core/Types.js';
import { GameEvent, EntityType } from '../core/Constants.js';

export class PushSolver {
  constructor(world, entityManager, collisionEngine, eventBus = null) {
    this.world = world;
    this.entityManager = entityManager;
    this.collision = collisionEngine;
    this.eventBus = eventBus;
  }

  /**
   * Attempt to push an entity in a given direction
   */
  tryPush(entity, dx, dy, maxChain = 1) {
    if (!entity || !entity.isPushable) {
      return MovementResult.fail('entity_not_pushable');
    }

    const startPos = entity.position.clone();
    const targetPos = startPos.add({ x: dx, y: dy });

    // Check if target is out of bounds or wall
    const wallCheck = this.collision.isBlocked(targetPos.x, targetPos.y, entity);
    if (wallCheck.blocked) {
      if (wallCheck.isWall || wallCheck.reason === 'out_of_bounds') {
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.OBJECT_PUSH_FAILED, { entity, reason: 'wall_or_bounds' });
        }
        return MovementResult.fail('blocked_box', 105, 'Path blocked by wall or boundary.');
      }

      // Check if blocked by another pushable entity (chain push)
      if (wallCheck.entity && maxChain > 1 && wallCheck.entity.isPushable) {
        const chainRes = this.tryPush(wallCheck.entity, dx, dy, maxChain - 1);
        if (!chainRes.success) {
          return chainRes;
        }
      } else {
        return MovementResult.fail('blocked_box', 105, 'Path blocked by entity.');
      }
    }

    // Execute move of pushed entity
    this.entityManager.updatePosition(entity, targetPos.x, targetPos.y);

    // Check goal status
    let onGoal = false;
    if (this.entityManager) {
      const goals = this.entityManager.getAt(targetPos.x, targetPos.y)
        .filter(e => e.type === EntityType.GOAL || e.type === EntityType.OBJECTIVE_MARKER || e.id === 'goal');
      if (goals.length > 0) {
        onGoal = true;
      }
    }
    if (typeof entity.setGoalStatus === 'function') {
      entity.setGoalStatus(onGoal);
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.OBJECT_PUSHED, {
        entity,
        from: startPos,
        to: targetPos,
        onGoal
      });
      if (onGoal) {
        this.eventBus.emit(GameEvent.OBJECT_PLACED_ON_GOAL, { entity, coord: targetPos });
      }
    }

    return MovementResult.ok({
      pushed: true,
      pushedEntity: entity,
      from: startPos,
      to: targetPos,
      onGoal
    });
  }
}

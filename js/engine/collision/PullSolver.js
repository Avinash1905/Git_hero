/**
 * GitQuest Engine - PullSolver
 * Solves 4-directional and raycast git pull mechanics with backward player step validation.
 */

import { PullResult, Vector2D } from '../core/Types.js';
import { GameEvent, Direction, EntityType } from '../core/Constants.js';
import { EngineUtils } from '../core/Utils.js';

export class PullSolver {
  constructor(world, entityManager, collisionEngine, eventBus = null) {
    this.world = world;
    this.entityManager = entityManager;
    this.collision = collisionEngine;
    this.eventBus = eventBus;
  }

  /**
   * Resolve pull command in given direction or player's facing direction
   */
  resolvePull(playerCoord, playerFacingDir, targetDirection = '') {
    const pPos = Vector2D.from(playerCoord);
    const dStr = (targetDirection || '').trim().toLowerCase();

    let dx = 0;
    let dy = 0;
    let actualDir = dStr;

    if (dStr === 'left') {
      dx = -1;
      dy = 0;
    } else if (dStr === 'right') {
      dx = 1;
      dy = 0;
    } else if (dStr === 'up') {
      dx = 0;
      dy = -1;
    } else if (dStr === 'down') {
      dx = 0;
      dy = 1;
    } else {
      // Default to player's facing direction
      actualDir = playerFacingDir || Direction.UP;
      const vec = EngineUtils.directionToVector(actualDir);
      dx = vec.x;
      dy = vec.y;
    }

    const boxCoord = pPos.add({ x: dx, y: dy });
    const backCoord = pPos.subtract({ x: dx, y: dy });

    // 1. Check if pullable entity exists at target coordinate
    const targetEntities = this.entityManager
      ? this.entityManager.getAt(boxCoord.x, boxCoord.y)
      : [];
    const pullableEntity = targetEntities.find(e => e.isPullable || e.type === EntityType.PUSHABLE || e.type === EntityType.PULLABLE || e.id === 'box');

    if (!pullableEntity) {
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.OBJECT_PULL_FAILED, {
          reason: 'no_box_in_direction',
          direction: actualDir
        });
      }
      return PullResult.fail('no_box_in_direction', 106, 'No pullable object in that direction.', {
        direction: actualDir
      });
    }

    // 2. Check if player's step-backward position is obstructed by wall, boundary or hazard
    const backCheck = this.collision.isBlocked(backCoord.x, backCoord.y);
    if (backCheck.blocked) {
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.OBJECT_PULL_FAILED, {
          reason: 'obstructed_pull_path',
          direction: actualDir
        });
      }
      return PullResult.fail('obstructed_pull_path', 107, 'Pull blocked. Backward path is obstructed by a wall or boundary.', {
        direction: actualDir
      });
    }

    const hazardCheck = this.collision.isHazard(backCoord.x, backCoord.y);
    if (hazardCheck.isHazard) {
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.OBJECT_PULL_FAILED, {
          reason: 'obstructed_pull_path',
          direction: actualDir
        });
      }
      return PullResult.fail('obstructed_pull_path', 107, 'Pull blocked. Backward path contains a hazard.', {
        direction: actualDir
      });
    }

    // 3. Execute pull: box moves to player's former spot, player steps back
    const boxFrom = Vector2D.from(pullableEntity.position);
    const boxTo = pPos.clone();
    const playerFrom = pPos.clone();
    const playerTo = backCoord.clone();

    if (this.entityManager) {
      this.entityManager.updatePosition(pullableEntity, boxTo.x, boxTo.y);
    } else {
      pullableEntity.setPosition(boxTo.x, boxTo.y);
    }

    // 4. Check goal condition
    let onGoal = false;
    if (this.entityManager) {
      const goals = this.entityManager.getAt(boxTo.x, boxTo.y)
        .filter(e => e.type === EntityType.GOAL || e.type === EntityType.OBJECTIVE_MARKER || e.id === 'goal');
      if (goals.length > 0) {
        onGoal = true;
      }
    }
    if (typeof pullableEntity.setGoalStatus === 'function') {
      pullableEntity.setGoalStatus(onGoal);
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.OBJECT_PULLED, {
        entity: pullableEntity,
        direction: actualDir,
        playerFrom,
        playerTo,
        boxFrom,
        boxTo,
        onGoal
      });
      if (onGoal) {
        this.eventBus.emit(GameEvent.OBJECT_PLACED_ON_GOAL, { entity: pullableEntity, coord: boxTo });
      }
    }

    return PullResult.ok({
      pulled: true,
      pulledEntity: pullableEntity,
      direction: actualDir,
      playerFrom,
      playerTo,
      boxFrom,
      boxTo,
      onGoal
    });
  }
}

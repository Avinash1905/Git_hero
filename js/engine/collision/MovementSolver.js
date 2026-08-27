/**
 * GitQuest Engine - MovementSolver
 * Resolves player movement steps, facing directions, push collisions, and interactive triggers.
 */

import { MovementResult, Vector2D } from '../core/Types.js';
import { GameEvent, Direction, EntityType } from '../core/Constants.js';
import { EngineUtils } from '../core/Utils.js';

export class MovementSolver {
  constructor(world, entityManager, collisionEngine, pushSolver, pullSolver, eventBus = null) {
    this.world = world;
    this.entityManager = entityManager;
    this.collision = collisionEngine;
    this.pushSolver = pushSolver;
    this.pullSolver = pullSolver;
    this.eventBus = eventBus;
  }

  /**
   * Move player by delta (dx, dy)
   */
  movePlayer(playerEntity, dx, dy) {
    if (!playerEntity) return MovementResult.fail('no_player');

    const fromPos = playerEntity.position.clone();
    const toPos = fromPos.add({ x: dx, y: dy });

    // Update facing direction
    const newFacing = EngineUtils.vectorToDirection(dx, dy);
    if (newFacing !== Direction.NONE) {
      playerEntity.direction = newFacing;
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.PLAYER_FACING_CHANGED, { direction: newFacing });
      }
    }

    // 1. Check if moving into wall or boundary
    const blockCheck = this.collision.isBlocked(toPos.x, toPos.y, playerEntity);
    if (blockCheck.blocked) {
      if (blockCheck.isWall || blockCheck.reason === 'out_of_bounds') {
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.PLAYER_MOVE_BLOCKED, { reason: 'wall', coord: toPos });
        }
        return MovementResult.fail('wall', 101, 'Cannot move through walls or boundary.');
      }

      // 2. Check if obstacle is a pushable box
      if (blockCheck.entity && (blockCheck.entity.isPushable || blockCheck.entity.type === EntityType.PUSHABLE || blockCheck.entity.id === 'box')) {
        const pushRes = this.pushSolver.tryPush(blockCheck.entity, dx, dy);
        if (!pushRes.success) {
          if (this.eventBus) {
            this.eventBus.emit(GameEvent.PLAYER_MOVE_BLOCKED, { reason: 'blocked_box', coord: toPos });
          }
          return MovementResult.fail('blocked_box', 105, 'Box path is blocked.');
        }

        // Successfully pushed box, now player steps into the vacated space
        this.entityManager.updatePosition(playerEntity, toPos.x, toPos.y);

        if (this.eventBus) {
          this.eventBus.emit(GameEvent.PLAYER_MOVED, {
            from: fromPos,
            to: toPos,
            direction: newFacing,
            pushed: true,
            pushedEntity: blockCheck.entity
          });
        }

        return MovementResult.ok({
          from: fromPos,
          to: toPos,
          direction: newFacing,
          pushed: true,
          pushedEntity: blockCheck.entity,
          onGoal: pushRes.onGoal
        });
      }

      // Other solid obstruction
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.PLAYER_MOVE_BLOCKED, { reason: blockCheck.reason, coord: toPos });
      }
      return MovementResult.fail(blockCheck.reason || 'blocked', 100, 'Movement path is blocked.');
    }

    // 3. Move player into empty/walkable tile
    this.entityManager.updatePosition(playerEntity, toPos.x, toPos.y);

    // 4. Check for floor triggers (pressure plates, keys, portals, hazards)
    let hazardTriggered = false;
    const hazardCheck = this.collision.isHazard(toPos.x, toPos.y);
    if (hazardCheck.isHazard) {
      hazardTriggered = true;
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.PLAYER_DAMAGED, { damage: hazardCheck.damage || 1, coord: toPos });
      }
    }

    // Floor entities interaction
    const floorEntities = this.entityManager.getAt(toPos.x, toPos.y);
    for (const ent of floorEntities) {
      if (ent === playerEntity) continue;
      if (ent.type === EntityType.KEY && typeof ent.collect === 'function') {
        const keyId = ent.collect();
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.KEY_COLLECTED, { keyId, entity: ent });
        }
      } else if (ent.type === EntityType.PORTAL && typeof ent.teleport === 'function') {
        const tele = ent.teleport(playerEntity);
        if (tele) {
          this.entityManager.updatePosition(playerEntity, tele.toCoord.x, tele.toCoord.y);
          if (this.eventBus) {
            this.eventBus.emit(GameEvent.PLAYER_TELEPORTED, { from: toPos, to: tele.toCoord });
          }
        }
      }
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.PLAYER_MOVED, {
        from: fromPos,
        to: toPos,
        direction: newFacing,
        pushed: false,
        hazardTriggered
      });
    }

    return MovementResult.ok({
      from: fromPos,
      to: toPos,
      direction: newFacing,
      pushed: false,
      hazardTriggered
    });
  }

  /**
   * Move player by direction name ('left', 'right', 'up', 'down')
   */
  moveDirection(playerEntity, directionStr) {
    const norm = EngineUtils.normalizeDirection(directionStr);
    const vec = EngineUtils.directionToVector(norm);
    if (vec.x === 0 && vec.y === 0) {
      return MovementResult.fail('invalid_direction', 108, 'Invalid movement direction.');
    }
    return this.movePlayer(playerEntity, vec.x, vec.y);
  }
}

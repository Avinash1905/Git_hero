/**
 * GitQuest Engine - Interactive Environment Entities
 * Keys, Portals, Checkpoints, Exits, Hazards, and Moving Obstacles.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class KeyEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.KEY,
      layer: EntityLayer.ITEMS,
      solid: false // Picked up by stepping on it
    });
    this.keyId = options.keyId || options.id;
    this.keyType = options.keyType || 'ssh_key'; // ssh_key, gpg_token, branch_key
    this.color = options.color || 'gold';
    this.isCollected = Boolean(options.isCollected);
  }

  collect() {
    this.isCollected = true;
    this.active = false;
    return this.keyId;
  }
}

export class PortalEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.PORTAL,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false
    });
    this.destinationCoord = options.destinationCoord ? Vector2D.from(options.destinationCoord) : null;
    this.destinationRoomId = options.destinationRoomId || null;
    this.portalChannel = options.portalChannel || 'default';
    this.isLocked = Boolean(options.isLocked);
    this.cooldown = 0;
  }

  teleport(entity) {
    if (this.isLocked || !this.destinationCoord || this.cooldown > 0) {
      return null;
    }
    this.cooldown = 2; // prevent immediate bounce back
    return {
      toCoord: this.destinationCoord.clone(),
      toRoomId: this.destinationRoomId
    };
  }

  tick(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
    }
  }
}

export class CheckpointEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.CHECKPOINT,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false
    });
    this.checkpointId = options.checkpointId || options.id;
    this.isReached = Boolean(options.isReached);
    this.snapshotData = options.snapshotData || null;
  }

  activate(snapshot) {
    this.isReached = true;
    this.snapshotData = snapshot;
  }
}

export class ExitEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.EXIT,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false
    });
    this.isUnlocked = Boolean(options.isUnlocked !== false);
    this.requiresAllGoals = Boolean(options.requiresAllGoals);
    this.targetNextLevel = options.targetNextLevel || null;
  }
}

export class HazardEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.HAZARD,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false
    });
    this.damage = options.damage ?? 1;
    this.hazardType = options.hazardType || 'merge_conflict'; // merge_conflict, force_push_laser, detached_head
    this.isLethal = Boolean(options.isLethal !== false);
  }
}

export class MovingObstacleEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.MOVING_OBSTACLE,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.patrolPath = (options.patrolPath || []).map(p => Vector2D.from(p));
    this.pathIndex = 0;
    this.direction = 1; // 1 = forward, -1 = reverse
    this.patrolInterval = options.patrolInterval || 1.0; // seconds per step
    this.timer = 0;
  }

  tick(dt) {
    if (this.patrolPath.length < 2) return null;
    this.timer += dt;

    if (this.timer >= this.patrolInterval) {
      this.timer -= this.patrolInterval;
      this.pathIndex += this.direction;

      if (this.pathIndex >= this.patrolPath.length) {
        this.pathIndex = this.patrolPath.length - 2;
        this.direction = -1;
      } else if (this.pathIndex < 0) {
        this.pathIndex = 1;
        this.direction = 1;
      }

      const nextPos = this.patrolPath[this.pathIndex];
      return nextPos;
    }

    return null;
  }
}

/**
 * GitQuest Engine - Pushable & Pullable Entities
 * Dynamic boxes, git commit payloads, stash crates, and physics objects.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class PushableObject extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: options.type || EntityType.PUSHABLE,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.weight = options.weight ?? 1;
    this.isPullable = Boolean(options.isPullable !== false);
    this.isPushable = Boolean(options.isPushable !== false);
    this.isOnGoal = Boolean(options.isOnGoal);
    this.targetGoalId = options.targetGoalId || null;
    this.commitPayload = options.commitPayload || null;
    this.label = options.label || 'Payload';
  }

  setGoalStatus(onGoal) {
    this.isOnGoal = Boolean(onGoal);
  }
}

export class PullableObject extends PushableObject {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.PULLABLE,
      isPullable: true,
      isPushable: options.isPushable !== false
    });
  }
}

export class StashContainer extends PushableObject {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.STASH_CONTAINER,
      label: options.label || 'Stash Pouch'
    });
    this.stashedPayload = options.stashedPayload || null;
  }

  stash(payload) {
    this.stashedPayload = payload;
    this.active = false;
    this.solid = false;
  }

  pop(atCoord) {
    this.position = Vector2D.from(atCoord);
    this.active = true;
    this.solid = true;
    const p = this.stashedPayload;
    this.stashedPayload = null;
    return p;
  }
}

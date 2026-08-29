/**
 * GitQuest Engine - Wall Entity
 * Static barriers and destructible/mergeable wall partitions.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';

export class WallEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.WALL,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.breakable = Boolean(options.breakable);
    this.durability = options.durability || (this.breakable ? 1 : Infinity);
    this.material = options.material || 'stone';
  }

  hit(damage = 1) {
    if (!this.breakable) return false;
    this.durability -= damage;
    if (this.durability <= 0) {
      this.active = false;
      this.solid = false;
      return true; // destroyed
    }
    return false;
  }
}

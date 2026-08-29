/**
 * GitQuest Engine - EntityManager
 * Central registry and lifecycle manager for all active game entities.
 */

import { EntityType } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class EntityManager {
  constructor(world = null, eventBus = null) {
    this.world = world;
    this.eventBus = eventBus;
    this.entities = new Map(); // id -> Entity
    this.typeIndex = new Map(); // type -> Set<Entity>
    this.tagIndex = new Map(); // tag -> Set<Entity>
  }

  setWorld(world) {
    this.world = world;
  }

  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }

  add(entity) {
    if (!entity || !entity.id) return null;
    this.entities.set(entity.id, entity);

    // Type index
    if (!this.typeIndex.has(entity.type)) {
      this.typeIndex.set(entity.type, new Set());
    }
    this.typeIndex.get(entity.type).add(entity);

    // Tag index
    if (entity.tags && typeof entity.tags[Symbol.iterator] === 'function') {
      for (const tag of entity.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag).add(entity);
      }
    }

    if (this.world) {
      this.world.registerEntity(entity);
    }

    return entity;
  }

  remove(entityOrId) {
    const id = typeof entityOrId === 'string' ? entityOrId : entityOrId?.id;
    if (!id || !this.entities.has(id)) return false;

    const entity = this.entities.get(id);
    this.entities.delete(id);

    // Type index
    if (this.typeIndex.has(entity.type)) {
      this.typeIndex.get(entity.type).delete(entity);
    }

    // Tag index
    if (entity.tags && typeof entity.tags[Symbol.iterator] === 'function') {
      for (const tag of entity.tags) {
        if (this.tagIndex.has(tag)) {
          this.tagIndex.get(tag).delete(entity);
        }
      }
    }

    if (this.world) {
      this.world.unregisterEntity(entity);
    }

    return true;
  }

  get(id) {
    return this.entities.get(id) || null;
  }

  getAll() {
    return Array.from(this.entities.values());
  }

  getByType(type) {
    if (!this.typeIndex.has(type)) return [];
    return Array.from(this.typeIndex.get(type));
  }

  getByTag(tag) {
    if (!this.tagIndex.has(tag)) return [];
    return Array.from(this.tagIndex.get(tag));
  }

  getAt(x, y) {
    if (this.world) {
      return this.world.getEntitiesAt(x, y);
    }
    return this.getAll().filter(e => e.position.x === x && e.position.y === y);
  }

  getSingleAt(x, y, filterFn = null) {
    const list = this.getAt(x, y);
    if (!filterFn) return list[0] || null;
    return list.find(filterFn) || null;
  }

  updatePosition(entity, newX, newY) {
    if (!entity) return;
    entity.setPosition(newX, newY);
    if (this.world) {
      this.world.updateEntityPosition(entity);
    }
  }

  tick(dt, tickCount) {
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.tick(dt, tickCount);
      }
    }
  }

  clear() {
    this.entities.clear();
    this.typeIndex.clear();
    this.tagIndex.clear();
    if (this.world) {
      this.world.reset();
    }
  }

  serialize() {
    return Array.from(this.entities.values()).map(e => e.serialize());
  }
}

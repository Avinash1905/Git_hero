/**
 * GitQuest Engine - Base Entity
 * Core entity architecture with unique IDs, position vectors, components, tags, and lifecycle hooks.
 */

import { EntityType, EntityLayer } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';
import { EngineUtils } from '../core/Utils.js';

export class Entity {
  constructor(options = {}) {
    this.id = options.id || `${options.type || EntityType.PUSHABLE}_${EngineUtils.generateUUID().substring(0, 8)}`;
    this.name = options.name || this.id;
    this.type = options.type || EntityType.PUSHABLE;
    this.layer = options.layer ?? EntityLayer.OBSTACLES;
    this.position = options.position ? Vector2D.from(options.position) : new Vector2D(0, 0);
    this.tags = new Set(options.tags || []);
    this.components = new Map();
    this.properties = { ...options.properties };
    this.active = options.active !== false;
    this.visible = options.visible !== false;
    this.solid = options.solid !== false;
    this.createdAt = Date.now();
  }

  addComponent(name, component) {
    this.components.set(name, component);
    if (typeof component.onAttach === 'function') {
      component.onAttach(this);
    }
    return this;
  }

  getComponent(name) {
    return this.components.get(name) || null;
  }

  hasComponent(name) {
    return this.components.has(name);
  }

  removeComponent(name) {
    const comp = this.components.get(name);
    if (comp) {
      if (typeof comp.onDetach === 'function') {
        comp.onDetach(this);
      }
      this.components.delete(name);
    }
  }

  addTag(tag) {
    this.tags.add(tag);
    return this;
  }

  hasTag(tag) {
    return this.tags.has(tag);
  }

  removeTag(tag) {
    this.tags.delete(tag);
  }

  setPosition(x, y) {
    this.position.x = Math.round(x);
    this.position.y = Math.round(y);
  }

  isSolid() {
    return this.active && this.solid;
  }

  interact(interactor, context = {}) {
    return { success: false, handled: false };
  }

  tick(dt, tickCount) {
    for (const comp of this.components.values()) {
      if (typeof comp.tick === 'function') {
        comp.tick(dt, tickCount, this);
      }
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      layer: this.layer,
      position: this.position.toJSON(),
      tags: Array.from(this.tags),
      properties: EngineUtils.deepClone(this.properties),
      active: this.active,
      visible: this.visible,
      solid: this.solid
    };
  }

  static deserialize(json, EntityClass = Entity) {
    return new EntityClass({
      id: json.id,
      name: json.name,
      type: json.type,
      layer: json.layer,
      position: Vector2D.from(json.position),
      tags: json.tags,
      properties: json.properties,
      active: json.active,
      visible: json.visible,
      solid: json.solid
    });
  }
}

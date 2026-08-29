/**
 * GitQuest Engine - Room
 * Represents an isolated or interconnected chamber within a larger world map.
 */

import { BoundingBox, Vector2D } from '../core/Types.js';

export class Room {
  constructor(options = {}) {
    this.id = options.id || 'room_0';
    this.name = options.name || 'Main Chamber';
    this.description = options.description || '';
    this.bounds = options.bounds instanceof BoundingBox
      ? options.bounds
      : new BoundingBox(
          options.bounds?.minX ?? 0,
          options.bounds?.minY ?? 0,
          options.bounds?.maxX ?? 9,
          options.bounds?.maxY ?? 9
        );
    this.tags = new Set(options.tags || ['chamber']);
    this.isDiscovered = Boolean(options.isDiscovered || false);
    this.isSecret = Boolean(options.isSecret || false);
    this.isLocked = Boolean(options.isLocked || false);
    this.colorTheme = options.colorTheme || 'default';
    this.doors = options.doors || []; // Array of door connection descriptors
    this.spawnPoint = options.spawnPoint ? Vector2D.from(options.spawnPoint) : null;
  }

  contains(x, y) {
    return this.bounds.contains(x, y);
  }

  containsVector(vec) {
    return this.bounds.containsVector(vec);
  }

  markDiscovered() {
    this.isDiscovered = true;
  }

  unlock() {
    this.isLocked = false;
  }

  lock() {
    this.isLocked = true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      bounds: this.bounds.toJSON(),
      tags: Array.from(this.tags),
      isDiscovered: this.isDiscovered,
      isSecret: this.isSecret,
      isLocked: this.isLocked,
      colorTheme: this.colorTheme,
      doors: [...this.doors],
      spawnPoint: this.spawnPoint ? this.spawnPoint.toJSON() : null
    };
  }

  static fromJSON(json) {
    return new Room({
      id: json.id,
      name: json.name,
      description: json.description,
      bounds: new BoundingBox(json.bounds.minX, json.bounds.minY, json.bounds.maxX, json.bounds.maxY),
      tags: json.tags,
      isDiscovered: json.isDiscovered,
      isSecret: json.isSecret,
      isLocked: json.isLocked,
      colorTheme: json.colorTheme,
      doors: json.doors,
      spawnPoint: json.spawnPoint ? Vector2D.from(json.spawnPoint) : null
    });
  }
}

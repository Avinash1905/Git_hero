/**
 * GitQuest Engine - SpatialIndex
 * High-performance 2D spatial hash grid for fast O(1) coordinate queries.
 */

import { Vector2D } from '../core/Types.js';

export class SpatialIndex {
  constructor(cellSize = 1) {
    this.cellSize = cellSize;
    this.grid = new Map(); // "cellX,cellY" -> Set<Entity>
    this.entityPositions = new Map(); // entityId -> "cellX,cellY"
  }

  _hash(x, y) {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  insert(entity) {
    if (!entity || !entity.id || entity.position === undefined) return;
    const key = this._hash(entity.position.x, entity.position.y);

    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }

    this.grid.get(key).add(entity);
    this.entityPositions.set(entity.id, key);
  }

  remove(entity) {
    if (!entity || !entity.id) return;
    const key = this.entityPositions.get(entity.id);
    if (!key) return;

    if (this.grid.has(key)) {
      const set = this.grid.get(key);
      set.delete(entity);
      if (set.size === 0) {
        this.grid.delete(key);
      }
    }

    this.entityPositions.delete(entity.id);
  }

  update(entity) {
    if (!entity || !entity.id || entity.position === undefined) return;
    const oldKey = this.entityPositions.get(entity.id);
    const newKey = this._hash(entity.position.x, entity.position.y);

    if (oldKey === newKey) return;

    if (oldKey && this.grid.has(oldKey)) {
      const set = this.grid.get(oldKey);
      set.delete(entity);
      if (set.size === 0) this.grid.delete(oldKey);
    }

    if (!this.grid.has(newKey)) {
      this.grid.set(newKey, new Set());
    }
    this.grid.get(newKey).add(entity);
    this.entityPositions.set(entity.id, newKey);
  }

  query(x, y) {
    const key = this._hash(x, y);
    if (!this.grid.has(key)) return [];
    return Array.from(this.grid.get(key));
  }

  queryRadius(centerX, centerY, radius) {
    const results = new Set();
    const minX = centerX - radius;
    const maxX = centerX + radius;
    const minY = centerY - radius;
    const maxY = centerY + radius;

    for (let y = minY; y <= maxY; y += this.cellSize) {
      for (let x = minX; x <= maxX; x += this.cellSize) {
        const entities = this.query(x, y);
        for (const e of entities) {
          if (e.position) {
            const dist = Vector2D.from(e.position).manhattanDistance({ x: centerX, y: centerY });
            if (dist <= radius) {
              results.add(e);
            }
          }
        }
      }
    }

    return Array.from(results);
  }

  queryBox(minX, minY, maxX, maxY) {
    const results = new Set();
    for (let y = minY; y <= maxY; y += this.cellSize) {
      for (let x = minX; x <= maxX; x += this.cellSize) {
        const list = this.query(x, y);
        for (const e of list) {
          results.add(e);
        }
      }
    }
    return Array.from(results);
  }

  clear() {
    this.grid.clear();
    this.entityPositions.clear();
  }
}

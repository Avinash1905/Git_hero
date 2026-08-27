/**
 * GitQuest Game Engine: Spatial Partitioning Grid & Collision Accelerator
 */

import { MathUtils } from '../../utils/MathUtils.js';

export class SpatialGrid {
  constructor(width, height, cellSize = 1) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.grid = new Map(); // 'x,y' -> Set<Entity>
  }

  _hash(x, y) {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
  }

  insert(entity) {
    if (!entity || !entity.position) return;
    const key = this._hash(entity.position.x, entity.position.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, new Set());
    }
    this.grid.get(key).add(entity);
  }

  remove(entity, prevX, prevY) {
    const x = prevX !== undefined ? prevX : entity.position?.x;
    const y = prevY !== undefined ? prevY : entity.position?.y;
    if (x === undefined || y === undefined) return;
    const key = this._hash(x, y);
    if (this.grid.has(key)) {
      this.grid.get(key).delete(entity);
      if (this.grid.get(key).size === 0) {
        this.grid.delete(key);
      }
    }
  }

  update(entity, prevX, prevY) {
    this.remove(entity, prevX, prevY);
    this.insert(entity);
  }

  queryPoint(x, y) {
    const key = this._hash(x, y);
    if (!this.grid.has(key)) return [];
    return Array.from(this.grid.get(key));
  }

  queryRadius(centerX, centerY, radius) {
    const results = new Set();
    const minX = Math.max(0, centerX - radius);
    const maxX = Math.min(this.width, centerX + radius);
    const minY = Math.max(0, centerY - radius);
    const maxY = Math.min(this.height, centerY + radius);

    for (let x = minX; x <= maxX; x += this.cellSize) {
      for (let y = minY; y <= maxY; y += this.cellSize) {
        const entities = this.queryPoint(x, y);
        for (const e of entities) {
          const dist = MathUtils.clamp(
            Math.sqrt((e.position.x - centerX) ** 2 + (e.position.y - centerY) ** 2),
            0,
            1000
          );
          if (dist <= radius) {
            results.add(e);
          }
        }
      }
    }

    return Array.from(results);
  }

  clear() {
    this.grid.clear();
  }
}

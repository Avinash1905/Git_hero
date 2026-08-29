/**
 * GitQuest Game Engine - Spatial Partitioning Grid
 * 2D Uniform Spatial Hash Grid for high-performance entity indexing,
 * broadphase collision tests, radius proximity queries, and raycast acceleration.
 */

import { Vector2D } from '../core/MathUtils.js';

export class SpatialPartitioningGrid {
  constructor(cellSize = 2, worldWidth = 32, worldHeight = 32) {
    this.cellSize = Math.max(1, cellSize);
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.buckets = new Map(); // hashKey -> Set of entityIds
    this.entityIndex = new Map(); // entityId -> { pos, size, type, data, currentBucketKeys: [] }
  }

  hashCoords(cellX, cellY) {
    return `${cellX}_${cellY}`;
  }

  getCellCoords(x, y) {
    return {
      cellX: Math.floor(x / this.cellSize),
      cellY: Math.floor(y / this.cellSize)
    };
  }

  insert(entityId, position, type = 'GENERIC', size = 1, data = {}) {
    this.remove(entityId);

    const minCell = this.getCellCoords(position.x, position.y);
    const maxCell = this.getCellCoords(position.x + size - 0.01, position.y + size - 0.01);

    const bucketKeys = [];
    for (let cx = minCell.cellX; cx <= maxCell.cellX; cx++) {
      for (let cy = minCell.cellY; cy <= maxCell.cellY; cy++) {
        const key = this.hashCoords(cx, cy);
        if (!this.buckets.has(key)) {
          this.buckets.set(key, new Set());
        }
        this.buckets.get(key).add(entityId);
        bucketKeys.push(key);
      }
    }

    this.entityIndex.set(entityId, {
      id: entityId,
      pos: new Vector2D(position.x, position.y),
      size,
      type,
      data,
      currentBucketKeys: bucketKeys
    });
  }

  updatePosition(entityId, newPosition) {
    const record = this.entityIndex.get(entityId);
    if (!record) return;
    this.insert(entityId, newPosition, record.type, record.size, record.data);
  }

  remove(entityId) {
    const record = this.entityIndex.get(entityId);
    if (!record) return;

    for (const key of record.currentBucketKeys) {
      const bucket = this.buckets.get(key);
      if (bucket) {
        bucket.delete(entityId);
        if (bucket.size === 0) {
          this.buckets.delete(key);
        }
      }
    }

    this.entityIndex.delete(entityId);
  }

  queryRadius(centerPos, radius) {
    const minCell = this.getCellCoords(centerPos.x - radius, centerPos.y - radius);
    const maxCell = this.getCellCoords(centerPos.x + radius, centerPos.y + radius);

    const candidates = new Set();
    for (let cx = minCell.cellX; cx <= maxCell.cellX; cx++) {
      for (let cy = minCell.cellY; cy <= maxCell.cellY; cy++) {
        const key = this.hashCoords(cx, cy);
        const bucket = this.buckets.get(key);
        if (bucket) {
          for (const id of bucket) {
            candidates.add(id);
          }
        }
      }
    }

    const results = [];
    const r2 = radius * radius;
    for (const id of candidates) {
      const ent = this.entityIndex.get(id);
      if (ent) {
        const dx = ent.pos.x - centerPos.x;
        const dy = ent.pos.y - centerPos.y;
        if (dx * dx + dy * dy <= r2) {
          results.push(ent);
        }
      }
    }

    return results;
  }

  queryRaycast(startPos, direction, maxDistance) {
    const hits = [];
    const dir = direction.normalize();
    const stepSize = this.cellSize * 0.5;
    let traveled = 0;

    const visitedEntities = new Set();

    while (traveled <= maxDistance) {
      const currentPt = startPos.add(dir.multiply(traveled));
      const { cellX, cellY } = this.getCellCoords(currentPt.x, currentPt.y);
      const key = this.hashCoords(cellX, cellY);
      const bucket = this.buckets.get(key);

      if (bucket) {
        for (const id of bucket) {
          if (!visitedEntities.has(id)) {
            visitedEntities.add(id);
            const ent = this.entityIndex.get(id);
            if (ent) {
              hits.push({ entity: ent, distance: traveled });
            }
          }
        }
      }

      traveled += stepSize;
    }

    return hits;
  }

  clear() {
    this.buckets.clear();
    this.entityIndex.clear();
  }
}

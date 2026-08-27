/**
 * GitQuest Engine - Spatial Partition QuadTree
 * High-performance 2D QuadTree for managing dense entity clusters in large 36x36 master arenas.
 */

import { BoundingBox, Vector2D } from '../core/Types.js';

export class QuadTreeNode {
  constructor(bounds, capacity = 4, maxDepth = 6, depth = 0) {
    this.bounds = bounds instanceof BoundingBox ? bounds : new BoundingBox(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    this.capacity = capacity;
    this.maxDepth = maxDepth;
    this.depth = depth;
    this.entities = [];
    this.divided = false;
    this.northWest = null;
    this.northEast = null;
    this.southWest = null;
    this.southEast = null;
  }

  subdivide() {
    const x = this.bounds.minX;
    const y = this.bounds.minY;
    const midX = Math.floor((this.bounds.minX + this.bounds.maxX) / 2);
    const midY = Math.floor((this.bounds.minY + this.bounds.maxY) / 2);
    const d = this.depth + 1;

    this.northWest = new QuadTreeNode(new BoundingBox(x, y, midX, midY), this.capacity, this.maxDepth, d);
    this.northEast = new QuadTreeNode(new BoundingBox(midX + 1, y, this.bounds.maxX, midY), this.capacity, this.maxDepth, d);
    this.southWest = new QuadTreeNode(new BoundingBox(x, midY + 1, midX, this.bounds.maxY), this.capacity, this.maxDepth, d);
    this.southEast = new QuadTreeNode(new BoundingBox(midX + 1, midY + 1, this.bounds.maxX, this.bounds.maxY), this.capacity, this.maxDepth, d);

    this.divided = true;

    // Distribute existing entities
    const oldEntities = this.entities;
    this.entities = [];
    for (const ent of oldEntities) {
      this.insert(ent);
    }
  }

  insert(entity) {
    if (!entity || !entity.position) return false;
    if (!this.bounds.contains(entity.position.x, entity.position.y)) {
      return false;
    }

    if (this.entities.length < this.capacity || this.depth >= this.maxDepth) {
      this.entities.push(entity);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northWest.insert(entity) ||
      this.northEast.insert(entity) ||
      this.southWest.insert(entity) ||
      this.southEast.insert(entity)
    );
  }

  query(rangeBox, found = []) {
    if (!this.bounds.intersects(rangeBox)) {
      return found;
    }

    for (const ent of this.entities) {
      if (rangeBox.contains(ent.position.x, ent.position.y)) {
        found.push(ent);
      }
    }

    if (this.divided) {
      this.northWest.query(rangeBox, found);
      this.northEast.query(rangeBox, found);
      this.southWest.query(rangeBox, found);
      this.southEast.query(rangeBox, found);
    }

    return found;
  }

  clear() {
    this.entities = [];
    if (this.divided) {
      this.northWest.clear();
      this.northEast.clear();
      this.southWest.clear();
      this.southEast.clear();
      this.divided = false;
    }
  }
}

export class SpatialQuadTree {
  constructor(width = 36, height = 36, capacity = 4) {
    this.bounds = new BoundingBox(0, 0, width - 1, height - 1);
    this.root = new QuadTreeNode(this.bounds, capacity);
  }

  insert(entity) {
    return this.root.insert(entity);
  }

  queryRadius(centerX, centerY, radius) {
    const rangeBox = new BoundingBox(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    const candidates = this.root.query(rangeBox, []);
    return candidates.filter(e => {
      const dist = Vector2D.from(e.position).manhattanDistance({ x: centerX, y: centerY });
      return dist <= radius;
    });
  }

  clear() {
    this.root.clear();
  }
}

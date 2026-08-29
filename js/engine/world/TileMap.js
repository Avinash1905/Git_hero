/**
 * GitQuest Engine - TileMap
 * Multi-layer 2D tile matrix with fast lookups, bounds checking, and bulk mutations.
 */

import { TileType } from '../core/Constants.js';
import { Vector2D, BoundingBox } from '../core/Types.js';

export class TileMap {
  constructor(width = 10, height = 10, defaultTile = TileType.FLOOR) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.defaultTile = defaultTile;
    this.layers = {
      base: new Array(this.width * this.height).fill(defaultTile),
      overlay: new Array(this.width * this.height).fill(TileType.EMPTY)
    };
  }

  _index(x, y) {
    return y * this.width + x;
  }

  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isInBoundsVector(vec) {
    return this.isInBounds(vec.x, vec.y);
  }

  getTile(x, y, layer = 'base') {
    if (!this.isInBounds(x, y)) return TileType.VOID;
    const targetLayer = this.layers[layer] || this.layers.base;
    return targetLayer[this._index(x, y)];
  }

  setTile(x, y, tileType, layer = 'base') {
    if (!this.isInBounds(x, y)) return false;
    const targetLayer = this.layers[layer];
    if (!targetLayer) return false;
    targetLayer[this._index(x, y)] = tileType;
    return true;
  }

  fill(tileType, layer = 'base') {
    const targetLayer = this.layers[layer];
    if (!targetLayer) return;
    targetLayer.fill(tileType);
  }

  fillRect(minX, minY, maxX, maxY, tileType, layer = 'base') {
    const startX = Math.max(0, minX);
    const endX = Math.min(this.width - 1, maxX);
    const startY = Math.max(0, minY);
    const endY = Math.min(this.height - 1, maxY);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        this.setTile(x, y, tileType, layer);
      }
    }
  }

  setPerimeter(tileType = TileType.WALL, layer = 'base') {
    for (let x = 0; x < this.width; x++) {
      this.setTile(x, 0, tileType, layer);
      this.setTile(x, this.height - 1, tileType, layer);
    }
    for (let y = 0; y < this.height; y++) {
      this.setTile(0, y, tileType, layer);
      this.setTile(this.width - 1, y, tileType, layer);
    }
  }

  isWall(x, y) {
    const tile = this.getTile(x, y);
    return tile === TileType.WALL || tile === TileType.WALL_BREAKABLE || tile === TileType.VOID;
  }

  isHazard(x, y) {
    const tile = this.getTile(x, y);
    const overlay = this.getTile(x, y, 'overlay');
    return (
      tile === TileType.HAZARD ||
      tile === TileType.HAZARD_LASER ||
      tile === TileType.HAZARD_CONFLICT ||
      overlay === TileType.HAZARD ||
      overlay === TileType.HAZARD_LASER ||
      overlay === TileType.HAZARD_CONFLICT
    );
  }

  isWalkable(x, y) {
    if (!this.isInBounds(x, y)) return false;
    return !this.isWall(x, y) && !this.isHazard(x, y);
  }

  getBoundingBox() {
    return new BoundingBox(0, 0, this.width - 1, this.height - 1);
  }

  clone() {
    const clone = new TileMap(this.width, this.height, this.defaultTile);
    clone.layers.base = [...this.layers.base];
    clone.layers.overlay = [...this.layers.overlay];
    return clone;
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      defaultTile: this.defaultTile,
      layers: {
        base: [...this.layers.base],
        overlay: [...this.layers.overlay]
      }
    };
  }

  static fromJSON(json) {
    const tm = new TileMap(json.width, json.height, json.defaultTile);
    if (json.layers) {
      if (json.layers.base) tm.layers.base = [...json.layers.base];
      if (json.layers.overlay) tm.layers.overlay = [...json.layers.overlay];
    }
    return tm;
  }
}

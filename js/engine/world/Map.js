/**
 * GitQuest Engine - WorldMap (Map.js)
 * High-level map representation uniting grid geometry, tile maps, and metadata.
 */

import { TileMap } from './TileMap.js';
import { TileType } from '../core/Constants.js';
import { BoundingBox } from '../core/Types.js';

export class GameMap {
  constructor(options = {}) {
    this.id = options.id || 'map_main';
    this.name = options.name || 'Level Arena';
    this.width = options.width || 10;
    this.height = options.height || 10;
    this.gridSize = options.gridSize || Math.max(this.width, this.height);
    this.tileMap = options.tileMap instanceof TileMap
      ? options.tileMap
      : new TileMap(this.width, this.height, options.defaultTile || TileType.FLOOR);
    this.theme = options.theme || 'terminal';
  }

  isInBounds(x, y) {
    return this.tileMap.isInBounds(x, y);
  }

  isWall(x, y) {
    return this.tileMap.isWall(x, y);
  }

  isHazard(x, y) {
    return this.tileMap.isHazard(x, y);
  }

  isWalkable(x, y) {
    return this.tileMap.isWalkable(x, y);
  }

  getBounds() {
    return new BoundingBox(0, 0, this.width - 1, this.height - 1);
  }

  clone() {
    return new GameMap({
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      gridSize: this.gridSize,
      tileMap: this.tileMap.clone(),
      theme: this.theme
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      gridSize: this.gridSize,
      tileMap: this.tileMap.toJSON(),
      theme: this.theme
    };
  }

  static fromJSON(json) {
    return new GameMap({
      id: json.id,
      name: json.name,
      width: json.width,
      height: json.height,
      gridSize: json.gridSize,
      tileMap: TileMap.fromJSON(json.tileMap),
      theme: json.theme
    });
  }
}

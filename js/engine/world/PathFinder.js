/**
 * GitQuest Engine - PathFinder
 * High-performance A* and Dijkstra path solver with heuristic weights and obstacle penalties.
 */

import { Direction, DirectionVectors } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class PathFinder {
  constructor(tileMap, spatialIndex = null) {
    this.tileMap = tileMap;
    this.spatialIndex = spatialIndex;
  }

  setTileMap(tileMap) {
    this.tileMap = tileMap;
  }

  setSpatialIndex(spatialIndex) {
    this.spatialIndex = spatialIndex;
  }

  isWalkable(x, y, ignoreEntity = null) {
    if (!this.tileMap || !this.tileMap.isInBounds(x, y)) return false;
    if (!this.tileMap.isWalkable(x, y)) return false;

    if (this.spatialIndex) {
      const entities = this.spatialIndex.query(x, y);
      for (const ent of entities) {
        if (ent === ignoreEntity) continue;
        if (ent.isSolid && ent.isSolid()) {
          return false;
        }
      }
    }

    return true;
  }

  findPath(startCoord, targetCoord, options = {}) {
    const start = Vector2D.from(startCoord);
    const target = Vector2D.from(targetCoord);
    const ignoreEntity = options.ignoreEntity || null;
    const maxSteps = options.maxSteps || 5000;

    if (start.equals(target)) return [start];

    const keyOf = (x, y) => `${x},${y}`;
    const openSet = new Map();
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const startKey = keyOf(start.x, start.y);
    gScore.set(startKey, 0);
    fScore.set(startKey, start.manhattanDistance(target));
    openSet.set(startKey, start);

    const neighbors = [
      { x: 0, y: -1, dir: Direction.UP },
      { x: 0, y: 1, dir: Direction.DOWN },
      { x: -1, y: 0, dir: Direction.LEFT },
      { x: 1, y: 0, dir: Direction.RIGHT }
    ];

    let steps = 0;
    while (openSet.size > 0 && steps < maxSteps) {
      steps++;
      let lowestF = Infinity;
      let current = null;
      let currentKey = null;

      for (const [key, node] of openSet.entries()) {
        const score = fScore.get(key) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          current = node;
          currentKey = key;
        }
      }

      if (!current) break;

      if (current.equals(target)) {
        const path = [current];
        let currK = currentKey;
        while (cameFrom.has(currK)) {
          const prev = cameFrom.get(currK);
          path.unshift(prev);
          currK = keyOf(prev.x, prev.y);
        }
        return path;
      }

      openSet.delete(currentKey);
      closedSet.add(currentKey);

      for (let i = 0; i < neighbors.length; i++) {
        const nx = current.x + neighbors[i].x;
        const ny = current.y + neighbors[i].y;
        const neighbor = new Vector2D(nx, ny);
        const neighborKey = keyOf(nx, ny);

        if (closedSet.has(neighborKey)) continue;

        // Must be walkable or target
        if (!neighbor.equals(target) && !this.isWalkable(nx, ny, ignoreEntity)) {
          continue;
        }

        const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;

        if (!openSet.has(neighborKey)) {
          openSet.set(neighborKey, neighbor);
        } else if (tentativeG >= (gScore.get(neighborKey) ?? Infinity)) {
          continue;
        }

        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + neighbor.manhattanDistance(target));
      }
    }

    return null;
  }

  getReachableNodes(startCoord, maxDistance = Infinity, ignoreEntity = null) {
    const start = Vector2D.from(startCoord);
    const visited = new Map(); // "x,y" -> distance
    const queue = [{ coord: start, dist: 0 }];
    const keyOf = (x, y) => `${x},${y}`;

    visited.set(keyOf(start.x, start.y), 0);

    const neighbors = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    while (queue.length > 0) {
      const { coord, dist } = queue.shift();
      if (dist >= maxDistance) continue;

      for (const n of neighbors) {
        const nx = coord.x + n.x;
        const ny = coord.y + n.y;
        const nKey = keyOf(nx, ny);

        if (!visited.has(nKey) && this.isWalkable(nx, ny, ignoreEntity)) {
          visited.set(nKey, dist + 1);
          queue.push({ coord: new Vector2D(nx, ny), dist: dist + 1 });
        }
      }
    }

    return Array.from(visited.entries()).map(([k, d]) => {
      const [x, y] = k.split(',').map(Number);
      return { coord: new Vector2D(x, y), distance: d };
    });
  }
}

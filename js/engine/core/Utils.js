/**
 * GitQuest Engine - Core Utilities
 * High-performance math routines, pathfinding algorithms, deep cloning, and string helpers.
 */

import { Direction, DirectionVectors } from './Constants.js';
import { Vector2D } from './Types.js';

export class EngineUtils {
  /**
   * Fast deep clone using structuredClone or fallback for plain objects
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Vector2D) return new Vector2D(obj.x, obj.y);

    if (Array.isArray(obj)) {
      const copy = new Array(obj.length);
      for (let i = 0; i < obj.length; i++) {
        copy[i] = EngineUtils.deepClone(obj[i]);
      }
      return copy;
    }

    const copy = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      copy[key] = EngineUtils.deepClone(obj[key]);
    }
    return copy;
  }

  /**
   * Fast SHA-1-like 7-character hex hash generator for git commit nodes
   */
  static generateGitHash(seed = '') {
    let hash = 0x811c9dc5;
    const str = `${seed}_${Date.now()}_${Math.random()}`;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).padStart(7, '0').substring(0, 7);
  }

  /**
   * Generates a unique UUID v4 string
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Formats elapsed seconds to MM:SS string
   */
  static formatTime(seconds) {
    const s = Math.max(0, Math.floor(seconds || 0));
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  /**
   * Clamps a value between min and max
   */
  static clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Converts a direction string to normalized Direction enum
   */
  static normalizeDirection(dir) {
    if (!dir) return Direction.NONE;
    const d = String(dir).trim().toLowerCase();
    if (d === 'left' || d === 'l' || d === 'west' || d === 'w') return Direction.LEFT;
    if (d === 'right' || d === 'r' || d === 'east' || d === 'e') return Direction.RIGHT;
    if (d === 'up' || d === 'u' || d === 'north' || d === 'n') return Direction.UP;
    if (d === 'down' || d === 'd' || d === 'south' || d === 's') return Direction.DOWN;
    return Direction.NONE;
  }

  /**
   * Converts a direction to a 2D delta vector
   */
  static directionToVector(dir) {
    const norm = EngineUtils.normalizeDirection(dir);
    return DirectionVectors[norm] || DirectionVectors[Direction.NONE];
  }

  /**
   * Converts a 2D delta vector to a Direction enum
   */
  static vectorToDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? Direction.RIGHT : Direction.LEFT;
    } else if (dy !== 0) {
      return dy > 0 ? Direction.DOWN : Direction.UP;
    }
    return Direction.NONE;
  }

  /**
   * Raycasts along a line in the grid until an obstacle or boundary is hit
   */
  static raycast(startCoord, direction, maxDistance, isBlockedFn) {
    const dirVec = EngineUtils.directionToVector(direction);
    if (dirVec.x === 0 && dirVec.y === 0) {
      return { hit: false, distance: 0, path: [], endCoord: Vector2D.from(startCoord) };
    }

    const path = [];
    let current = Vector2D.from(startCoord);
    let hit = false;
    let hitCoord = null;

    for (let dist = 1; dist <= maxDistance; dist++) {
      current = current.add(dirVec);
      path.push(current);

      if (isBlockedFn(current.x, current.y)) {
        hit = true;
        hitCoord = current;
        break;
      }
    }

    return {
      hit,
      distance: hit ? path.length : maxDistance,
      path,
      hitCoord,
      endCoord: current
    };
  }

  /**
   * Breadth-First-Search flood fill to find all reachable floor coordinates
   */
  static getReachableArea(startCoord, isWalkableFn, maxBounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 }) {
    const visited = new Set();
    const queue = [Vector2D.from(startCoord)];
    const keyOf = (v) => `${v.x},${v.y}`;

    visited.add(keyOf(startCoord));
    const reachable = [Vector2D.from(startCoord)];

    const neighbors = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    while (queue.length > 0) {
      const curr = queue.shift();

      for (let i = 0; i < neighbors.length; i++) {
        const nextX = curr.x + neighbors[i].x;
        const nextY = curr.y + neighbors[i].y;

        if (nextX < maxBounds.minX || nextX > maxBounds.maxX || nextY < maxBounds.minY || nextY > maxBounds.maxY) {
          continue;
        }

        const nextKey = `${nextX},${nextY}`;
        if (!visited.has(nextKey) && isWalkableFn(nextX, nextY)) {
          visited.add(nextKey);
          const nextVec = new Vector2D(nextX, nextY);
          reachable.push(nextVec);
          queue.push(nextVec);
        }
      }
    }

    return reachable;
  }

  /**
   * A* Pathfinding algorithm on grid
   */
  static findPath(startCoord, goalCoord, isWalkableFn, maxBounds = { minX: 0, minY: 0, maxX: 100, maxY: 100 }) {
    const start = Vector2D.from(startCoord);
    const goal = Vector2D.from(goalCoord);

    if (start.equals(goal)) return [start];

    const keyOf = (v) => `${v.x},${v.y}`;
    const openSet = new Map();
    const closedSet = new Set();
    const cameFrom = new Map();

    const gScore = new Map();
    const fScore = new Map();

    const startKey = keyOf(start);
    gScore.set(startKey, 0);
    fScore.set(startKey, start.manhattanDistance(goal));
    openSet.set(startKey, start);

    const neighbors = [
      { x: 0, y: -1, dir: Direction.UP },
      { x: 0, y: 1, dir: Direction.DOWN },
      { x: -1, y: 0, dir: Direction.LEFT },
      { x: 1, y: 0, dir: Direction.RIGHT }
    ];

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let current = null;
      let lowestF = Infinity;
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

      if (current.equals(goal)) {
        // Reconstruct path
        const path = [current];
        let currK = currentKey;
        while (cameFrom.has(currK)) {
          const prev = cameFrom.get(currK);
          path.unshift(prev);
          currK = keyOf(prev);
        }
        return path;
      }

      openSet.delete(currentKey);
      closedSet.add(currentKey);

      for (let i = 0; i < neighbors.length; i++) {
        const nextX = current.x + neighbors[i].x;
        const nextY = current.y + neighbors[i].y;
        const neighbor = new Vector2D(nextX, nextY);
        const neighborKey = keyOf(neighbor);

        if (closedSet.has(neighborKey)) continue;

        if (nextX < maxBounds.minX || nextX > maxBounds.maxX || nextY < maxBounds.minY || nextY > maxBounds.maxY) {
          continue;
        }

        // Must be walkable or the goal itself
        if (!neighbor.equals(goal) && !isWalkableFn(nextX, nextY)) {
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
        fScore.set(neighborKey, tentativeG + neighbor.manhattanDistance(goal));
      }
    }

    return null; // No path found
  }
}

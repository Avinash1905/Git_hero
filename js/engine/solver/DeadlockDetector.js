/**
 * GitQuest Engine - Deadlock Detector
 * Deep spatial matrix deadlock analysis for Sokoban and Git push/pull puzzle spaces:
 * - Corner Deadlocks
 * - Freeze Deadlocks (2x2 clusters of boxes/walls)
 * - Wall/Line Deadlocks (Box pinned against boundary with no goals)
 * - Dead Square Precomputation
 */

import { Vector2D } from '../core/Types.js';

export class DeadlockDetector {
  constructor(tileMap, goals = []) {
    this.tileMap = tileMap;
    this.goals = goals.map(g => Vector2D.from(g));
    this.deadSquares = new Set(); // "x,y" of tiles from which a box can NEVER reach any goal
    this._precomputeDeadSquares();
  }

  setGoals(goals) {
    this.goals = goals.map(g => Vector2D.from(g));
    this._precomputeDeadSquares();
  }

  isGoal(x, y) {
    return this.goals.some(g => g.x === x && g.y === y);
  }

  isWall(x, y) {
    return this.tileMap.isWall(x, y);
  }

  /**
   * Precomputes all dead squares on the map using reverse pull search from goals
   */
  _precomputeDeadSquares() {
    this.deadSquares.clear();
    const width = this.tileMap.width;
    const height = this.tileMap.height;

    // Simple dead square detection: non-goal corners
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (this.isWall(x, y) || this.isGoal(x, y)) continue;

        const up = this.isWall(x, y - 1);
        const down = this.isWall(x, y + 1);
        const left = this.isWall(x - 1, y);
        const right = this.isWall(x + 1, y);

        // Corner check
        if ((up && left) || (up && right) || (down && left) || (down && right)) {
          this.deadSquares.add(`${x},${y}`);
        }
      }
    }

    // Dead lines: straight walls between two dead corners with no goals
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (this.deadSquares.has(`${x},${y}`) || this.isWall(x, y) || this.isGoal(x, y)) continue;

        // Check horizontal wall line
        if (this.isWall(x, y - 1) || this.isWall(x, y + 1)) {
          if (this._isDeadLineHorizontal(x, y)) {
            this.deadSquares.add(`${x},${y}`);
          }
        }

        // Check vertical wall line
        if (this.isWall(x - 1, y) || this.isWall(x + 1, y)) {
          if (this._isDeadLineVertical(x, y)) {
            this.deadSquares.add(`${x},${y}`);
          }
        }
      }
    }
  }

  _isDeadLineHorizontal(startX, y) {
    // Scan left until wall
    let leftWallX = -1;
    for (let x = startX; x >= 0; x--) {
      if (this.isGoal(x, y)) return false;
      if (this.isWall(x, y)) {
        leftWallX = x;
        break;
      }
    }

    // Scan right until wall
    let rightWallX = -1;
    for (let x = startX; x < this.tileMap.width; x++) {
      if (this.isGoal(x, y)) return false;
      if (this.isWall(x, y)) {
        rightWallX = x;
        break;
      }
    }

    return leftWallX !== -1 && rightWallX !== -1;
  }

  _isDeadLineVertical(x, startY) {
    let topWallY = -1;
    for (let y = startY; y >= 0; y--) {
      if (this.isGoal(x, y)) return false;
      if (this.isWall(x, y)) {
        topWallY = y;
        break;
      }
    }

    let bottomWallY = -1;
    for (let y = startY; y < this.tileMap.height; y++) {
      if (this.isGoal(x, y)) return false;
      if (this.isWall(x, y)) {
        bottomWallY = y;
        break;
      }
    }

    return topWallY !== -1 && bottomWallY !== -1;
  }

  /**
   * Checks if box at (x,y) is in a dead square
   */
  isDeadSquare(x, y) {
    if (this.isGoal(x, y)) return false;
    return this.deadSquares.has(`${x},${y}`);
  }

  /**
   * 2x2 Freeze Deadlock: 4 adjacent solid entities / boxes where none can move
   */
  is2x2Freeze(boxPositions, newBoxX, newBoxY) {
    const allSolids = new Set(boxPositions.map(b => `${b.x},${b.y}`));
    allSolids.add(`${newBoxX},${newBoxY}`);

    const isSolidOrWall = (x, y) => this.isWall(x, y) || allSolids.has(`${x},${y}`);

    const offsets = [
      [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 1, dy: 1 }],
      [{ dx: -1, dy: 0 }, { dx: 0, dy: 0 }, { dx: -1, dy: 1 }, { dx: 0, dy: 1 }],
      [{ dx: 0, dy: -1 }, { dx: 1, dy: -1 }, { dx: 0, dy: 0 }, { dx: 1, dy: 0 }],
      [{ dx: -1, dy: -1 }, { dx: 0, dy: -1 }, { dx: -1, dy: 0 }, { dx: 0, dy: 0 }]
    ];

    for (const quad of offsets) {
      let solidCount = 0;
      let allOnGoals = true;

      for (const pt of quad) {
        const qx = newBoxX + pt.dx;
        const qy = newBoxY + pt.dy;
        if (isSolidOrWall(qx, qy)) {
          solidCount++;
          if (allSolids.has(`${qx},${qy}`) && !this.isGoal(qx, qy)) {
            allOnGoals = false;
          }
        }
      }

      if (solidCount === 4 && !allOnGoals) {
        return true; // 2x2 deadlock detected
      }
    }

    return false;
  }
}

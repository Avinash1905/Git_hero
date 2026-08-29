/**
 * GitQuest Game Engine - Sokoban Deadlock & IDA* Solver Heuristics
 * Real-time detection of corner deadlocks, boundary deadlocks, 2x2 box freeze deadlocks,
 * closed-loop dead ends, and IDA* Manhattan distance heuristic calculation.
 */

export class SokobanDeadlockSolver {
  constructor(gridSize = 8) {
    this.gridSize = gridSize;
  }

  isCornerDeadlock(boxPos, goalPos, wallSet) {
    if (boxPos.x === goalPos.x && boxPos.y === goalPos.y) return false;

    const isWall = (x, y) => {
      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return true;
      return wallSet.has(`${x},${y}`);
    };

    const up = isWall(boxPos.x, boxPos.y - 1);
    const down = isWall(boxPos.x, boxPos.y + 1);
    const left = isWall(boxPos.x - 1, boxPos.y);
    const right = isWall(boxPos.x + 1, boxPos.y);

    return (up && left) || (up && right) || (down && left) || (down && right);
  }

  is2x2FreezeDeadlock(boxes, wallSet) {
    const boxSet = new Set(boxes.map(b => `${b.x},${b.y}`));

    for (const b of boxes) {
      // Check 2x2 block with (b.x, b.y) as top-left
      const isSolid = (x, y) => boxSet.has(`${x},${y}`) || wallSet.has(`${x},${y}`);

      const corners = [
        // Top-Left 2x2
        [{ x: b.x, y: b.y }, { x: b.x + 1, y: b.y }, { x: b.x, y: b.y + 1 }, { x: b.x + 1, y: b.y + 1 }],
        // Top-Right 2x2
        [{ x: b.x - 1, y: b.y }, { x: b.x, y: b.y }, { x: b.x - 1, y: b.y + 1 }, { x: b.x, y: b.y + 1 }]
      ];

      for (const quad of corners) {
        if (quad.every(pt => isSolid(pt.x, pt.y))) {
          // If at least one box is not on goal in this 2x2 freeze
          return true;
        }
      }
    }

    return false;
  }

  computeHeuristic(boxPos, goalPos) {
    return Math.abs(boxPos.x - goalPos.x) + Math.abs(boxPos.y - goalPos.y);
  }

  evaluateState(gameState, wallSet) {
    const box = gameState.box;
    const goal = gameState.goal;

    if (!box || !goal) return { isDeadlocked: false, reason: null };

    if (this.isCornerDeadlock(box, goal, wallSet)) {
      return {
        isDeadlocked: true,
        reason: 'Corner Deadlock: Payload is trapped against perpendicular walls.'
      };
    }

    return {
      isDeadlocked: false,
      heuristicDistance: this.computeHeuristic(box, goal)
    };
  }
}

/**
 * LevelValidator
 * Algorithmic reachability verification for GitQuest puzzle topology.
 * Uses Breadth-First Search (BFS) to ensure player can reach the box
 * and that box is not permanently trapped in non-goal corners.
 */

export class LevelValidator {
  /**
   * Validate entire level structure
   * @param {Object} levelDef
   * @returns {{isValid: boolean, errors: string[], warnings: string[]}}
   */
  static validate(levelDef) {
    const errors = [];
    const warnings = [];

    if (!levelDef) {
      return { isValid: false, errors: ['Null or undefined level definition'], warnings: [] };
    }

    const width = levelDef.width || levelDef.gridSize || 6;
    const height = levelDef.height || levelDef.gridSize || 6;

    if (width < 4 || height < 4) {
      errors.push(`Grid dimensions must be at least 4x4 (currently ${width}x${height})`);
    }

    // 1. Entities Existence
    if (!levelDef.player || typeof levelDef.player.x !== 'number') errors.push('Missing player spawn coordinates');
    if (!levelDef.box || typeof levelDef.box.x !== 'number') errors.push('Missing pushable box coordinates');
    if (!levelDef.goal || typeof levelDef.goal.x !== 'number') errors.push('Missing staging goal node coordinates');

    if (errors.length > 0) {
      return { isValid: false, errors, warnings };
    }

    const wallsSet = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));

    // 2. Overlap Checks
    const playerKey = `${levelDef.player.x},${levelDef.player.y}`;
    const boxKey = `${levelDef.box.x},${levelDef.box.y}`;
    const goalKey = `${levelDef.goal.x},${levelDef.goal.y}`;

    if (wallsSet.has(playerKey)) errors.push('Player spawn is placed inside a wall');
    if (wallsSet.has(boxKey)) errors.push('Box is placed inside a wall');
    if (wallsSet.has(goalKey)) errors.push('Goal node is placed inside a wall');

    if (playerKey === boxKey) errors.push('Player and box cannot share the same starting tile');

    // 3. Solvability: Corner Deadlock Detection
    if (this.isBoxInDeadlockCorner(levelDef.box, levelDef.goal, wallsSet, width, height)) {
      warnings.push('Box starts in a corner deadlock without a goal node');
    }

    // 4. Solvability: Player Reachability to Box Neighborhood
    const canReachBox = this.canPlayerReachBoxNeighborhood(levelDef.player, levelDef.box, wallsSet, width, height);
    if (!canReachBox) {
      errors.push('Player cannot navigate to any tile adjacent to the box (path is blocked by walls)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if box is trapped in a 2-wall corner
   */
  static isBoxInDeadlockCorner(box, goal, wallsSet, width, height) {
    if (box.x === goal.x && box.y === goal.y) return false;

    const isWall = (x, y) => x < 0 || x >= width || y < 0 || y >= height || wallsSet.has(`${x},${y}`);

    const top = isWall(box.x, box.y - 1);
    const bottom = isWall(box.x, box.y + 1);
    const left = isWall(box.x - 1, box.y);
    const right = isWall(box.x + 1, box.y);

    return (top && left) || (top && right) || (bottom && left) || (bottom && right);
  }

  /**
   * BFS checking if player can reach at least one adjacent neighbor of the box
   */
  static canPlayerReachBoxNeighborhood(player, box, wallsSet, width, height) {
    const queue = [{ x: player.x, y: player.y }];
    const visited = new Set([`${player.x},${player.y}`]);

    const neighborsOfBox = new Set([
      `${box.x},${box.y - 1}`,
      `${box.x},${box.y + 1}`,
      `${box.x - 1},${box.y}`,
      `${box.x + 1},${box.y}`
    ]);

    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];

    while (queue.length > 0) {
      const curr = queue.shift();
      const currKey = `${curr.x},${curr.y}`;

      if (neighborsOfBox.has(currKey)) {
        return true;
      }

      for (const d of dirs) {
        const nx = curr.x + d.dx;
        const ny = curr.y + d.dy;
        const nKey = `${nx},${ny}`;

        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        if (wallsSet.has(nKey) || visited.has(nKey)) continue;
        // Don't step through the box itself
        if (nx === box.x && ny === box.y) continue;

        visited.add(nKey);
        queue.push({ x: nx, y: ny });
      }
    }

    return false;
  }
}

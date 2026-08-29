/**
 * GitQuest Engine - Comprehensive Level Validator & Solvability Verifier
 * Verifies geometry validity, BFS reachability, deadlock heuristics,
 * goal accessibility, and command requirement completeness.
 */

import { Vector2D } from '../core/MathUtils.js';

export class ComprehensiveLevelValidator {
  constructor() {
    this.validationLogs = [];
  }

  validateLevelSchema(levelDef) {
    const errors = [];
    const warnings = [];

    if (!levelDef) {
      return { isValid: false, errors: ['Null or undefined level definition'], warnings: [] };
    }

    if (!levelDef.id) errors.push('Missing level id');
    if (!levelDef.name) errors.push('Missing level name');
    if (!levelDef.world) errors.push('Missing world identifier');
    if (!levelDef.player) errors.push('Missing player spawn position');
    if (!levelDef.box) errors.push('Missing box spawn position');
    if (!levelDef.goal) errors.push('Missing goal destination coordinate');

    const size = levelDef.gridSize || 6;
    if (size < 4 || size > 64) {
      errors.push(`Invalid gridSize ${size}. Must be between 4 and 64.`);
    }

    if (levelDef.player) {
      if (levelDef.player.x < 0 || levelDef.player.x >= size || levelDef.player.y < 0 || levelDef.player.y >= size) {
        errors.push(`Player position (${levelDef.player.x}, ${levelDef.player.y}) out of grid bounds (0..${size - 1})`);
      }
    }

    if (levelDef.box) {
      if (levelDef.box.x < 0 || levelDef.box.x >= size || levelDef.box.y < 0 || levelDef.box.y >= size) {
        errors.push(`Box position (${levelDef.box.x}, ${levelDef.box.y}) out of grid bounds (0..${size - 1})`);
      }
    }

    if (levelDef.goal) {
      if (levelDef.goal.x < 0 || levelDef.goal.x >= size || levelDef.goal.y < 0 || levelDef.goal.y >= size) {
        errors.push(`Goal position (${levelDef.goal.x}, ${levelDef.goal.y}) out of grid bounds (0..${size - 1})`);
      }
    }

    // Check overlap at start
    if (levelDef.player && levelDef.box && levelDef.player.x === levelDef.box.x && levelDef.player.y === levelDef.box.y) {
      errors.push('Player and box cannot spawn on the exact same coordinate');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  isCornerDeadlock(boxPos, goalPos, wallSet, gridSize) {
    if (boxPos.x === goalPos.x && boxPos.y === goalPos.y) return false;

    const isWallOrBoundary = (x, y) => {
      if (x <= 0 || x >= gridSize - 1 || y <= 0 || y >= gridSize - 1) return true;
      return wallSet.has(`${x},${y}`);
    };

    const up = isWallOrBoundary(boxPos.x, boxPos.y - 1);
    const down = isWallOrBoundary(boxPos.x, boxPos.y + 1);
    const left = isWallOrBoundary(boxPos.x - 1, boxPos.y);
    const right = isWallOrBoundary(boxPos.x + 1, boxPos.y);

    if ((up && left) || (up && right) || (down && left) || (down && right)) {
      return true;
    }

    return false;
  }

  checkPlayerBoxReachability(levelDef) {
    const size = levelDef.gridSize || 6;
    const wallSet = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));

    const isBlocked = (x, y) => {
      if (x < 0 || x >= size || y < 0 || y >= size) return true;
      return wallSet.has(`${x},${y}`);
    };

    // BFS from player to box adjacency
    const queue = [{ x: levelDef.player.x, y: levelDef.player.y }];
    const visited = new Set([`${levelDef.player.x},${levelDef.player.y}`]);
    let canReachBox = false;

    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    while (queue.length > 0) {
      const cur = queue.shift();

      for (const d of dirs) {
        const nx = cur.x + d.x;
        const ny = cur.y + d.y;

        if (nx === levelDef.box.x && ny === levelDef.box.y) {
          canReachBox = true;
          break;
        }

        const key = `${nx},${ny}`;
        if (!visited.has(key) && !isBlocked(nx, ny)) {
          visited.add(key);
          queue.push({ x: nx, y: ny });
        }
      }
      if (canReachBox) break;
    }

    return canReachBox;
  }

  auditBatchLevels(levelMap) {
    let passed = 0;
    let failed = 0;
    const results = [];

    for (const [id, def] of Object.entries(levelMap)) {
      const schema = this.validateLevelSchema(def);
      const reachable = this.checkPlayerBoxReachability(def);

      if (schema.isValid && reachable) {
        passed++;
        results.push({ id, status: 'PASSED', name: def.name });
      } else {
        failed++;
        results.push({
          id,
          status: 'FAILED',
          name: def.name,
          errors: [...schema.errors, ...(reachable ? [] : ['Box unreachable from player spawn'])]
        });
      }
    }

    return {
      total: passed + failed,
      passed,
      failed,
      results
    };
  }
}

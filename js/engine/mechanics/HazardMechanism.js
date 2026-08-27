/**
 * GitHero Hazard & Deadlock Mechanism
 * Evaluates deadlock zones, memory leaks, and rogue process hazards.
 */

export class HazardMechanism {
  static checkHazardCollision(playerPos, hazards = []) {
    if (!playerPos || !hazards.length) return null;
    return hazards.find(h => h.x === playerPos.x && h.y === playerPos.y) || null;
  }

  static isBoxInDeadlock(boxPos, walls = [], gridSize = 6) {
    if (!boxPos) return false;

    const isWallOrBound = (x, y) => {
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return true;
      return walls.some(w => w.x === x && w.y === y);
    };

    // Check corner deadlocks: (Up & Left), (Up & Right), (Down & Left), (Down & Right)
    const upBlocked = isWallOrBound(boxPos.x, boxPos.y - 1);
    const downBlocked = isWallOrBound(boxPos.x, boxPos.y + 1);
    const leftBlocked = isWallOrBound(boxPos.x - 1, boxPos.y);
    const rightBlocked = isWallOrBound(boxPos.x + 1, boxPos.y);

    if ((upBlocked && leftBlocked) || (upBlocked && rightBlocked) ||
        (downBlocked && leftBlocked) || (downBlocked && rightBlocked)) {
      return true;
    }

    return false;
  }
}

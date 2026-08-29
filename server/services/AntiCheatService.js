/**
 * GitQuest Backend Service: Advanced Anti-Cheat & Impossible Move Detection
 */

export class AntiCheatService {
  static validateSessionTiming(startedAt, timeSeconds, movesCount) {
    if (!startedAt) return { isValid: false, reason: 'NO_SESSION_TIMESTAMP' };

    const startTime = new Date(startedAt).getTime();
    const now = Date.now();
    const actualElapsedSec = (now - startTime) / 1000;

    // Minimum 100ms per physical move human threshold
    const minPossibleSec = movesCount * 0.1;
    if (timeSeconds < minPossibleSec) {
      return { isValid: false, reason: 'IMPOSSIBLE_SPEEDHACK' };
    }

    // Elapsed time cannot exceed real wall clock by unreasonable margin
    if (actualElapsedSec + 2 < timeSeconds) {
      return { isValid: false, reason: 'TIME_INFLATION' };
    }

    return { isValid: true };
  }

  static validateMovePath(startPos, endPos, movesCount, walls = [], gridSize = 10) {
    // Manhattan distance must be <= movesCount
    const minDistance = Math.abs(endPos.x - startPos.x) + Math.abs(endPos.y - startPos.y);
    if (movesCount < minDistance) {
      return { isValid: false, reason: 'TELEPORT_DETECTED' };
    }

    // Coordinates must be within bounds
    if (endPos.x < 0 || endPos.x >= gridSize || endPos.y < 0 || endPos.y >= gridSize) {
      return { isValid: false, reason: 'COORDINATE_OUT_OF_BOUNDS' };
    }

    // End coordinate cannot be inside a static wall
    if (walls.some(w => w.x === endPos.x && w.y === endPos.y)) {
      return { isValid: false, reason: 'NOCLIP_WALL_COLLISION' };
    }

    return { isValid: true };
  }
}

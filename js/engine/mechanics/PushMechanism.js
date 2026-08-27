/**
 * GitHero Push Mechanism
 * Handles physical forward pushes of repository boxes with wall, gate, and obstacle collision.
 */

import { DIRECTION_VECTORS } from '../../types/gameTypes.js';

export class PushMechanism {
  static execute(gameState, worldEngine) {
    const dir = gameState.player.dir || 'up';
    const vec = DIRECTION_VECTORS[dir];
    if (!vec) return { success: false, reason: 'Invalid player direction' };

    const targetX = gameState.player.x + vec.dx;
    const targetY = gameState.player.y + vec.dy;

    // Check if box is in front of the player
    const hasBox = gameState.box && gameState.box.x === targetX && gameState.box.y === targetY;
    if (!hasBox) {
      return { success: false, reason: 'No repository box in front of player to push' };
    }

    // Determine destination tile for the box
    const boxDestX = targetX + vec.dx;
    const boxDestY = targetY + vec.dy;

    // Boundary check
    if (boxDestX < 0 || boxDestX >= gameState.gridSize || boxDestY < 0 || boxDestY >= gameState.gridSize) {
      return { success: false, reason: 'Cannot push box out of repository partition boundaries' };
    }

    // Wall & Obstacle & Closed Gate check
    if (worldEngine.isBlocked(boxDestX, boxDestY)) {
      return { success: false, reason: 'Destination is blocked by partition wall or locked firewall gate' };
    }

    // Save snapshot for undo
    gameState.saveHistory();

    // Execute push
    gameState.box.x = boxDestX;
    gameState.box.y = boxDestY;
    gameState.moves++;
    gameState.pushCount++;

    // Check switch triggers
    worldEngine.evaluateSwitches(gameState);

    const onGoal = gameState.checkGoal();
    return {
      success: true,
      pushed: true,
      onGoal,
      boxPos: { x: boxDestX, y: boxDestY }
    };
  }
}

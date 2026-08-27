/**
 * GitHero Directional Pull Mechanism
 * Handles pulling repository payload boxes toward player from cardinal directions.
 */

import { DIRECTIONS, DIRECTION_VECTORS } from '../../types/gameTypes.js';

export class PullMechanism {
  /**
   * Directional pull: git pull [left|right|up|down]
   * Pulls the object in the specified direction toward the player (if adjacent and valid).
   */
  static executeDirectional(gameState, worldEngine, direction) {
    const dir = direction.toLowerCase();
    const vec = DIRECTION_VECTORS[dir];
    if (!vec) {
      return { success: false, reason: `Unknown direction "${direction}". Use up, down, left, or right.` };
    }

    // Source of the object to pull
    const objectX = gameState.player.x + vec.dx;
    const objectY = gameState.player.y + vec.dy;

    const hasBox = gameState.box && gameState.box.x === objectX && gameState.box.y === objectY;
    if (!hasBox) {
      return { success: false, reason: `No repository box found to the ${dir} to pull.` };
    }

    // Player needs to move backward away from the box, pulling box into player's old position
    const playerDestX = gameState.player.x - vec.dx;
    const playerDestY = gameState.player.y - vec.dy;

    // Check player destination boundaries
    if (playerDestX < 0 || playerDestX >= gameState.gridSize || playerDestY < 0 || playerDestY >= gameState.gridSize) {
      return { success: false, reason: `Cannot pull: No room behind player to step back.` };
    }

    // Check if player destination is blocked
    if (worldEngine.isBlocked(playerDestX, playerDestY)) {
      return { success: false, reason: `Cannot pull: Space behind player is blocked.` };
    }

    // Save snapshot for undo
    gameState.saveHistory();

    // Box moves to current player position, player moves to destination
    gameState.box.x = gameState.player.x;
    gameState.box.y = gameState.player.y;
    gameState.player.x = playerDestX;
    gameState.player.y = playerDestY;

    // Face the box
    gameState.player.dir = dir;
    gameState.moves++;
    gameState.pullCount++;

    // Evaluate switches
    worldEngine.evaluateSwitches(gameState);

    const onGoal = gameState.checkGoal();
    return {
      success: true,
      pulled: true,
      onGoal,
      boxPos: { x: gameState.box.x, y: gameState.box.y },
      playerPos: { x: playerDestX, y: playerDestY }
    };
  }

  /**
   * Default git pull: Pulls box in front of player toward player.
   */
  static executeDefault(gameState, worldEngine) {
    const currentDir = gameState.player.dir || DIRECTIONS.UP;
    return this.executeDirectional(gameState, worldEngine, currentDir);
  }
}

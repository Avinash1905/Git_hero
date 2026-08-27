/**
 * GitHero Grid Physics & Movement Engine
 * Handles player navigation, push physics, directional pulls, collision, and switch triggers.
 */

import { DIRECTIONS, DIRECTION_VECTORS } from '../types/gameTypes.js';
import { PushMechanism } from './mechanics/PushMechanism.js';
import { PullMechanism } from './mechanics/PullMechanism.js';

export class GridEngine {
  constructor(gameState) {
    this.state = gameState;
  }

  movePlayer(direction) {
    const dir = direction.toLowerCase();
    const vec = DIRECTION_VECTORS[dir];
    if (!vec) return { success: false, reason: `Unknown direction "${direction}"` };

    this.state.player.dir = dir;

    const newX = this.state.player.x + vec.dx;
    const newY = this.state.player.y + vec.dy;

    // Check bounds
    if (newX < 0 || newX >= this.state.gridSize || newY < 0 || newY >= this.state.gridSize) {
      return { success: false, reason: 'Hit grid partition boundary' };
    }

    // Check walls / gates
    if (this.state.worldEngine.isBlocked(newX, newY)) {
      return { success: false, reason: 'Path blocked by partition wall or locked gate' };
    }

    // Check box collision (cannot walk through box without pushing)
    if (this.state.box && this.state.box.x === newX && this.state.box.y === newY) {
      return { success: false, reason: 'Blocked by repository box. Use "git push" to move it.' };
    }

    // Save snapshot
    this.state.saveHistory();

    // Move player
    this.state.player.x = newX;
    this.state.player.y = newY;
    this.state.moves++;

    // Evaluate switches
    this.state.worldEngine.evaluateSwitches(this.state);

    return {
      success: true,
      playerPos: { x: newX, y: newY, dir }
    };
  }

  gitPush() {
    return PushMechanism.execute(this.state, this.state.worldEngine);
  }

  gitPullDirectional(direction) {
    return PullMechanism.executeDirectional(this.state, this.state.worldEngine, direction);
  }

  gitPullDefault() {
    return PullMechanism.executeDefault(this.state, this.state.worldEngine);
  }
}

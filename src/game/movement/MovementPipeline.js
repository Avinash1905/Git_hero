/**
 * GitQuest Game Engine: Unified Movement Pipeline & Directional Solvers
 */

import { Direction, DirectionVectors } from '../../types/GameTypes.js';

export class PushMechanicSolver {
  static solvePush(playerPosition, boxPosition, direction, walls = [], hazards = [], width = 10, height = 10) {
    const dirVec = DirectionVectors[direction] || { x: 0, y: 0 };
    const targetPlayerPos = { x: playerPosition.x + dirVec.x, y: playerPosition.y + dirVec.y };

    // Check if player steps on box
    const isBoxHit = targetPlayerPos.x === boxPosition.x && targetPlayerPos.y === boxPosition.y;
    if (!isBoxHit) {
      // Normal walk
      if (this._isOutOfBounds(targetPlayerPos, width, height)) {
        return { success: false, reason: 'OUT_OF_BOUNDS' };
      }
      if (this._isWall(targetPlayerPos, walls)) {
        return { success: false, reason: 'WALL_COLLISION' };
      }
      return {
        success: true,
        pushed: false,
        newPlayerPos: targetPlayerPos,
        newBoxPos: boxPosition
      };
    }

    // Pushing box
    const targetBoxPos = { x: boxPosition.x + dirVec.x, y: boxPosition.y + dirVec.y };

    if (this._isOutOfBounds(targetBoxPos, width, height)) {
      return { success: false, reason: 'BOX_OUT_OF_BOUNDS' };
    }
    if (this._isWall(targetBoxPos, walls)) {
      return { success: false, reason: 'BOX_BLOCKED_BY_WALL' };
    }
    if (this._isHazard(targetBoxPos, hazards)) {
      return { success: false, reason: 'BOX_BLOCKED_BY_HAZARD' };
    }

    return {
      success: true,
      pushed: true,
      newPlayerPos: targetPlayerPos,
      newBoxPos: targetBoxPos
    };
  }

  static _isOutOfBounds(pos, w, h) {
    return pos.x < 0 || pos.x >= w || pos.y < 0 || pos.y >= h;
  }

  static _isWall(pos, walls) {
    return walls.some(w => w.x === pos.x && w.y === pos.y);
  }

  static _isHazard(pos, hazards) {
    return hazards.some(h => h.x === pos.x && h.y === pos.y);
  }
}

export class PullMechanicSolver {
  static solvePull(playerPosition, boxPosition, pullDirection, walls = [], width = 10, height = 10) {
    const dirVec = DirectionVectors[pullDirection] || { x: 0, y: 0 };
    const targetPlayerPos = { x: playerPosition.x + dirVec.x, y: playerPosition.y + dirVec.y };

    // Player cannot step out of bounds or into wall
    if (targetPlayerPos.x < 0 || targetPlayerPos.x >= width || targetPlayerPos.y < 0 || targetPlayerPos.y >= height) {
      return { success: false, reason: 'OUT_OF_BOUNDS' };
    }
    if (walls.some(w => w.x === targetPlayerPos.x && w.y === targetPlayerPos.y)) {
      return { success: false, reason: 'WALL_COLLISION' };
    }

    // Box moves into the player's old position
    const targetBoxPos = { x: playerPosition.x, y: playerPosition.y };

    return {
      success: true,
      pulled: true,
      newPlayerPos: targetPlayerPos,
      newBoxPos: targetBoxPos
    };
  }
}

export class MovementPipeline {
  constructor(engine) {
    this.engine = engine;
  }

  processMove(direction) {
    if (!this.engine || !this.engine.gameState) {
      return { success: false, reason: 'NO_ENGINE' };
    }

    const state = this.engine.gameState;
    const res = PushMechanicSolver.solvePush(
      state.player,
      state.box,
      direction,
      state.walls,
      state.hazards,
      state.width,
      state.height
    );

    if (res.success) {
      this.engine.recordStateSnapshot();
      state.player = res.newPlayerPos;
      state.box = res.newBoxPos;
      state.moves = (state.moves || 0) + 1;
      if (res.pushed) {
        state.pushCount = (state.pushCount || 0) + 1;
      }
      this.engine.checkObjectives();
    }

    return res;
  }

  processPull(direction) {
    if (!this.engine || !this.engine.gameState) {
      return { success: false, reason: 'NO_ENGINE' };
    }

    const state = this.engine.gameState;
    const res = PullMechanicSolver.solvePull(
      state.player,
      state.box,
      direction,
      state.walls,
      state.width,
      state.height
    );

    if (res.success) {
      this.engine.recordStateSnapshot();
      state.player = res.newPlayerPos;
      state.box = res.newBoxPos;
      state.moves = (state.moves || 0) + 1;
      state.pullCount = (state.pullCount || 0) + 1;
      this.engine.checkObjectives();
    }

    return res;
  }
}

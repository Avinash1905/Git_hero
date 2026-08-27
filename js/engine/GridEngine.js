// GridEngine: Sokoban Git Physics and Interactive Tile Rules

import { soundFX } from '../audio.js';

export class GridEngine {
  constructor(gameState, onStateChange) {
    this.state = gameState;
    this.onStateChange = onStateChange;
  }

  isWall(x, y) {
    // Boundary check
    if (x < 0 || x >= this.state.gridSize || y < 0 || y >= this.state.gridSize) {
      return true;
    }
    return this.state.walls.some(w => w.x === x && w.y === y);
  }

  isHazard(x, y) {
    return this.state.hazards.some(h => h.x === x && h.y === y);
  }

  movePlayer(dx, dy) {
    const newX = this.state.player.x + dx;
    const newY = this.state.player.y + dy;

    // Update direction facing
    let dir = this.state.player.dir;
    if (dx === 1) dir = 'right';
    else if (dx === -1) dir = 'left';
    else if (dy === 1) dir = 'down';
    else if (dy === -1) dir = 'up';
    this.state.player.dir = dir;

    // Check if moving into wall
    if (this.isWall(newX, newY)) {
      soundFX.playError();
      return { success: false, reason: 'wall' };
    }

    // Check if moving into box
    if (newX === this.state.box.x && newY === this.state.box.y) {
      // Try to push box
      const boxNewX = this.state.box.x + dx;
      const boxNewY = this.state.box.y + dy;

      if (this.isWall(boxNewX, boxNewY)) {
        soundFX.playError();
        return { success: false, reason: 'blocked_box' };
      }

      this.state.saveHistory();
      this.state.box.x = boxNewX;
      this.state.box.y = boxNewY;
      this.state.player.x = newX;
      this.state.player.y = newY;
      this.state.moves++;
      this.state.pushCount++;

      const onGoal = this.state.checkGoal();
      this.state.isGoalReached = onGoal;

      if (onGoal) {
        soundFX.playGoal();
      } else {
        soundFX.playPush();
      }

      if (this.onStateChange) this.onStateChange(this.state);
      return { success: true, pushed: true, onGoal };
    }

    // Normal move
    this.state.saveHistory();
    this.state.player.x = newX;
    this.state.player.y = newY;
    this.state.moves++;
    soundFX.playMove();

    if (this.onStateChange) this.onStateChange(this.state);
    return { success: true, pushed: false };
  }

  moveDirection(dir) {
    const d = dir.toLowerCase();
    if (d === 'left') {
      return this.movePlayer(-1, 0);
    } else if (d === 'right') {
      return this.movePlayer(1, 0);
    } else if (d === 'up') {
      return this.movePlayer(0, -1);
    } else if (d === 'down') {
      return this.movePlayer(0, 1);
    }
    return { success: false, reason: 'invalid_direction' };
  }

  gitPush() {
    // Determine target based on player facing direction
    let dx = 0;
    let dy = 0;
    if (this.state.player.dir === 'right') dx = 1;
    else if (this.state.player.dir === 'left') dx = -1;
    else if (this.state.player.dir === 'down') dy = 1;
    else if (this.state.player.dir === 'up') dy = -1;

    // If box is immediately in front of player
    if (this.state.player.x + dx === this.state.box.x && this.state.player.y + dy === this.state.box.y) {
      return this.movePlayer(dx, dy);
    }

    // Else if player is adjacent in ANY direction, push in that direction
    const adjDirs = [
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
    ];
    for (const d of adjDirs) {
      if (this.state.player.x + d.dx === this.state.box.x && this.state.player.y + d.dy === this.state.box.y) {
        return this.movePlayer(d.dx, d.dy);
      }
    }

    // If not adjacent, step forward in facing direction
    return this.movePlayer(dx, dy);
  }

  pullDirection(dir) {
    const d = (dir || '').toLowerCase();
    let dx = 0;
    let dy = 0;

    if (d === 'left') {
      dx = -1;
      dy = 0;
    } else if (d === 'right') {
      dx = 1;
      dy = 0;
    } else if (d === 'up') {
      dx = 0;
      dy = -1;
    } else if (d === 'down') {
      dx = 0;
      dy = 1;
    } else {
      // Default: use facing direction
      if (this.state.player.dir === 'right') dx = 1;
      else if (this.state.player.dir === 'left') dx = -1;
      else if (this.state.player.dir === 'down') dy = 1;
      else if (this.state.player.dir === 'up') dy = -1;
    }

    const targetBoxX = this.state.player.x + dx;
    const targetBoxY = this.state.player.y + dy;
    const backX = this.state.player.x - dx;
    const backY = this.state.player.y - dy;

    // Check if box exists in target direction
    if (this.state.box.x !== targetBoxX || this.state.box.y !== targetBoxY) {
      soundFX.playError();
      return { success: false, reason: 'no_box_in_direction', direction: d };
    }

    // Check if step-backward path is obstructed
    if (this.isWall(backX, backY) || this.isHazard(backX, backY)) {
      soundFX.playError();
      return { success: false, reason: 'obstructed_pull_path', direction: d };
    }

    // Execute pull
    this.state.saveHistory();
    this.state.box.x = this.state.player.x;
    this.state.box.y = this.state.player.y;
    this.state.player.x = backX;
    this.state.player.y = backY;
    this.state.player.dir = d || this.state.player.dir;
    this.state.moves++;
    this.state.pullCount++;

    const onGoal = this.state.checkGoal();
    this.state.isGoalReached = onGoal;

    if (onGoal) soundFX.playGoal();
    else soundFX.playPush();

    if (this.onStateChange) this.onStateChange(this.state);
    return { success: true, pulled: true, direction: d, onGoal };
  }

  gitPull() {
    return this.pullDirection('');
  }

  gitPullLeft() {
    return this.pullDirection('left');
  }

  gitPullRight() {
    return this.pullDirection('right');
  }

  gitPullUp() {
    return this.pullDirection('up');
  }

  gitPullDown() {
    return this.pullDirection('down');
  }

  reset() {
    this.state.initLevel(this.state.levelId);
    soundFX.playMove();
    if (this.onStateChange) this.onStateChange(this.state);
  }

  undo() {
    const res = this.state.undo();
    if (res) {
      soundFX.playMove();
      if (this.onStateChange) this.onStateChange(this.state);
    } else {
      soundFX.playError();
    }
    return res;
  }
}

// GameState: In-memory live state for puzzle arena and HUD

import { LEVELS } from './Levels.js';
import { StorageService } from '../services/StorageService.js';

export class GameState {
  constructor(levelId = '07') {
    this.initLevel(levelId);
  }

  initLevel(levelId) {
    const levelDef = LEVELS[levelId] || LEVELS['07'];
    this.levelId = levelDef.id;
    this.levelDef = levelDef;
    this.gridSize = levelDef.gridSize || 6;
    
    // Coordinates
    this.player = { ...levelDef.player, dir: 'up' };
    this.box = { ...levelDef.box };
    this.goal = { ...levelDef.goal };
    this.walls = [...levelDef.walls];
    this.hazards = [...(levelDef.hazards || [])];

    // Stats & Counters
    this.moves = 0;
    this.pushCount = 0;
    this.pullCount = 0;
    this.statusCount = 0;
    this.commandsCount = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    
    // Status
    this.isCommitted = false;
    this.isGoalReached = this.checkGoal();
    this.history = []; // for undo
    
    // Lives
    const userState = StorageService.load();
    this.lives = userState.player.lives || 3;
    this.xp = userState.player.xp || 2450;
  }

  startTimer(onTick) {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.startTime = Date.now() - (this.elapsedSeconds * 1000);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      if (onTick) onTick(this.getFormattedTime());
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  getFormattedTime() {
    const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  saveHistory() {
    this.history.push({
      player: { ...this.player },
      box: { ...this.box },
      moves: this.moves,
      pushCount: this.pushCount,
      pullCount: this.pullCount
    });
  }

  undo() {
    if (this.history.length === 0) return false;
    const prev = this.history.pop();
    this.player = { ...prev.player };
    this.box = { ...prev.box };
    this.moves = prev.moves;
    this.pushCount = prev.pushCount;
    this.pullCount = prev.pullCount;
    this.isGoalReached = this.checkGoal();
    return true;
  }

  checkGoal() {
    return this.box.x === this.goal.x && this.box.y === this.goal.y;
  }

  calculateScore() {
    const base = 10000;
    const timePenalty = this.elapsedSeconds * 15;
    const movePenalty = this.moves * 35;
    return Math.max(1200, base - timePenalty - movePenalty);
  }
}

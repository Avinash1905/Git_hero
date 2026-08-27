/**
 * GitHero GameState: In-memory state and snapshot history for the puzzle arena
 */

import { LEVELS } from './Levels.js';
import { StorageService } from '../services/StorageService.js';
import { WorldEngine } from './WorldEngine.js';

export class GameState {
  constructor(levelId = '01', customLevel = null) {
    this.initLevel(levelId, customLevel);
  }

  initLevel(levelId, customLevel = null) {
    const formattedId = String(levelId).padStart(2, '0');
    const levelDef = customLevel || LEVELS[formattedId] || LEVELS[levelId] || LEVELS['01'];
    
    this.levelId = levelDef.id;
    this.levelDef = levelDef;
    this.gridSize = levelDef.gridSize || 6;
    
    // Spatial coordinates & direction
    this.player = { ...levelDef.player, dir: 'up' };
    this.box = { ...levelDef.box };
    this.goal = { ...levelDef.goal };
    this.walls = levelDef.walls ? [...levelDef.walls] : [];
    this.hazards = levelDef.hazards ? [...levelDef.hazards] : [];
    this.gates = levelDef.gates ? [...levelDef.gates] : [];
    this.switches = levelDef.switches ? [...levelDef.switches] : [];
    this.checkpoints = levelDef.checkpoints ? [...levelDef.checkpoints] : [];

    // Instantiate world collision engine
    this.worldEngine = new WorldEngine(levelDef);

    // Performance Counters
    this.moves = 0;
    this.pushCount = 0;
    this.pullCount = 0;
    this.statusCount = 0;
    this.commandsCount = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    
    // State Flags
    this.isCommitted = false;
    this.isGoalReached = this.checkGoal();
    this.history = []; // Snapshot history for undo

    // Player metadata
    const userState = StorageService.load();
    this.lives = userState.player.lives || 3;
    this.xp = userState.player.xp || 14500;
  }

  saveHistory() {
    this.history.push({
      player: { ...this.player },
      box: { ...this.box },
      moves: this.moves,
      pushCount: this.pushCount,
      pullCount: this.pullCount,
      isCommitted: this.isCommitted
    });
    if (this.history.length > 50) this.history.shift();
  }

  undo() {
    if (!this.history.length) return false;
    const snapshot = this.history.pop();
    this.player = { ...snapshot.player };
    this.box = { ...snapshot.box };
    this.moves = snapshot.moves;
    this.pushCount = snapshot.pushCount;
    this.pullCount = snapshot.pullCount;
    this.isCommitted = snapshot.isCommitted;
    this.isGoalReached = this.checkGoal();
    return true;
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
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  checkGoal() {
    if (!this.box || !this.goal) return false;
    return this.box.x === this.goal.x && this.box.y === this.goal.y;
  }
}

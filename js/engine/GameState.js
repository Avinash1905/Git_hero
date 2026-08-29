/**
 * GameState: Live in-memory state for puzzle arena and HUD
 * Backed by the GitQuest Core State Engine & Global Level Registry
 */

import { LEVELS } from './Levels.js';
import { StorageService } from '../services/StorageService.js';
import { GitRepoState, PlayerState, WorldState } from './state/PlayerState.js';
import { HistoryManager, StatsTracker } from './state/HistoryManager.js';
import { ScoringCalculator } from './progression/ProgressionManager.js';

export class GameState {
  constructor(levelId = '07') {
    this.historyManager = new HistoryManager(200);
    this.stats = new StatsTracker();
    this.gitRepo = new GitRepoState();
    this.worldState = new WorldState();
    this.initLevel(levelId);
  }

  initLevel(levelId) {
    const normId = String(levelId || '07').padStart(2, '0');
    const levelDef = LEVELS[normId] || LEVELS['07'];
    this.levelId = levelDef.id;
    this.levelDef = levelDef;
    this.gridSize = levelDef.gridSize || 6;
    this.width = levelDef.width || this.gridSize;
    this.height = levelDef.height || this.gridSize;

    // Coordinates
    this.player = {
      x: levelDef.player?.x ?? 1,
      y: levelDef.player?.y ?? 1,
      dir: 'up'
    };
    this.box = {
      x: levelDef.box?.x ?? 2,
      y: levelDef.box?.y ?? 2
    };
    this.goal = {
      x: levelDef.goal?.x ?? 4,
      y: levelDef.goal?.y ?? 2
    };
    this.walls = [...(levelDef.walls || [])];
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
    this.history = []; // legacy history support
    this.historyManager.clear();
    this.stats.reset();

    // Git Repo state
    this.gitRepo = new GitRepoState({
      currentBranch: `level-${this.levelId}`
    });

    // Lives & XP from persistent storage
    try {
      const userState = StorageService.load();
      this.lives = userState?.player?.lives ?? 3;
      this.xp = userState?.player?.xp ?? 2450;
    } catch {
      this.lives = 3;
      this.xp = 2450;
    }
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
    const snapshot = {
      player: { ...this.player },
      box: { ...this.box },
      moves: this.moves,
      pushCount: this.pushCount,
      pullCount: this.pullCount
    };
    this.history.push(snapshot);
    this.historyManager.pushState(snapshot);
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
    return ScoringCalculator.calculateScore(
      this.moves,
      this.elapsedSeconds,
      this.levelDef?.commitsReq || 2
    );
  }
}

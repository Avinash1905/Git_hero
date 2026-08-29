/**
 * GitQuest Engine - HistoryManager, StatsTracker & Serialization
 * Manages deep reversible undo/redo trees, performance analytics, and JSON serialization.
 */

import { EngineUtils } from '../core/Utils.js';

export class StatsTracker {
  constructor() {
    this.moves = 0;
    this.pushCount = 0;
    this.pullCount = 0;
    this.statusCount = 0;
    this.commandsCount = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.timerInterval = null;
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
    return EngineUtils.formatTime(this.elapsedSeconds);
  }

  calculateScore(baseScore = 10000, parMoves = 20, parTime = 60) {
    const timePenalty = this.elapsedSeconds * 15;
    const movePenalty = this.moves * 35;
    const efficiencyBonus = (this.moves <= parMoves ? 1500 : 0) + (this.elapsedSeconds <= parTime ? 1000 : 0);
    return Math.max(1200, baseScore - timePenalty - movePenalty + efficiencyBonus);
  }

  reset() {
    this.stopTimer();
    this.moves = 0;
    this.pushCount = 0;
    this.pullCount = 0;
    this.statusCount = 0;
    this.commandsCount = 0;
    this.elapsedSeconds = 0;
  }
}

export class HistoryManager {
  constructor(maxHistory = 200) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = maxHistory;
  }

  pushState(snapshot) {
    this.undoStack.push(EngineUtils.deepClone(snapshot));
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo on new action
    this.redoStack = [];
  }

  undo(currentState) {
    if (this.undoStack.length === 0) return null;
    const prev = this.undoStack.pop();
    this.redoStack.push(EngineUtils.deepClone(currentState));
    return prev;
  }

  redo(currentState) {
    if (this.redoStack.length === 0) return null;
    const next = this.redoStack.pop();
    this.undoStack.push(EngineUtils.deepClone(currentState));
    return next;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }
}

export class Serialization {
  static serializeGameState(gameState) {
    return {
      version: '2.4.0',
      timestamp: Date.now(),
      levelId: gameState.levelId,
      player: gameState.player.toJSON ? gameState.player.toJSON() : gameState.player,
      box: { x: gameState.box.x, y: gameState.box.y },
      goal: { x: gameState.goal.x, y: gameState.goal.y },
      moves: gameState.moves,
      pushCount: gameState.pushCount,
      pullCount: gameState.pullCount,
      statusCount: gameState.statusCount,
      commandsCount: gameState.commandsCount,
      elapsedSeconds: gameState.elapsedSeconds,
      isGoalReached: gameState.isGoalReached,
      isCommitted: gameState.isCommitted,
      gitRepo: gameState.gitRepo?.toJSON ? gameState.gitRepo.toJSON() : null,
      worldState: gameState.worldState?.toJSON ? gameState.worldState.toJSON() : null
    };
  }

  static deserializeGameState(json, targetState) {
    if (!json || !targetState) return false;

    targetState.levelId = json.levelId || targetState.levelId;
    if (json.player) {
      targetState.player.x = json.player.x ?? targetState.player.x;
      targetState.player.y = json.player.y ?? targetState.player.y;
      targetState.player.dir = json.player.dir ?? targetState.player.dir;
      if (json.player.lives !== undefined) targetState.lives = json.player.lives;
      if (json.player.xp !== undefined) targetState.xp = json.player.xp;
    }

    if (json.box) {
      targetState.box.x = json.box.x;
      targetState.box.y = json.box.y;
    }

    if (json.goal) {
      targetState.goal.x = json.goal.x;
      targetState.goal.y = json.goal.y;
    }

    targetState.moves = json.moves ?? 0;
    targetState.pushCount = json.pushCount ?? 0;
    targetState.pullCount = json.pullCount ?? 0;
    targetState.statusCount = json.statusCount ?? 0;
    targetState.commandsCount = json.commandsCount ?? 0;
    targetState.elapsedSeconds = json.elapsedSeconds ?? 0;
    targetState.isGoalReached = json.isGoalReached ?? targetState.checkGoal();
    targetState.isCommitted = Boolean(json.isCommitted);

    return true;
  }
}

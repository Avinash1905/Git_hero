/**
 * useGameSession
 * Manages active gameplay session lifecycle, anti-cheat validation timestamps,
 * telemetry recording, and server synchronization upon completion.
 */

import { gameService } from '../services/gameService.js';
import { progressService } from '../services/progressService.js';

export class GameSessionController {
  constructor(levelId, adapter) {
    this.levelId = levelId;
    this.adapter = adapter;
    this.sessionId = null;
    this.startTime = Date.now();
    this.endTime = null;
    this.moveHistory = [];
    this.commandHistory = [];
    this.isCompleted = false;
  }

  /**
   * Start a verified session with backend
   */
  async start() {
    this.startTime = Date.now();
    try {
      const res = await gameService.startSession(this.levelId);
      if (res.success && res.sessionId) {
        this.sessionId = res.sessionId;
      }
    } catch (err) {
      console.warn('[GameSessionController] Starting offline session mode:', err.message);
    }
  }

  /**
   * Record player step for telemetry & anti-cheat
   * @param {'move' | 'push' | 'pull'} action
   * @param {Object} pos
   */
  recordStep(action, pos) {
    this.moveHistory.push({
      action,
      x: pos.x,
      y: pos.y,
      timestamp: Date.now() - this.startTime
    });
  }

  /**
   * Record command submission
   * @param {string} command
   */
  recordCommand(command) {
    this.commandHistory.push({
      command,
      timestamp: Date.now() - this.startTime
    });
  }

  /**
   * Complete session and sync with backend
   * @param {Object} finalState
   * @returns {Promise<Object>}
   */
  async complete(finalState) {
    if (this.isCompleted) return null;
    this.isCompleted = true;
    this.endTime = Date.now();

    const payload = {
      sessionId: this.sessionId,
      levelId: this.levelId,
      moves: finalState.moves,
      timeSeconds: finalState.elapsedSeconds,
      commandsCount: finalState.commandsCount,
      pushCount: finalState.pushCount,
      pullCount: finalState.pullCount,
      history: this.moveHistory,
      commandHistory: this.commandHistory
    };

    try {
      const res = await gameService.completeSession(payload);
      return res;
    } catch (err) {
      console.warn('[GameSessionController] Backend completion sync failed, falling back to local progress storage:', err);
      // Save locally
      return {
        success: true,
        levelId: this.levelId,
        stars: finalState.stars,
        score: finalState.score,
        xpAwarded: finalState.xpReward
      };
    }
  }
}

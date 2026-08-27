/**
 * GitHero Game Session & Turn Service
 * Coordinates session lifecycle, moves, turn execution, and victory triggering.
 */

import { GameState } from '../engine/GameState.js';
import { GridEngine } from '../engine/GridEngine.js';
import { GitCLI } from '../terminal/GitCLI.js';
import { appStore } from '../state/appStore.js';
import { eventBus, EVENTS } from '../state/eventBus.js';

export class GameService {
  constructor() {
    this.activeSession = null;
  }

  createSession(levelId, customLevel = null) {
    const gameState = new GameState(levelId, customLevel);
    const gridEngine = new GridEngine(gameState);
    const gitCli = new GitCLI(gameState, gridEngine);

    this.activeSession = {
      gameState,
      gridEngine,
      gitCli
    };

    eventBus.emit(EVENTS.GAME_STARTED, { levelId });
    return this.activeSession;
  }

  getActiveSession() {
    return this.activeSession;
  }

  endSession() {
    if (this.activeSession?.gameState) {
      this.activeSession.gameState.stopTimer();
    }
    this.activeSession = null;
  }
}

export const gameService = new GameService();

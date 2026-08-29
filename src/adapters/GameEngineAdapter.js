/**
 * GameEngineAdapter
 * Master integration bridge between the frontend UI and the untouched ~20K LOC GitQuest engine.
 * Decouples DOM views, terminals, and reactive stores from low-level engine mechanics.
 */

import { GitQuestEngine } from '../../js/engine/api/EngineFacade.js';
import { GameState } from '../../js/engine/GameState.js';
import { GridEngine } from '../../js/engine/GridEngine.js';
import { EngineStateMapper } from './EngineStateMapper.js';
import { CommandTranslationAdapter } from './CommandTranslationAdapter.js';
import { EngineEventBridge } from './EngineEventBridge.js';
import { LevelDataAdapter } from './LevelDataAdapter.js';

export class GameEngineAdapter {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    this.options = options;
    this.engine = null;
    this.legacyGameState = null;
    this.legacyGridEngine = null;
    this.eventBridge = null;
    this.currentLevelId = '01';
    this.listeners = new Set();
    this.isInitialized = false;
    this.activeSessionId = null;
    this.timerTickCallback = null;
  }

  /**
   * Initialize or reset the engine instance for a given level
   * @param {string|number} levelId
   * @param {Object} [customLevel]
   * @returns {Promise<Object>} The mapped frontend state
   */
  async initializeLevel(levelId = '01', customLevel = null) {
    const normId = LevelDataAdapter.normalizeLevelId(levelId);
    this.currentLevelId = normId;

    try {
      // 1. Instantiate the comprehensive GitQuestEngine facade
      this.engine = new GitQuestEngine({
        maxHistory: 200,
        ...this.options
      });

      // 2. Load level inside engine
      this.engine.loadLevel(normId, customLevel);

      // 3. Fallback/compatibility setup with legacy GameState & GridEngine
      this.legacyGameState = new GameState(normId);
      if (customLevel) {
        this.legacyGameState.levelDef = customLevel;
      }
      this.legacyGridEngine = new GridEngine(this.legacyGameState, () => {
        this.notifyStateChanged();
      });

      // 4. Attach Event Bridge
      this.eventBridge = new EngineEventBridge(this.engine);
      this.eventBridge.subscribe('state:change', () => {
        this.notifyStateChanged();
      });

      // 5. Engine state listener
      this.engine.onStateChange(() => {
        this.notifyStateChanged();
      });

      // 6. Start live timer
      this.engine.startTimer((formattedTime) => {
        if (typeof this.timerTickCallback === 'function') {
          this.timerTickCallback(formattedTime);
        }
      });

      this.isInitialized = true;
      const state = this.getFrontendState();
      this.notifyStateChanged();
      return state;
    } catch (err) {
      console.error('[GameEngineAdapter] Failed to initialize engine for level:', levelId, err);
      // Graceful fallback to legacy GameState
      this.legacyGameState = new GameState(normId);
      this.legacyGridEngine = new GridEngine(this.legacyGameState, () => {
        this.notifyStateChanged();
      });
      this.isInitialized = true;
      return this.getFrontendState();
    }
  }

  /**
   * Register a timer tick callback for HUD updates
   * @param {Function} cb
   */
  onTimerTick(cb) {
    this.timerTickCallback = cb;
  }

  /**
   * Subscribe to reactive game state updates
   * @param {Function} listener
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    // Immediately emit current state
    listener(this.getFrontendState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all subscribers with immutable frontend DTO
   */
  notifyStateChanged() {
    const state = this.getFrontendState();
    for (const fn of this.listeners) {
      try {
        fn(state);
      } catch (err) {
        console.error('[GameEngineAdapter] Error in state change listener:', err);
      }
    }
  }

  /**
   * Get the mapped, immutable frontend state
   * @returns {import('./EngineStateMapper.js').FrontendGameplayState}
   */
  getFrontendState() {
    if (this.engine) {
      return EngineStateMapper.mapEngineToFrontendState(this.engine);
    }
    if (this.legacyGameState) {
      return EngineStateMapper.mapEngineToFrontendState(this.legacyGameState);
    }
    return EngineStateMapper.getEmptyState();
  }

  /**
   * Handle directional player movement from keyboard, D-pad, or API
   * @param {'up' | 'down' | 'left' | 'right'} direction
   * @returns {{success: boolean, pushed?: boolean, onGoal?: boolean, reason?: string}}
   */
  movePlayer(direction) {
    const dir = String(direction || '').toLowerCase();
    if (!['up', 'down', 'left', 'right'].includes(dir)) {
      return { success: false, reason: 'Invalid direction' };
    }

    if (this.engine) {
      const result = this.engine.moveDirection(dir);
      this.notifyStateChanged();
      return result;
    }

    if (this.legacyGridEngine) {
      const result = this.legacyGridEngine.moveDirection(dir);
      this.notifyStateChanged();
      return { success: Boolean(result) };
    }

    return { success: false, reason: 'Engine not ready' };
  }

  /**
   * Handle git push interaction
   * @returns {Object}
   */
  gitPush() {
    if (this.engine && typeof this.engine.gitPush === 'function') {
      const res = this.engine.gitPush();
      this.notifyStateChanged();
      return res;
    }
    if (this.legacyGridEngine && typeof this.legacyGridEngine.gitPush === 'function') {
      const res = this.legacyGridEngine.gitPush();
      this.notifyStateChanged();
      return res;
    }
    return { success: false, reason: 'Push solver not available' };
  }

  /**
   * Handle git pull interaction (optionally with direction)
   * @param {string} [direction]
   * @returns {Object}
   */
  gitPull(direction = '') {
    if (this.engine) {
      const res = direction ? this.engine.pullDirection(direction) : this.engine.gitPull();
      this.notifyStateChanged();
      return res;
    }
    if (this.legacyGridEngine && typeof this.legacyGridEngine.gitPull === 'function') {
      const res = this.legacyGridEngine.gitPull(direction);
      this.notifyStateChanged();
      return res;
    }
    return { success: false, reason: 'Pull solver not available' };
  }

  /**
   * Execute raw terminal command against engine command pipeline
   * @param {string} rawCommand
   * @returns {{success: boolean, type: string, log: Object, rawResult: any}}
   */
  executeCommand(rawCommand) {
    const targetEngine = this.engine || this.legacyGameState;
    const execution = CommandTranslationAdapter.dispatchCommand(targetEngine, rawCommand);
    this.notifyStateChanged();
    return execution;
  }

  /**
   * Undo previous move
   * @returns {boolean}
   */
  undo() {
    let undone = false;
    if (this.engine && typeof this.engine.undo === 'function') {
      undone = this.engine.undo();
    } else if (this.legacyGridEngine && typeof this.legacyGridEngine.undo === 'function') {
      undone = Boolean(this.legacyGridEngine.undo());
    }
    if (undone) {
      this.notifyStateChanged();
    }
    return undone;
  }

  /**
   * Reset level to initial state
   */
  reset() {
    if (this.engine && typeof this.engine.loadLevel === 'function') {
      this.engine.loadLevel(this.currentLevelId, this.engine.levelDef);
    } else if (this.legacyGridEngine && typeof this.legacyGridEngine.reset === 'function') {
      this.legacyGridEngine.reset();
    }
    this.notifyStateChanged();
  }

  /**
   * Terminate active game session and stop timers
   */
  destroy() {
    if (this.engine && typeof this.engine.stopTimer === 'function') {
      this.engine.stopTimer();
    }
    if (this.legacyGameState && typeof this.legacyGameState.stopTimer === 'function') {
      this.legacyGameState.stopTimer();
    }
    if (this.eventBridge) {
      this.eventBridge.destroy();
    }
    this.listeners.clear();
    this.isInitialized = false;
  }
}

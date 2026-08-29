/**
 * GitQuest Engine - Core Engine Orchestrator
 * Master lifecycle, subsystem registry, game loop, and event coordination.
 */

import { GameEvent, Direction, EngineVersion } from './Constants.js';
import { EventBus } from './EventBus.js';
import { ActionResult } from './Types.js';

export class GitQuestCoreEngine {
  constructor(config = {}) {
    this.version = EngineVersion;
    this.config = config;
    this.eventBus = new EventBus(config.eventBusOptions);
    this.subsystems = new Map();
    this.initialized = false;
    this.running = false;
    this.paused = false;
    this.tickCount = 0;
    this.lastTickTime = 0;
    this.fps = config.fps || 60;
  }

  /**
   * Register a subsystem with the engine
   */
  registerSubsystem(name, subsystem) {
    if (!subsystem) throw new Error(`Subsystem "${name}" cannot be null.`);
    this.subsystems.set(name, subsystem);
    if (typeof subsystem.init === 'function' && this.initialized) {
      subsystem.init(this);
    }
    return this;
  }

  /**
   * Retrieve a registered subsystem
   */
  getSubsystem(name) {
    return this.subsystems.get(name) || null;
  }

  /**
   * Initialize engine and all registered subsystems
   */
  init() {
    if (this.initialized) return;

    for (const [name, sub] of this.subsystems.entries()) {
      if (typeof sub.init === 'function') {
        sub.init(this);
      }
    }

    this.initialized = true;
    this.eventBus.emit(GameEvent.ENGINE_INITIALIZED, { version: this.version });
    return this;
  }

  /**
   * Start the engine tick loop
   */
  start() {
    if (!this.initialized) this.init();
    this.running = true;
    this.paused = false;
    this.lastTickTime = Date.now();
    this.eventBus.emit(GameEvent.ENGINE_RESUMED);
  }

  /**
   * Pause the engine
   */
  pause() {
    this.paused = true;
    this.eventBus.emit(GameEvent.ENGINE_PAUSED);
  }

  /**
   * Resume the engine
   */
  resume() {
    this.paused = false;
    this.lastTickTime = Date.now();
    this.eventBus.emit(GameEvent.ENGINE_RESUMED);
  }

  /**
   * Stop the engine
   */
  stop() {
    this.running = false;
  }

  /**
   * Perform a single engine simulation tick
   */
  tick(deltaTime = 0) {
    if (!this.running || this.paused) return;

    const now = Date.now();
    const dt = deltaTime || (now - this.lastTickTime) / 1000;
    this.lastTickTime = now;
    this.tickCount++;

    // Tick each subsystem in registration order
    for (const [name, sub] of this.subsystems.entries()) {
      if (typeof sub.tick === 'function') {
        sub.tick(dt, this.tickCount);
      }
    }

    this.eventBus.emit(GameEvent.ENGINE_TICK, {
      tick: this.tickCount,
      dt,
      timestamp: now
    });
  }

  /**
   * Reset engine state
   */
  reset() {
    for (const [name, sub] of this.subsystems.entries()) {
      if (typeof sub.reset === 'function') {
        sub.reset();
      }
    }
    this.tickCount = 0;
    this.eventBus.emit(GameEvent.ENGINE_RESET);
  }
}

/**
 * GitQuest Frontend - Game Engine Event Bridge
 * Strongly typed bi-directional event bus linking Game Engine core events
 * to DOM UI listeners, sound effects, particle emitters, and telemetry systems.
 */

import { GameEvent } from '../../js/engine/core/Constants.js';

export class GameEngineEventBridge {
  constructor(engineEventBus = null) {
    this.eventBus = engineEventBus;
    this.subscriptions = new Map();
    this.unsubscribers = [];
  }

  attachEngine(engine) {
    if (engine && engine.eventBus) {
      this.eventBus = engine.eventBus;
      this._wireCoreEvents();
    }
  }

  _wireCoreEvents() {
    if (!this.eventBus) return;

    this._listen(GameEvent.PLAYER_MOVED, data => this.emit('ui:player_moved', data));
    this._listen(GameEvent.BOX_PUSHED, data => this.emit('ui:box_pushed', data));
    this._listen(GameEvent.BOX_PULLED, data => this.emit('ui:box_pulled', data));
    this._listen(GameEvent.GOAL_REACHED, data => this.emit('ui:goal_reached', data));
    this._listen(GameEvent.GIT_COMMIT_EXECUTED, data => this.emit('ui:commit_executed', data));
    this._listen(GameEvent.LEVEL_COMPLETED, data => this.emit('ui:level_completed', data));
    this._listen(GameEvent.COMMAND_EXECUTED, data => this.emit('ui:command_executed', data));
    this._listen(GameEvent.HAZARD_TRIGGERED, data => this.emit('ui:hazard_triggered', data));
    this._listen(GameEvent.DOOR_UNLOCKED, data => this.emit('ui:door_unlocked', data));
  }

  _listen(eventName, handler) {
    if (this.eventBus && typeof this.eventBus.on === 'function') {
      const unsub = this.eventBus.on(eventName, handler);
      if (typeof unsub === 'function') {
        this.unsubscribers.push(unsub);
      }
    }
  }

  on(uiEventName, callback) {
    if (!this.subscriptions.has(uiEventName)) {
      this.subscriptions.set(uiEventName, new Set());
    }
    this.subscriptions.get(uiEventName).add(callback);

    return () => {
      this.subscriptions.get(uiEventName)?.delete(callback);
    };
  }

  emit(uiEventName, data = {}) {
    const handlers = this.subscriptions.get(uiEventName);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (err) {
          console.error(`[GameEngineEventBridge] Error in subscriber for ${uiEventName}:`, err);
        }
      }
    }
  }

  detach() {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers = [];
    this.subscriptions.clear();
  }
}

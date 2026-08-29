/**
 * GitQuest Engine - EventBus
 * Robust Pub/Sub event dispatcher with typed events, wildcards, priority, and replay history.
 */

import { GameEvent } from './Constants.js';
import { EngineUtils } from './Utils.js';

export class EventSubscription {
  constructor(bus, eventName, handler, id) {
    this.bus = bus;
    this.eventName = eventName;
    this.handler = handler;
    this.id = id;
    this.active = true;
  }

  unsubscribe() {
    if (!this.active) return;
    this.active = false;
    this.bus.off(this.eventName, this.id);
  }
}

export class EventBus {
  constructor(options = {}) {
    this.listeners = new Map(); // eventName -> Array<{ id, handler, priority, once }>
    this.history = [];
    this.maxHistory = options.maxHistory || 500;
    this.loggingEnabled = Boolean(options.logging);
    this.nextSubscriptionId = 1;
    this.paused = false;
    this.queue = [];
  }

  /**
   * Subscribe to an event with optional priority
   */
  on(eventName, handler, priority = 0) {
    if (typeof handler !== 'function') {
      throw new Error(`EventBus.on: handler for "${eventName}" must be a function.`);
    }

    const id = this.nextSubscriptionId++;
    const entry = { id, handler, priority, once: false };

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const list = this.listeners.get(eventName);
    list.push(entry);
    list.sort((a, b) => b.priority - a.priority);

    return new EventSubscription(this, eventName, handler, id);
  }

  /**
   * Subscribe to an event once
   */
  once(eventName, handler, priority = 0) {
    if (typeof handler !== 'function') {
      throw new Error(`EventBus.once: handler for "${eventName}" must be a function.`);
    }

    const id = this.nextSubscriptionId++;
    const entry = { id, handler, priority, once: true };

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    const list = this.listeners.get(eventName);
    list.push(entry);
    list.sort((a, b) => b.priority - a.priority);

    return new EventSubscription(this, eventName, handler, id);
  }

  /**
   * Unsubscribe by event name and subscription ID or handler reference
   */
  off(eventName, target) {
    if (!this.listeners.has(eventName)) return false;
    const list = this.listeners.get(eventName);

    const initialLen = list.length;
    const filtered = list.filter(entry => {
      if (typeof target === 'number') {
        return entry.id !== target;
      }
      return entry.handler !== target;
    });

    if (filtered.length === 0) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.set(eventName, filtered);
    }

    return filtered.length < initialLen;
  }

  /**
   * Emit an event immediately or enqueue if paused
   */
  emit(eventName, payload = {}) {
    const timestamp = Date.now();
    const eventRecord = {
      id: EngineUtils.generateUUID(),
      name: eventName,
      payload: EngineUtils.deepClone(payload),
      timestamp
    };

    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    this.history.push(eventRecord);

    if (this.paused) {
      this.queue.push(eventRecord);
      return eventRecord;
    }

    this._dispatch(eventRecord);
    return eventRecord;
  }

  /**
   * Internal dispatch to direct listeners and wildcard listeners
   */
  _dispatch(eventRecord) {
    const { name, payload } = eventRecord;

    // Direct listeners
    if (this.listeners.has(name)) {
      const list = [...this.listeners.get(name)];
      for (const entry of list) {
        try {
          entry.handler(payload, eventRecord);
        } catch (err) {
          console.error(`[EventBus] Error executing listener for "${name}":`, err);
        }

        if (entry.once) {
          this.off(name, entry.id);
        }
      }
    }

    // Wildcard listeners (e.g. 'player:*' or '*')
    for (const [pattern, list] of this.listeners.entries()) {
      if (pattern === '*' || (pattern.endsWith('*') && name.startsWith(pattern.slice(0, -1)))) {
        const copyList = [...list];
        for (const entry of copyList) {
          try {
            entry.handler(payload, eventRecord);
          } catch (err) {
            console.error(`[EventBus] Error executing wildcard listener "${pattern}" for "${name}":`, err);
          }

          if (entry.once) {
            this.off(pattern, entry.id);
          }
        }
      }
    }
  }

  /**
   * Pause event processing
   */
  pause() {
    this.paused = true;
  }

  /**
   * Resume event processing and flush queued events
   */
  resume() {
    this.paused = false;
    while (this.queue.length > 0) {
      const record = this.queue.shift();
      this._dispatch(record);
    }
  }

  /**
   * Get history matching predicate or event name
   */
  getHistory(filter) {
    if (!filter) return [...this.history];
    if (typeof filter === 'string') {
      return this.history.filter(e => e.name === filter);
    }
    if (typeof filter === 'function') {
      return this.history.filter(filter);
    }
    return [...this.history];
  }

  /**
   * Clear listeners and history
   */
  clear() {
    this.listeners.clear();
    this.history = [];
    this.queue = [];
  }
}

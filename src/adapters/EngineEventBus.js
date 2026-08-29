// GitHero Engine Event Bus
// High-throughput decoupled publish/subscribe bus for game physics, mechanics, sound triggers, and spatial events.

export class EngineEventBus {
  constructor() {
    this.subscribers = new Map();
    this.history = [];
    this.maxHistorySize = 100;
  }

  /**
   * Subscribe to specific event topic
   * @param {string} eventName 
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  on(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`[EngineEventBus] Callback for event "${eventName}" must be a function.`);
    }

    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, new Set());
    }

    this.subscribers.get(eventName).add(callback);

    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * Unsubscribe callback from event topic
   * @param {string} eventName 
   * @param {Function} callback 
   */
  off(eventName, callback) {
    if (this.subscribers.has(eventName)) {
      const callbacks = this.subscribers.get(eventName);
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(eventName);
      }
    }
  }

  /**
   * Subscribe to event only once
   * @param {string} eventName 
   * @param {Function} callback 
   */
  once(eventName, callback) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      callback(...args);
    };
    this.on(eventName, wrapper);
  }

  /**
   * Emit event to all registered listeners
   * @param {string} eventName 
   * @param {any} payload 
   */
  emit(eventName, payload = {}) {
    const timestamp = Date.now();
    const eventRecord = { eventName, payload, timestamp };

    // Record in circular event history
    this.history.push(eventRecord);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    if (this.subscribers.has(eventName)) {
      const callbacks = Array.from(this.subscribers.get(eventName));
      for (const cb of callbacks) {
        try {
          cb(payload, eventRecord);
        } catch (err) {
          console.error(`[EngineEventBus] Error in subscriber callback for "${eventName}":`, err);
        }
      }
    }

    // Wildcard subscriber support
    if (this.subscribers.has('*')) {
      const wildcardCallbacks = Array.from(this.subscribers.get('*'));
      for (const cb of wildcardCallbacks) {
        try {
          cb(eventName, payload, eventRecord);
        } catch (err) {
          console.error(`[EngineEventBus] Error in wildcard subscriber:`, err);
        }
      }
    }
  }

  /**
   * Clear all subscribers and history
   */
  clear() {
    this.subscribers.clear();
    this.history = [];
  }

  /**
   * Get recent event history
   * @param {number} limit 
   * @returns {Array}
   */
  getRecentEvents(limit = 20) {
    return this.history.slice(-limit);
  }
}

// Global Singleton Engine Event Bus
export const engineEventBus = new EngineEventBus();

/**
 * EngineEventBridge
 * Manages event subscriptions between the internal engine EventBus and the
 * reactive frontend application layers (Stores, SoundFX, Particles, Telemetry).
 */

export class EngineEventBridge {
  constructor(engine, eventBus = null) {
    this.engine = engine;
    this.eventBus = eventBus || engine?.eventBus || null;
    this.subscriptions = new Map(); // eventName -> Set<Function>
    this.isListening = false;
    this.initBridge();
  }

  /**
   * Bind to engine EventBus or state change notifications
   */
  initBridge() {
    if (this.eventBus && typeof this.eventBus.on === 'function') {
      this.bindEngineEvents();
    } else if (this.engine && typeof this.engine.onStateChange === 'function') {
      this.engine.onStateChange((state) => {
        this.emit('state:change', state);
      });
    }
  }

  bindEngineEvents() {
    const eventsToBridge = [
      'level:loaded',
      'entity:moved',
      'player:moved',
      'box:pushed',
      'box:pulled',
      'goal:reached',
      'command:executed',
      'level:completed',
      'state:change',
      'undo:performed',
      'reset:performed'
    ];

    for (const evt of eventsToBridge) {
      this.eventBus.on(evt, (payload) => {
        this.emit(evt, payload);
      });
    }
  }

  /**
   * Subscribe a frontend listener
   * @param {string} eventName
   * @param {Function} handler
   * @returns {Function} Unsubscribe callback
   */
  subscribe(eventName, handler) {
    if (typeof handler !== 'function') return () => {};

    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, new Set());
    }

    this.subscriptions.get(eventName).add(handler);

    return () => {
      const handlers = this.subscriptions.get(eventName);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Broadcast event to frontend listeners
   * @param {string} eventName
   * @param {any} data
   */
  emit(eventName, data) {
    const handlers = this.subscriptions.get(eventName);
    if (handlers) {
      for (const fn of handlers) {
        try {
          fn(data);
        } catch (err) {
          console.error(`[EngineEventBridge] Error in subscriber for ${eventName}:`, err);
        }
      }
    }

    // Also notify wildcard listeners
    const wildcards = this.subscriptions.get('*');
    if (wildcards) {
      for (const fn of wildcards) {
        try {
          fn(eventName, data);
        } catch (err) {
          console.error(`[EngineEventBridge] Error in wildcard subscriber:`, err);
        }
      }
    }
  }

  /**
   * Clear all active subscriptions
   */
  destroy() {
    this.subscriptions.clear();
  }
}

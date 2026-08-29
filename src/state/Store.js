/**
 * Store
 * Core Reactive Store with selector subscriptions, shallow equality caching,
 * middleware dispatch, and transactional batch updates.
 */

export class Store {
  /**
   * @param {Object} initialState
   * @param {Array<Function>} [middlewares=[]]
   */
  constructor(initialState = {}, middlewares = []) {
    this.state = Object.freeze({ ...initialState });
    this.subscribers = new Set();
    this.middlewares = middlewares;
    this.isBatching = false;
    this.pendingNotify = false;
  }

  /**
   * Get current immutable state snapshot
   * @returns {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Update state with partial object or updater function
   * @param {Object|Function} updater
   * @param {string} [actionType='STATE_UPDATE']
   */
  setState(updater, actionType = 'STATE_UPDATE') {
    const prevState = this.state;
    const partial = typeof updater === 'function' ? updater(prevState) : updater;
    const nextState = Object.freeze({ ...prevState, ...partial });

    // Middleware interception
    for (const mw of this.middlewares) {
      try {
        mw(actionType, prevState, nextState);
      } catch (err) {
        console.error('[Store Middleware Error]:', err);
      }
    }

    this.state = nextState;

    if (this.isBatching) {
      this.pendingNotify = true;
    } else {
      this.notify();
    }
  }

  /**
   * Execute multiple updates in a single batch notification
   * @param {Function} batchFn
   */
  batch(batchFn) {
    this.isBatching = true;
    try {
      batchFn();
    } finally {
      this.isBatching = false;
      if (this.pendingNotify) {
        this.pendingNotify = false;
        this.notify();
      }
    }
  }

  /**
   * Subscribe to state updates
   * @param {Function} listener
   * @returns {Function} Unsubscribe callback
   */
  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  /**
   * Subscribe only to a derived state slice with memoized equality check
   * @param {Function} selector
   * @param {Function} listener
   * @returns {Function} Unsubscribe callback
   */
  select(selector, listener) {
    if (typeof selector !== 'function' || typeof listener !== 'function') return () => {};

    let currentSlice = selector(this.state);
    return this.subscribe((nextState) => {
      const nextSlice = selector(nextState);
      if (nextSlice !== currentSlice && !this.shallowEqual(nextSlice, currentSlice)) {
        currentSlice = nextSlice;
        listener(nextSlice);
      }
    });
  }

  shallowEqual(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state);
      } catch (err) {
        console.error('[Store Subscriber Error]:', err);
      }
    }
  }
}

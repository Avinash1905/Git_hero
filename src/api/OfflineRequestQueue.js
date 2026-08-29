/**
 * OfflineRequestQueue
 * Persistent queue that buffers client mutation requests when the operative is offline
 * and automatically synchronizes them in chronological order once network connectivity is restored.
 */

export class OfflineRequestQueue {
  constructor() {
    this.storageKey = 'githero_offline_queue';
    this.isSyncing = false;
    this.memoryQueue = [];
  }

  /**
   * Read all queued items from storage or fallback memory
   */
  getQueue() {
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
      return [...this.memoryQueue];
    }
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [...this.memoryQueue];
    } catch {
      return [...this.memoryQueue];
    }
  }

  /**
   * Save queue to storage and fallback memory
   */
  saveQueue(queue) {
    this.memoryQueue = [...queue];
    if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(queue));
    } catch (e) {
      console.error('[OfflineQueue] Failed saving queue:', e);
    }
  }

  /**
   * Enqueue a pending mutation
   */
  enqueue(action = {}) {
    const queue = this.getQueue();
    const item = {
      id: Date.now() + Math.random().toString(36).substr(2, 6),
      endpoint: action.endpoint,
      method: action.method || 'POST',
      body: action.body || {},
      timestamp: Date.now()
    };
    queue.push(item);
    this.saveQueue(queue);
    return item;
  }

  /**
   * Flush and synchronize queue with backend API
   */
  async flush(apiClient) {
    if (this.isSyncing) return { syncedCount: 0, remaining: 0 };
    this.isSyncing = true;

    const queue = this.getQueue();
    if (queue.length === 0) {
      this.isSyncing = false;
      return { syncedCount: 0, remaining: 0 };
    }

    let syncedCount = 0;
    const remaining = [];

    for (const item of queue) {
      try {
        await apiClient.request(item.endpoint, {
          method: item.method,
          body: JSON.stringify(item.body)
        });
        syncedCount++;
      } catch (err) {
        // If permanent 4xx error, discard; if temporary network error, preserve
        if (err.status && err.status >= 400 && err.status < 500) {
          console.warn('[OfflineQueue] Discarding invalid offline request:', item, err);
        } else {
          remaining.push(item);
        }
      }
    }

    this.saveQueue(remaining);
    this.isSyncing = false;

    return {
      syncedCount,
      remaining: remaining.length
    };
  }

  clear() {
    this.memoryQueue = [];
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const offlineRequestQueue = new OfflineRequestQueue();

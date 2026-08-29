// GitHero Input Queue Scheduler
// Queues rapid player keystrokes and moves to prevent input drop or animation stuttering.

export class InputQueueScheduler {
  constructor(options = {}) {
    this.intervalMs = options.intervalMs || 65; // ~15 inputs per second max
    this.maxQueueSize = options.maxQueueSize || 8;
    this.queue = [];
    this.timer = null;
    this.isProcessing = false;
    this.onProcessItem = options.onProcessItem || (() => {});
  }

  /**
   * Enqueue an input action
   * @param {string} actionType 
   * @param {any} payload 
   * @returns {boolean} whether enqueued
   */
  enqueue(actionType, payload = {}) {
    if (this.queue.length >= this.maxQueueSize) {
      // Drop excess inputs if queue is saturated
      return false;
    }

    this.queue.push({
      actionType,
      payload,
      timestamp: Date.now()
    });

    this.startProcessing();
    return true;
  }

  /**
   * Start processing the queued actions
   */
  startProcessing() {
    if (this.timer) return;

    this.timer = setInterval(() => {
      if (this.queue.length === 0) {
        clearInterval(this.timer);
        this.timer = null;
        this.isProcessing = false;
        return;
      }

      this.isProcessing = true;
      const nextItem = this.queue.shift();
      try {
        this.onProcessItem(nextItem);
      } catch (err) {
        console.error('[InputQueueScheduler] Error processing item:', err);
      }
    }, this.intervalMs);
  }

  /**
   * Clear all pending queued actions
   */
  clear() {
    this.queue = [];
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isProcessing = false;
  }

  /**
   * Current queue length
   * @returns {number}
   */
  get length() {
    return this.queue.length;
  }
}

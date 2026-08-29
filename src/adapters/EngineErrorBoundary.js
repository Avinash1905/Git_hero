// GitHero Engine Error Boundary & Self-Healing Supervisor
// Isolates runtime game errors, prevents UI crash, and performs rollback to safe checkpoints.

export class EngineErrorBoundary {
  constructor(adapter, options = {}) {
    this.adapter = adapter;
    this.onErrorHandled = options.onErrorHandled || (() => {});
    this.maxErrorCount = options.maxErrorCount || 5;
    this.errorLog = [];
  }

  /**
   * Execute engine action with boundary safety wrapper
   * @param {string} actionName 
   * @param {Function} actionFn 
   * @param {any} fallbackResult 
   * @returns {any}
   */
  safelyExecute(actionName, actionFn, fallbackResult = null) {
    try {
      return actionFn();
    } catch (error) {
      this.handleEngineError(actionName, error);
      return fallbackResult;
    }
  }

  /**
   * Execute async engine action safely
   * @param {string} actionName 
   * @param {Function} asyncActionFn 
   * @param {any} fallbackResult 
   * @returns {Promise<any>}
   */
  async safelyExecuteAsync(actionName, asyncActionFn, fallbackResult = null) {
    try {
      return await asyncActionFn();
    } catch (error) {
      this.handleEngineError(actionName, error);
      return fallbackResult;
    }
  }

  /**
   * Handle and record engine error
   * @param {string} actionName 
   * @param {Error} error 
   */
  handleEngineError(actionName, error) {
    const errorRecord = {
      timestamp: Date.now(),
      action: actionName,
      message: error.message || String(error),
      stack: error.stack || ''
    };

    console.error(`[EngineErrorBoundary] Caught exception during "${actionName}":`, error);
    this.errorLog.push(errorRecord);

    // Attempt rollback to safe state
    if (this.adapter && typeof this.adapter.undo === 'function') {
      try {
        console.warn(`[EngineErrorBoundary] Attempting rollback for level ${this.adapter.currentLevelId}...`);
        this.adapter.undo();
      } catch (rollbackErr) {
        console.error('[EngineErrorBoundary] Rollback failed, resetting level:', rollbackErr);
        if (typeof this.adapter.reset === 'function') {
          this.adapter.reset();
        }
      }
    }

    this.onErrorHandled(errorRecord);
  }

  /**
   * Get all captured error records
   * @returns {Array}
   */
  getErrorLog() {
    return [...this.errorLog];
  }

  /**
   * Clear error logs
   */
  clearErrors() {
    this.errorLog = [];
  }
}

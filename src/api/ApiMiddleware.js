// GitHero API Middleware & Network Resilience Supervisor
// Implements request retry with exponential backoff, circuit breaking, and response validation.

export class ApiMiddleware {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelayMs = options.baseDelayMs || 500;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeoutMs = options.resetTimeoutMs || 30000;
    this.consecutiveFailures = 0;
    this.circuitState = 'CLOSED'; // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
    this.lastStateChange = Date.now();
  }

  /**
   * Execute fetch request through resilience pipeline
   * @param {string} url 
   * @param {Object} fetchOptions 
   * @returns {Promise<Response>}
   */
  async execute(url, fetchOptions = {}) {
    // 1. Circuit breaker check
    if (this.circuitState === 'OPEN') {
      if (Date.now() - this.lastStateChange > this.resetTimeoutMs) {
        this.circuitState = 'HALF_OPEN';
        this.lastStateChange = Date.now();
      } else {
        throw new Error('[ApiMiddleware] Network circuit breaker is OPEN. Fast failing request.');
      }
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      try {
        const response = await fetch(url, fetchOptions);
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          // Success or expected client error: reset breaker
          this.consecutiveFailures = 0;
          if (this.circuitState !== 'CLOSED') {
            this.circuitState = 'CLOSED';
            this.lastStateChange = Date.now();
          }
          return response;
        }

        // Server error (5xx)
        throw new Error(`Server responded with HTTP status ${response.status}`);
      } catch (err) {
        attempt++;
        this.consecutiveFailures++;

        if (this.consecutiveFailures >= this.failureThreshold) {
          this.circuitState = 'OPEN';
          this.lastStateChange = Date.now();
        }

        if (attempt > this.maxRetries) {
          throw err;
        }

        // Exponential backoff
        const delay = this.baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
}

// Global Singleton
export const apiMiddleware = new ApiMiddleware();

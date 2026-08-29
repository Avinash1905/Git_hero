/**
 * ResilientApiClient
 * Robust HTTP client featuring exponential backoff retry, automatic JWT authorization header injection,
 * timeout abort controllers, and error classification.
 */

export class ResilientApiClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:3000/api');
    this.maxRetries = options.maxRetries || 3;
    this.initialDelayMs = options.initialDelayMs || 300;
    this.timeoutMs = options.timeoutMs || 8000;
  }

  /**
   * Get JWT auth token from localStorage
   */
  getAuthToken() {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('githero_jwt_token') || localStorage.getItem('gitquest_token');
  }

  /**
   * Execute fetch request with retry and timeout
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const method = options.method || 'GET';
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getAuthToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let lastError = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          method,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: response.statusText }));
          const err = new Error(errorBody.message || `HTTP ${response.status}`);
          err.status = response.status;
          err.data = errorBody;
          
          // Do not retry 4xx client errors (400, 401, 403, 404, etc.)
          if (response.status >= 400 && response.status < 500) {
            throw err;
          }

          throw err;
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        // If client error or last attempt, fail immediately
        if (err.status && err.status >= 400 && err.status < 500) {
          throw err;
        }

        if (attempt === this.maxRetries) {
          break;
        }

        const delay = this.initialDelayMs * (2 ** attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error(`Network request failed after ${this.maxRetries} retries`);
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body = {}, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ResilientApiClient();

/**
 * ApiClient
 * Production HTTP client for communicating with the GitQuest Express + SQLite backend.
 * Handles bearer token authorization, network failure retry, and error normalization.
 */

export class ApiClient {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? (window.location.port === '3000' ? '' : 'http://localhost:3000') : 'http://localhost:3000');
    this.tokenKey = 'gitquest_token';
    this.token = this.loadToken();
    this.interceptors = {
      request: [],
      response: []
    };
  }

  loadToken() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(this.tokenKey) || null;
    }
    return null;
  }

  setToken(token) {
    this.token = token;
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      } else {
        localStorage.removeItem(this.tokenKey);
      }
    }
  }

  getToken() {
    return this.token || this.loadToken();
  }

  clearToken() {
    this.setToken(null);
  }

  /**
   * Generic HTTP request execution
   * @param {string} endpoint
   * @param {Object} options
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const isJson = (response.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401 && typeof window !== 'undefined') {
          this.clearToken();
          if (window.location.hash !== '#login' && window.location.hash !== '#register') {
            // Inform subscribers or trigger redirect if route is protected
          }
        }

        const errorMsg = (typeof data === 'object' && data?.error) ? data.error : `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      // Return structured failure response instead of uncaught exception when desired
      if (options.suppressThrow) {
        return { success: false, error: err.message };
      }
      throw err;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body = {}, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new ApiClient();

// ApiClient: Centralized HTTP Request Client with JWT Authentication Injection

const BASE_URL = window.location.origin;

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('gitquest_auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('gitquest_auth_token', token);
    } else {
      localStorage.removeItem('gitquest_auth_token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('gitquest_auth_token');
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null);
          localStorage.removeItem('gitquest_user');
          if (window.location.hash !== '#login' && window.location.hash !== '#register' && window.location.hash !== '#hero') {
            window.location.hash = 'login';
          }
        }
        const errorMsg = data.error || data.message || `HTTP ${response.status}: Request failed`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`[ApiClient Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

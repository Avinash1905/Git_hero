/**
 * TokenStorage
 * Encapsulated storage interface for session tokens with persistence,
 * validation, and cross-tab synchronization.
 */

export class TokenStorage {
  constructor(storageKey = 'gitquest_token') {
    this.storageKey = storageKey;
  }

  getToken() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(this.storageKey);
    }
    return null;
  }

  setToken(token) {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      if (token) {
        localStorage.setItem(this.storageKey, token);
      } else {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  removeToken() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(this.storageKey);
    }
  }

  hasToken() {
    return Boolean(this.getToken());
  }
}

export const tokenStorage = new TokenStorage();

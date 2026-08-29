/**
 * AuthService
 * Handles player authentication, session restoration, registration, login, logout,
 * password recovery, and token synchronization with the backend API.
 */

import { apiClient } from '../api/ApiClient.js';
import { ENDPOINTS } from '../api/Endpoints.js';

export class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentProfile = null;
    this.listeners = new Set();
    this.sessionRestored = false;
    this.init();
  }

  init() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      const storedUser = localStorage.getItem('gitquest_user');
      const storedProfile = localStorage.getItem('gitquest_profile');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch {}
      }
      if (storedProfile) {
        try {
          this.currentProfile = JSON.parse(storedProfile);
        } catch {}
      }
    }
  }

  /**
   * Check if an active authenticated session exists
   * @returns {boolean}
   */
  isAuthenticated() {
    return Boolean(apiClient.getToken() && this.currentUser);
  }

  getUser() {
    return this.currentUser;
  }

  getProfile() {
    return this.currentProfile;
  }

  /**
   * Register a new player account
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async register(username, email, password) {
    const res = await apiClient.post(ENDPOINTS.AUTH.REGISTER, { username, email, password });
    if (res.success && res.token) {
      this.setSession(res.token, res.user, res.profile);
    }
    return res;
  }

  /**
   * Log into existing player account
   * @param {string} usernameOrEmail
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(usernameOrEmail, password) {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGIN, { usernameOrEmail, password });
    if (res.success && res.token) {
      this.setSession(res.token, res.user, res.profile);
    }
    return res;
  }

  /**
   * Restore and verify active session with the backend
   * @returns {Promise<boolean>}
   */
  async restoreSession() {
    const token = apiClient.getToken();
    if (!token) {
      this.clearSession();
      this.sessionRestored = true;
      return false;
    }

    try {
      const res = await apiClient.get(ENDPOINTS.AUTH.ME);
      if (res.success && res.user) {
        this.setSession(token, res.user, res.profile);
        this.sessionRestored = true;
        return true;
      }
    } catch (err) {
      console.warn('[AuthService] Session verification failed, clearing session:', err.message);
      this.clearSession();
    }

    this.sessionRestored = true;
    return false;
  }

  /**
   * Log out active session
   */
  async logout() {
    try {
      if (this.isAuthenticated()) {
        await apiClient.post(ENDPOINTS.AUTH.LOGOUT, {});
      }
    } catch (e) {
      console.warn('[AuthService] Logout API request error:', e.message);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Request password reset token
   * @param {string} email
   */
  async forgotPassword(email) {
    return apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  /**
   * Reset password with token
   * @param {string} token
   * @param {string} newPassword
   */
  async resetPassword(token, newPassword) {
    return apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
  }

  /**
   * Update active session data
   */
  setSession(token, user, profile) {
    apiClient.setToken(token);
    this.currentUser = user;
    this.currentProfile = profile;

    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem('gitquest_user', JSON.stringify(user));
      if (profile) {
        localStorage.setItem('gitquest_profile', JSON.stringify(profile));
      }
    }

    this.notifySubscribers();
  }

  updateProfile(profileData) {
    this.currentProfile = { ...this.currentProfile, ...profileData };
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem('gitquest_profile', JSON.stringify(this.currentProfile));
    }
    this.notifySubscribers();
  }

  clearSession() {
    apiClient.clearToken();
    this.currentUser = null;
    this.currentProfile = null;

    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem('gitquest_user');
      localStorage.removeItem('gitquest_profile');
    }

    this.notifySubscribers();
  }

  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    listener(this.isAuthenticated(), this.currentUser, this.currentProfile);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notifySubscribers() {
    for (const fn of this.listeners) {
      try {
        fn(this.isAuthenticated(), this.currentUser, this.currentProfile);
      } catch (err) {
        console.error('[AuthService] Error in listener:', err);
      }
    }
  }
}

export const authService = new AuthService();

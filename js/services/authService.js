// AuthService: Authentication and Session State Management
import { apiClient } from './apiClient.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentProfile = null;
    this.listeners = [];
    this.init();
  }

  init() {
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

  isAuthenticated() {
    return Boolean(apiClient.getToken() && this.currentUser);
  }

  getUser() {
    return this.currentUser;
  }

  getProfile() {
    return this.currentProfile;
  }

  async register(username, email, password) {
    const res = await apiClient.post('/api/auth/register', { username, email, password });
    if (res.success && res.token) {
      this.setSession(res.token, res.user, res.profile);
    }
    return res;
  }

  async login(usernameOrEmail, password) {
    const res = await apiClient.post('/api/auth/login', { usernameOrEmail, password });
    if (res.success && res.token) {
      this.setSession(res.token, res.user, res.profile);
    }
    return res;
  }

  async logout() {
    try {
      if (this.isAuthenticated()) {
        await apiClient.post('/api/auth/logout', {});
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      this.clearSession();
    }
  }

  async forgotPassword(email) {
    return apiClient.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return apiClient.post('/api/auth/reset-password', { token, newPassword });
  }

  async fetchMe() {
    if (!apiClient.getToken()) return null;
    try {
      const res = await apiClient.get('/api/auth/me');
      if (res.success) {
        this.currentUser = res.user;
        this.currentProfile = res.profile;
        localStorage.setItem('gitquest_user', JSON.stringify(res.user));
        localStorage.setItem('gitquest_profile', JSON.stringify(res.profile));
        this.notifyListeners();
        return res;
      }
    } catch (e) {
      console.warn('fetchMe failed:', e.message);
      this.clearSession();
    }
    return null;
  }

  setSession(token, user, profile) {
    apiClient.setToken(token);
    this.currentUser = user;
    this.currentProfile = profile;
    localStorage.setItem('gitquest_user', JSON.stringify(user));
    if (profile) {
      localStorage.setItem('gitquest_profile', JSON.stringify(profile));
    }
    this.notifyListeners();
  }

  clearSession() {
    apiClient.setToken(null);
    this.currentUser = null;
    this.currentProfile = null;
    localStorage.removeItem('gitquest_user');
    localStorage.removeItem('gitquest_profile');
    this.notifyListeners();
  }

  onAuthStateChanged(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  notifyListeners() {
    for (const fn of this.listeners) {
      try {
        fn(this.currentUser, this.currentProfile);
      } catch (err) {
        console.error('Auth state listener error:', err);
      }
    }
  }
}

export const authService = new AuthService();

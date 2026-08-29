/**
 * AuthManager
 * High-level coordinator managing authentication operations, session validation,
 * credential caching, and notifications across components.
 */

import { authService } from '../services/authService.js';
import { authStore } from '../state/AuthStore.js';
import { AuthGuard } from './AuthGuards.js';

export class AuthManager {
  /**
   * Bootstraps authentication state on application startup
   */
  static async initialize() {
    authStore.setLoading();
    try {
      const restored = await authService.restoreSession();
      if (restored) {
        console.log('[AuthManager] Session restored successfully for user:', authService.getUser()?.username);
      }
    } catch (err) {
      console.warn('[AuthManager] Session restoration failed:', err);
    }
  }

  /**
   * Log in user and navigate to target route
   */
  static async login(usernameOrEmail, password) {
    authStore.setLoading();
    try {
      const res = await authService.login(usernameOrEmail, password);
      if (res.success) {
        const nextRoute = AuthGuard.resolvePostLoginRoute();
        return { success: true, nextRoute, user: res.user };
      }
      authStore.setError(res.error || 'Invalid credentials');
      return { success: false, error: res.error };
    } catch (err) {
      authStore.setError(err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Register new user
   */
  static async register(username, email, password) {
    authStore.setLoading();
    try {
      const res = await authService.register(username, email, password);
      if (res.success) {
        const nextRoute = 'dashboard';
        return { success: true, nextRoute, user: res.user };
      }
      authStore.setError(res.error || 'Registration failed');
      return { success: false, error: res.error };
    } catch (err) {
      authStore.setError(err.message);
      return { success: false, error: err.message };
    }
  }

  /**
   * Log out active user
   */
  static async logout() {
    await authService.logout();
    if (typeof window !== 'undefined') {
      window.location.hash = 'login';
    }
  }
}

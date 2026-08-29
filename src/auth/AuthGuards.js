/**
 * AuthGuards
 * Enforces route accessibility rules, protected route redirects, and return-to target resolution.
 */

import { authService } from '../services/authService.js';
import { authStore } from '../state/AuthStore.js';

export const PUBLIC_ROUTES = new Set([
  'hero',
  'home',
  'login',
  'register',
  'forgot-password',
  'reset-password',
  'manual',
  'about'
]);

export const PROTECTED_ROUTES = new Set([
  'dashboard',
  'main',
  'levels',
  'gameplay',
  'world-map',
  'profile',
  'leaderboard',
  'achievements',
  'daily',
  'settings',
  'editor'
]);

export class AuthGuard {
  /**
   * Check if route can be accessed by the current user
   * @param {string} route - Route identifier
   * @returns {{allowed: boolean, redirect?: string}}
   */
  static checkAccess(route) {
    const cleanRoute = (route || 'hero').toLowerCase().replace('#', '');

    // Public routes are always allowed
    if (PUBLIC_ROUTES.has(cleanRoute)) {
      return { allowed: true };
    }

    // Check if user is authenticated
    const isAuth = authService.isAuthenticated();

    if (PROTECTED_ROUTES.has(cleanRoute)) {
      if (isAuth) {
        return { allowed: true };
      }

      // Unauthenticated trying to access protected route -> save intended route and redirect
      authStore.setIntendedRoute(cleanRoute);
      return {
        allowed: false,
        redirect: 'login',
        reason: 'Authentication required to access protected command terminal.'
      };
    }

    // Default fallback
    return { allowed: true };
  }

  /**
   * Resolve post-login destination route
   * @returns {string}
   */
  static resolvePostLoginRoute() {
    const intended = authStore.getState().intendedRoute;
    authStore.clearIntendedRoute();
    return intended || 'dashboard';
  }
}

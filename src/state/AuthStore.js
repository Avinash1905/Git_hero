/**
 * AuthStore
 * Reactive domain store for authentication state, user identity, and session credentials.
 */

import { Store } from './Store.js';
import { authService } from '../services/authService.js';

export class AuthStore extends Store {
  constructor() {
    super({
      isAuthenticated: authService.isAuthenticated(),
      user: authService.getUser(),
      status: authService.isAuthenticated() ? 'AUTHENTICATED' : 'IDLE',
      error: null,
      intendedRoute: null
    });

    this.bindAuthService();
  }

  bindAuthService() {
    authService.subscribe((isAuth, user) => {
      this.setState({
        isAuthenticated: isAuth,
        user,
        status: isAuth ? 'AUTHENTICATED' : 'UNAUTHENTICATED',
        error: null
      }, 'AUTH_STATE_CHANGED');
    });
  }

  setIntendedRoute(route) {
    this.setState({ intendedRoute: route }, 'SET_INTENDED_ROUTE');
  }

  clearIntendedRoute() {
    this.setState({ intendedRoute: null }, 'CLEAR_INTENDED_ROUTE');
  }

  setError(error) {
    this.setState({ error, status: 'ERROR' }, 'AUTH_ERROR');
  }

  setLoading() {
    this.setState({ status: 'LOADING', error: null }, 'AUTH_LOADING');
  }
}

export const authStore = new AuthStore();

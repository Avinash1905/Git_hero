/**
 * GitQuest Custom Hook: useAuth
 */

import { authStore } from '../state/DomainStores.js';
import { authService } from '../../js/services/authService.js';

export function useAuth() {
  const state = authStore.getState();

  const login = async (usernameOrEmail, password) => {
    authStore.setLoading(true);
    try {
      const res = await authService.login(usernameOrEmail, password);
      if (res.success) {
        authStore.setAuthenticated(res.user, res.profile, res.token);
      }
      return res;
    } catch (err) {
      authStore.setError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    authStore.setLoading(true);
    try {
      const res = await authService.register(username, email, password);
      if (res.success) {
        authStore.setAuthenticated(res.user, res.profile, res.token);
      }
      return res;
    } catch (err) {
      authStore.setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    authStore.setUnauthenticated();
  };

  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    subscribe: (fn) => authStore.subscribe(fn)
  };
}

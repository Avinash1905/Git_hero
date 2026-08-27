/**
 * GitHero Authentication & Session Service
 * Manages user authentication, registration, password recovery, onboarding status, and token lifecycle.
 */

import { UserModel } from '../types/models.js';

const AUTH_STORAGE_KEY = 'githero_auth_session';

export class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.onboardingCompleted = typeof localStorage !== 'undefined' ? localStorage.getItem('githero_onboarding_done') === 'true' : true;
  }

  loadSession() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          return new UserModel(JSON.parse(raw));
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth session:', e);
    }
    // Default guest/player session
    return new UserModel({ username: '@cyber_ninja', title: 'Grandmaster' });
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save auth session:', e);
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  async login(usernameOrEmail, password) {
    // API-ready simulation
    if (!usernameOrEmail || !password) {
      throw new Error('Username/email and password are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const username = usernameOrEmail.startsWith('@') ? usernameOrEmail : `@${usernameOrEmail}`;
    const user = new UserModel({
      username,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@githero.io`
    });

    this.saveSession(user);
    return { success: true, user };
  }

  async register(username, email, password) {
    if (!username || !email || !password) {
      throw new Error('All registration fields are required.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const formattedUsername = username.startsWith('@') ? username : `@${username}`;
    const user = new UserModel({
      username: formattedUsername,
      email
    });

    this.saveSession(user);
    return { success: true, user };
  }

  async requestPasswordReset(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid developer email address.');
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${email}.`
    };
  }

  completeOnboarding() {
    this.onboardingCompleted = true;
    localStorage.setItem('githero_onboarding_done', 'true');
  }

  isOnboardingDone() {
    return this.onboardingCompleted;
  }

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUser = new UserModel({ username: '@guest_coder', title: 'Novice' });
  }
}

export const authService = new AuthService();

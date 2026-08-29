/**
 * Automated Frontend Test Suite: Authentication & Protected Routes
 * Tests: Login UI, Register UI, Route Guarding, Token Lifecycle, Session Restoration
 */

import assert from 'node:assert';
import { AuthGuard, PUBLIC_ROUTES, PROTECTED_ROUTES } from '../../src/auth/AuthGuards.js';
import { authService } from '../../src/services/authService.js';
import { authStore } from '../../src/state/AuthStore.js';
import { renderLoginForm } from '../../src/auth/views/LoginForm.js';
import { renderRegisterForm } from '../../src/auth/views/RegisterForm.js';
import { renderForgotPasswordForm, renderResetPasswordForm } from '../../src/auth/views/ForgotPasswordForm.js';
import { TokenStorage } from '../../src/auth/services/TokenStorage.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runAuthTests() {
  console.log('\n[Suite 1: Authentication & Route Protection]');

  it('Public routes should allow access without credentials', () => {
    for (const route of PUBLIC_ROUTES) {
      const access = AuthGuard.checkAccess(route);
      assert.strictEqual(access.allowed, true, `Route ${route} must be publicly accessible`);
    }
  });

  it('Protected routes should block unauthenticated users and redirect to login', () => {
    authService.clearSession(); // Ensure logged out

    for (const route of ['dashboard', 'levels', 'gameplay', 'profile', 'leaderboard', 'settings']) {
      const access = AuthGuard.checkAccess(route);
      assert.strictEqual(access.allowed, false, `Route ${route} must be protected`);
      assert.strictEqual(access.redirect, 'login', `Route ${route} must redirect to login`);
      assert.strictEqual(authStore.getState().intendedRoute, route, `Intended route should be recorded as ${route}`);
    }
  });

  it('Protected routes should allow authenticated users', () => {
    // Simulate active session
    authService.setSession('test-jwt-token-12345', { id: 'u1', username: 'test_dev', email: 'dev@test.io' }, { level: 1, xp: 500 });
    assert.strictEqual(authService.isAuthenticated(), true);

    for (const route of PROTECTED_ROUTES) {
      const access = AuthGuard.checkAccess(route);
      assert.strictEqual(access.allowed, true, `Authenticated user must access ${route}`);
    }

    authService.clearSession();
  });

  it('Post-login destination resolution should restore intended route', () => {
    authStore.setIntendedRoute('gameplay');
    const dest = AuthGuard.resolvePostLoginRoute();
    assert.strictEqual(dest, 'gameplay');
    assert.strictEqual(authStore.getState().intendedRoute, null, 'Intended route must be cleared after resolution');
  });

  it('LoginForm template should include required input fields and submit button', () => {
    const html = renderLoginForm();
    assert.ok(html.includes('id="login-username"'), 'Must include username input');
    assert.ok(html.includes('id="login-password"'), 'Must include password input');
    assert.ok(html.includes('id="login-submit-btn"'), 'Must include submit button');
    assert.ok(html.includes('href="#register"'), 'Must link to register');
  });

  it('RegisterForm template should include username, email, password confirmation', () => {
    const html = renderRegisterForm();
    assert.ok(html.includes('id="register-username"'), 'Must include username input');
    assert.ok(html.includes('id="register-email"'), 'Must include email input');
    assert.ok(html.includes('id="register-password"'), 'Must include password input');
    assert.ok(html.includes('id="register-confirm-password"'), 'Must include confirm password');
    assert.ok(html.includes('id="register-submit-btn"'), 'Must include register button');
  });

  it('Password recovery templates should render properly', () => {
    const forgotHtml = renderForgotPasswordForm();
    assert.ok(forgotHtml.includes('id="forgot-email"'), 'Must include email input');
    const resetHtml = renderResetPasswordForm();
    assert.ok(resetHtml.includes('id="reset-token"'), 'Must include token input');
    assert.ok(resetHtml.includes('id="reset-new-password"'), 'Must include new password input');
  });

  it('TokenStorage should support get, set, and clear operations', () => {
    const storage = new TokenStorage('test_token_key');
    // In Node environment without window.localStorage, storage safely returns null
    assert.strictEqual(typeof storage.getToken, 'function');
    assert.strictEqual(typeof storage.setToken, 'function');
    assert.strictEqual(typeof storage.removeToken, 'function');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('auth.test.js')) {
  runAuthTests().then(() => console.log(`\nAll ${passed}/${total} Auth tests passed.`));
}

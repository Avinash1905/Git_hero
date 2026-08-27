/**
 * LoginForm View
 * Renders the player login screen with Stitch styling, client validation, and links to register and recovery.
 */

import { renderAuthCard } from '../components/AuthCard.js';

export function renderLoginForm(errorMessage = '', successMessage = '') {
  const formHtml = `
    <form id="auth-login-form" class="space-y-4">
      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="login-username">
          Username or Email
        </label>
        <input 
          id="login-username" 
          name="usernameOrEmail" 
          type="text" 
          required
          autocomplete="username"
          placeholder="e.g. dev_pilot or dev@repo.io" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label class="text-terminal-label font-terminal-label text-on-surface-variant text-xs uppercase tracking-wider" for="login-password">
            Password
          </label>
          <a href="#forgot-password" class="text-xs text-secondary hover:text-primary transition-colors font-terminal-code">Forgot password?</a>
        </div>
        <input 
          id="login-password" 
          name="password" 
          type="password" 
          required
          autocomplete="current-password"
          placeholder="••••••••••••" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div class="pt-2">
        <button 
          id="login-submit-btn"
          type="submit" 
          class="w-full bg-primary hover:bg-primary/90 text-on-primary font-terminal-label uppercase tracking-wider font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Authenticate Session</span>
          <span class="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
        </button>
      </div>
    </form>
  `;

  const footerHtml = `
    <span>Don't have a contributor account?</span>
    <a href="#register" class="text-primary hover:underline ml-1 font-bold">Register here</a>
  `;

  return renderAuthCard({
    badgeText: 'Auth Terminal :: Node 01',
    title: 'Player Login',
    subtitle: 'Authenticate to access repository challenges',
    errorMessage,
    successMessage,
    childrenHtml: formHtml,
    footerHtml
  });
}

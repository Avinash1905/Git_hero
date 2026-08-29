/**
 * RegisterForm View
 * Renders the player registration screen with real validation, password checks, and Stitch styling.
 */

import { renderAuthCard } from '../components/AuthCard.js';

export function renderRegisterForm(errorMessage = '', successMessage = '') {
  const formHtml = `
    <form id="auth-register-form" class="space-y-4">
      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="register-username">
          Contributor Handle (Username)
        </label>
        <input 
          id="register-username" 
          name="username" 
          type="text" 
          required
          autocomplete="username"
          minlength="3"
          maxlength="24"
          placeholder="e.g. byte_master" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="register-email">
          Email Address
        </label>
        <input 
          id="register-email" 
          name="email" 
          type="email" 
          required
          autocomplete="email"
          placeholder="dev@repository.io" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="register-password">
          Master Password (min 6 characters)
        </label>
        <input 
          id="register-password" 
          name="password" 
          type="password" 
          required
          autocomplete="new-password"
          minlength="6"
          placeholder="••••••••••••" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="register-confirm-password">
          Confirm Password
        </label>
        <input 
          id="register-confirm-password" 
          name="confirmPassword" 
          type="password" 
          required
          autocomplete="new-password"
          minlength="6"
          placeholder="••••••••••••" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div class="pt-2">
        <button 
          id="register-submit-btn"
          type="submit" 
          class="w-full bg-primary hover:bg-primary/90 text-on-primary font-terminal-label uppercase tracking-wider font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Initialize Contributor Account</span>
          <span class="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">rocket_launch</span>
        </button>
      </div>
    </form>
  `;

  const footerHtml = `
    <span>Already registered in the cluster?</span>
    <a href="#login" class="text-primary hover:underline ml-1 font-bold">Log in here</a>
  `;

  return renderAuthCard({
    badgeText: 'Registration Terminal :: Node 02',
    title: 'Create Account',
    subtitle: 'Begin your journey across 250 repository worlds',
    errorMessage,
    successMessage,
    childrenHtml: formHtml,
    footerHtml
  });
}

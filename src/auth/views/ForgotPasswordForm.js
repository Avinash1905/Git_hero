/**
 * ForgotPasswordForm & ResetPasswordForm
 * Views for account password recovery and credential resetting.
 */

import { renderAuthCard } from '../components/AuthCard.js';

export function renderForgotPasswordForm(errorMessage = '', successMessage = '') {
  const formHtml = `
    <form id="auth-forgot-password-form" class="space-y-4">
      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="forgot-email">
          Registered Email Address
        </label>
        <input 
          id="forgot-email" 
          name="email" 
          type="email" 
          required
          autocomplete="email"
          placeholder="dev@repository.io" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div class="pt-2">
        <button 
          id="forgot-submit-btn"
          type="submit" 
          class="w-full bg-secondary hover:bg-secondary/90 text-on-secondary font-terminal-label uppercase tracking-wider font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Send Recovery Code</span>
          <span class="material-symbols-outlined text-lg">mark_email_read</span>
        </button>
      </div>
    </form>
  `;

  const footerHtml = `
    <a href="#login" class="text-secondary hover:underline font-bold flex items-center justify-center gap-1">
      <span class="material-symbols-outlined text-[14px]">arrow_back</span>
      <span>Back to Login</span>
    </a>
  `;

  return renderAuthCard({
    badgeText: 'Recovery Terminal :: Node 03',
    title: 'Forgot Password',
    subtitle: 'Enter your registered email to receive access credentials',
    errorMessage,
    successMessage,
    childrenHtml: formHtml,
    footerHtml
  });
}

export function renderResetPasswordForm(errorMessage = '', successMessage = '') {
  const formHtml = `
    <form id="auth-reset-password-form" class="space-y-4">
      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reset-token">
          Reset Token
        </label>
        <input 
          id="reset-token" 
          name="token" 
          type="text" 
          required
          placeholder="Paste token here" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label class="block text-terminal-label font-terminal-label text-on-surface-variant text-xs mb-1.5 uppercase tracking-wider" for="reset-new-password">
          New Password (min 6 characters)
        </label>
        <input 
          id="reset-new-password" 
          name="newPassword" 
          type="password" 
          required
          minlength="6"
          placeholder="••••••••••••" 
          class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-on-surface-variant/40"
        />
      </div>

      <div class="pt-2">
        <button 
          id="reset-submit-btn"
          type="submit" 
          class="w-full bg-primary hover:bg-primary/90 text-on-primary font-terminal-label uppercase tracking-wider font-bold py-3 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Update Password</span>
          <span class="material-symbols-outlined text-lg">check</span>
        </button>
      </div>
    </form>
  `;

  const footerHtml = `
    <a href="#login" class="text-primary hover:underline font-bold">Return to Login</a>
  `;

  return renderAuthCard({
    badgeText: 'Reset Terminal :: Node 04',
    title: 'Reset Password',
    subtitle: 'Create a new master password for your repository account',
    errorMessage,
    successMessage,
    childrenHtml: formHtml,
    footerHtml
  });
}

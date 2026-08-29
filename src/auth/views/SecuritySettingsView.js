// GitHero Security Settings & Multi-Factor Authentication View
// Renders user security controls, credential rotation, 2FA status, and session audits.

import { PasswordSecurity } from '../PasswordSecurity.js';

export function renderSecuritySettingsView(userData = {}, feedback = {}) {
  const { error = '', success = '' } = feedback;
  const is2FAEnabled = !!userData.twoFactorEnabled;

  return `
    <div id="security-settings-container" class="space-y-6 max-w-4xl mx-auto">
      <!-- Section Header -->
      <div class="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
        <span class="material-symbols-Outlined text-primary text-2xl">shield_lock</span>
        <div>
          <h2 class="text-xl font-bold text-on-surface">Account Security & Credentials</h2>
          <p class="text-sm text-on-surface-variant">Configure authentication protocols, credential rotation, and multi-factor security.</p>
        </div>
      </div>

      <!-- Feedback Alerts -->
      ${error ? `
        <div class="p-3 bg-error-container/20 border border-error/50 rounded flex items-center gap-2 text-error text-sm">
          <span class="material-symbols-Outlined">error</span>
          <span>${error}</span>
        </div>
      ` : ''}

      ${success ? `
        <div class="p-3 bg-primary/20 border border-primary/50 rounded flex items-center gap-2 text-primary text-sm">
          <span class="material-symbols-Outlined">check_circle</span>
          <span>${success}</span>
        </div>
      ` : ''}

      <!-- Password Rotation Form -->
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/30 shadow-md">
        <h3 class="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
          <span class="material-symbols-Outlined text-secondary">key</span>
          Update Master Password
        </h3>
        <form id="form-change-password" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1" for="current-password">Current Password</label>
            <input type="password" id="current-password" required placeholder="••••••••" class="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"/>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1" for="new-password">New Password</label>
              <input type="password" id="new-password" required placeholder="••••••••" class="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"/>
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1" for="confirm-new-password">Confirm New Password</label>
              <input type="password" id="confirm-new-password" required placeholder="••••••••" class="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-sm text-on-surface focus:border-primary focus:outline-none"/>
            </div>
          </div>
          <div id="password-strength-preview">
            ${PasswordSecurity.renderStrengthMeter('')}
          </div>
          <button type="submit" class="px-4 py-2 bg-primary text-on-primary font-bold rounded hover:bg-primary/90 transition text-sm flex items-center gap-2">
            <span class="material-symbols-Outlined text-sm">lock_reset</span>
            Update Password
          </button>
        </form>
      </div>

      <!-- Multi-Factor Authentication (2FA) -->
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/30 shadow-md">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-base font-semibold text-on-surface flex items-center gap-2">
              <span class="material-symbols-Outlined text-tertiary">phonelink_lock</span>
              Two-Factor Authentication (2FA)
            </h3>
            <p class="text-xs text-on-surface-variant mt-1">Protect your terminal credentials with time-based one-time passwords (TOTP).</p>
          </div>
          <span class="px-2.5 py-1 text-xs font-bold rounded uppercase ${is2FAEnabled ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container-high text-on-surface-variant'}">
            ${is2FAEnabled ? 'ACTIVE' : 'DISABLED'}
          </span>
        </div>

        <div class="p-4 bg-surface-container-low rounded border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-surface-container-highest rounded-full text-primary">
              <span class="material-symbols-Outlined text-2xl">qr_code_2</span>
            </div>
            <div>
              <p class="text-sm font-medium text-on-surface">Authenticator App Integration</p>
              <p class="text-xs text-on-surface-variant">Compatible with Google Authenticator, Authy, or 1Password.</p>
            </div>
          </div>
          <button id="toggle-2fa-btn" class="px-4 py-2 text-sm font-semibold rounded border ${is2FAEnabled ? 'border-error text-error hover:bg-error/10' : 'border-primary text-primary hover:bg-primary/10'} transition">
            ${is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA Setup'}
          </button>
        </div>
      </div>

      <!-- Active Sessions & Device Audits -->
      <div class="bg-surface-container rounded-lg p-6 border border-outline-variant/30 shadow-md">
        <h3 class="text-base font-semibold text-on-surface flex items-center gap-2 mb-4">
          <span class="material-symbols-Outlined text-secondary">devices</span>
          Active Terminal Sessions
        </h3>
        <div class="divide-y divide-outline-variant/20 text-sm">
          <div class="py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="material-symbols-Outlined text-primary">laptop_chromebook</span>
              <div>
                <p class="font-medium text-on-surface">Current Browser Session <span class="text-xs text-primary font-bold ml-2">(This Device)</span></p>
                <p class="text-xs text-on-surface-variant">Chrome on Windows • IP: 127.0.0.1 • Active Now</p>
              </div>
            </div>
            <span class="text-xs text-primary font-mono font-semibold">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

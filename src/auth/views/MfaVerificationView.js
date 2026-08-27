/**
 * MfaVerificationView
 * Accessible MFA / Two-Factor Authentication challenge modal view.
 */

export function renderMfaVerificationView(options = {}) {
  const {
    username = 'Operative',
    error = '',
    isRecoveryMode = false,
    onVerify = 'handleMfaVerify',
    onSwitchMode = 'handleToggleMfaMode'
  } = options;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="mfa-verification-modal">
      <div class="w-full max-w-md bg-surface-container-high border border-outline-variant/30 rounded-2xl p-6 shadow-2xl space-y-6">
        
        <!-- Header -->
        <div class="flex items-center gap-3 border-b border-outline-variant/20 pb-4">
          <div class="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <span class="material-symbols-outlined text-2xl">${isRecoveryMode ? 'key' : 'lock'}</span>
          </div>
          <div>
            <h2 class="text-base font-bold text-on-surface uppercase tracking-wider font-mono">
              ${isRecoveryMode ? 'Emergency Recovery Code' : 'Two-Factor Verification'}
            </h2>
            <p class="text-xs text-on-surface-variant">Operative identity: <span class="text-primary font-mono">${username}</span></p>
          </div>
        </div>

        <!-- Error Feedback -->
        ${error ? `
          <div class="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-xs flex items-center gap-2 animate-shake">
            <span class="material-symbols-outlined text-[16px]">error</span>
            <span>${error}</span>
          </div>
        ` : ''}

        <!-- Instructions -->
        <p class="text-xs text-on-surface-variant leading-relaxed">
          ${isRecoveryMode 
            ? 'Enter one of your 8-character single-use emergency backup recovery codes (e.g. ABCD-1234).'
            : 'Enter the 6-digit verification code from your authenticator app (Google Authenticator, Authy, etc.).'}
        </p>

        <!-- Input Form -->
        <form onsubmit="${onVerify}(event)" class="space-y-4">
          ${!isRecoveryMode ? `
            <div class="space-y-1.5">
              <label for="mfa-totp-input" class="text-[10px] uppercase font-mono tracking-wider text-on-surface-variant font-bold">
                6-Digit Security Token
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  id="mfa-totp-input" 
                  name="totpCode" 
                  maxlength="7" 
                  placeholder="000-000" 
                  autocomplete="one-time-code"
                  inputmode="numeric"
                  required
                  class="w-full text-center tracking-[0.3em] font-mono text-2xl font-bold px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-primary focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant/30"
                  autofocus
                />
              </div>
            </div>
          ` : `
            <div class="space-y-1.5">
              <label for="mfa-recovery-input" class="text-[10px] uppercase font-mono tracking-wider text-on-surface-variant font-bold">
                Backup Recovery Code
              </label>
              <input 
                type="text" 
                id="mfa-recovery-input" 
                name="recoveryCode" 
                placeholder="XXXX-XXXX" 
                required
                class="w-full uppercase text-center tracking-widest font-mono text-lg font-bold px-4 py-3 bg-surface-container-lowest border border-outline-variant/40 rounded-xl text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-outline-variant/30"
                autofocus
              />
            </div>
          `}

          <!-- Actions -->
          <div class="flex flex-col gap-2 pt-2">
            <button 
              type="submit" 
              class="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Verify & Authenticate</span>
            </button>

            <button 
              type="button" 
              onclick="${onSwitchMode}()"
              class="w-full py-2.5 px-4 bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-mono text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">${isRecoveryMode ? 'smartphone' : 'emergency'}</span>
              <span>${isRecoveryMode ? 'Use Authenticator App (TOTP)' : 'Lost device? Use Emergency Recovery Code'}</span>
            </button>
          </div>
        </form>

        <!-- Footer Notice -->
        <div class="border-t border-outline-variant/20 pt-3 flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[12px] text-primary">shield</span> End-to-End Cryptography
          </span>
          <a href="#hero" class="text-on-surface-variant hover:text-primary transition-colors">Cancel</a>
        </div>
      </div>
    </div>
  `;
}

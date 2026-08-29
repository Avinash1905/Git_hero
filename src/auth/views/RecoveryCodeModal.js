/**
 * RecoveryCodeModal
 * Modal view for displaying, printing, and downloading backup recovery codes.
 */

export function renderRecoveryCodeModal(codes = [], options = {}) {
  const {
    username = 'Operative',
    onClose = 'handleCloseRecoveryModal',
    onDownload = 'handleDownloadRecoveryCodes',
    onCopy = 'handleCopyRecoveryCodes'
  } = options;

  const codeGrid = codes.map((c, i) => `
    <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-mono text-xs text-primary font-bold text-center tracking-wider select-all flex items-center justify-between">
      <span class="text-[10px] text-on-surface-variant font-normal">#${(i + 1).toString().padStart(2, '0')}</span>
      <span>${c}</span>
    </div>
  `).join('');

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="recovery-code-display-modal">
      <div class="w-full max-w-lg bg-surface-container-high border border-outline-variant/30 rounded-2xl p-6 shadow-2xl space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-warning/10 border border-warning/30 text-warning">
              <span class="material-symbols-outlined text-2xl">key</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-on-surface uppercase tracking-wider font-mono">
                Emergency Backup Codes
              </h2>
              <p class="text-xs text-on-surface-variant">Account: <span class="text-primary font-mono">${username}</span></p>
            </div>
          </div>
          <button onclick="${onClose}()" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Warning Alert -->
        <div class="p-3.5 rounded-xl bg-warning/10 border border-warning/30 text-warning text-xs space-y-1">
          <div class="font-bold flex items-center gap-1.5 uppercase font-mono">
            <span class="material-symbols-outlined text-[16px]">warning</span>
            <span>Save these codes securely now</span>
          </div>
          <p class="text-on-surface-variant text-[11px] leading-relaxed">
            Each recovery code can only be used once. If you lose access to your authenticator app, these codes are the only way to recover your account.
          </p>
        </div>

        <!-- Codes 2-Column Grid -->
        <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-container-lowest/50 border border-outline-variant/20 max-h-60 overflow-y-auto">
          ${codeGrid}
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2 pt-2">
          <button 
            type="button" 
            onclick="${onCopy}()"
            class="flex-1 py-2.5 px-4 bg-surface-container hover:bg-surface-container-highest text-on-surface font-mono text-xs font-bold rounded-xl border border-outline-variant/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Copy All</span>
          </button>

          <button 
            type="button" 
            onclick="${onDownload}()"
            class="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">download</span>
            <span>Download .TXT</span>
          </button>
        </div>

        <!-- Checkbox confirmation & Close -->
        <div class="border-t border-outline-variant/20 pt-4 flex items-center justify-between">
          <label class="flex items-center gap-2 cursor-pointer select-none text-xs text-on-surface-variant">
            <input type="checkbox" id="recovery-saved-checkbox" class="w-4 h-4 rounded text-primary focus:ring-primary/30" />
            <span>I have safely saved these codes</span>
          </label>

          <button 
            type="button" 
            onclick="${onClose}()"
            class="px-4 py-2 bg-surface-container-highest hover:bg-outline-variant/30 text-on-surface font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  `;
}

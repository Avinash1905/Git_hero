/**
 * GitQuest Reusable UI Component: Modals, Dialogs, and Overlays
 */

export function renderShortcutsModal() {
  return `
    <div id="shortcuts-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel max-w-lg w-full rounded-2xl p-6 border border-outline-variant/40 shadow-2xl relative">
        <div class="flex justify-between items-center pb-3 border-b border-outline-variant/30 mb-4">
          <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">keyboard</span>
            Keyboard Navigation Map
          </h2>
          <button id="shortcuts-close-btn" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="space-y-3 text-xs font-terminal-code">
          <div class="flex justify-between items-center p-2 bg-surface-container rounded">
            <span class="text-on-surface">Movement</span>
            <span class="text-primary font-bold">W, A, S, D / Arrow Keys</span>
          </div>
          <div class="flex justify-between items-center p-2 bg-surface-container rounded">
            <span class="text-on-surface">Undo Last Move</span>
            <span class="text-primary font-bold">Ctrl + Z</span>
          </div>
          <div class="flex justify-between items-center p-2 bg-surface-container rounded">
            <span class="text-on-surface">Terminal Focus</span>
            <span class="text-primary font-bold">Enter / Click</span>
          </div>
          <div class="flex justify-between items-center p-2 bg-surface-container rounded">
            <span class="text-on-surface">Command History</span>
            <span class="text-primary font-bold">Up / Down Arrow in CLI</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderResetConfirmModal(onConfirmCallbackName = '') {
  return `
    <div id="reset-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel max-w-md w-full rounded-2xl p-6 border border-error/40 shadow-2xl relative">
        <div class="flex items-center gap-3 mb-4 text-error">
          <span class="material-symbols-outlined text-3xl">warning</span>
          <h3 class="text-headline-sm font-headline-sm font-bold text-on-surface">Reset Working Tree?</h3>
        </div>
        <p class="text-on-surface-variant text-sm mb-6">
          This action will restore the level to its initial staging state. All uncommitted box coordinates will be reverted.
        </p>
        <div class="flex justify-end gap-3">
          <button id="modal-cancel-reset-btn" class="px-4 py-2 text-xs font-terminal-label bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg">
            CANCEL
          </button>
          <button id="modal-confirm-reset-btn" class="px-4 py-2 text-xs font-terminal-label bg-error text-on-error rounded-lg font-bold">
            CONFIRM RESET
          </button>
        </div>
      </div>
    </div>
  `;
}

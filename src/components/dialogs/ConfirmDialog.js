/**
 * ConfirmDialog & ShortcutsModal
 * Modal dialogs for destructive action confirmations and keyboard shortcuts reference.
 */

export function renderConfirmDialog({
  id = 'confirm-dialog',
  title = 'Confirm Action',
  message = 'Are you sure you wish to proceed with this operation?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false
}) {
  return `
    <div id="${id}" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-outline-variant/40 shadow-2xl relative">
        <h3 class="text-headline-sm font-bold text-on-surface text-lg mb-2">${title}</h3>
        <p class="text-xs text-on-surface-variant font-terminal-code leading-relaxed mb-6">${message}</p>
        
        <div class="flex items-center justify-end gap-3 font-terminal-label text-xs font-bold">
          <button 
            id="${id}-cancel-btn"
            class="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface border border-outline-variant/30 transition-colors cursor-pointer"
          >
            ${cancelText}
          </button>
          <button 
            id="${id}-confirm-btn"
            class="px-4 py-2.5 rounded-lg ${isDanger ? 'bg-error hover:bg-error/90 text-on-error' : 'bg-primary hover:bg-primary/90 text-on-primary'} shadow-lg transition-colors cursor-pointer"
          >
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderShortcutsModal() {
  const shortcuts = [
    { section: 'Movement', keys: ['W', 'A', 'S', 'D'], desc: 'Move avatar Up, Left, Down, Right' },
    { section: 'Movement', keys: ['Arrow Keys'], desc: 'Alternative directional movement' },
    { section: 'Gameplay', keys: ['Ctrl', 'Z'], desc: 'Undo last movement step' },
    { section: 'Terminal', keys: ['Tab'], desc: 'Autocomplete Git commands' },
    { section: 'Terminal', keys: ['↑', '↓'], desc: 'Cycle through command history buffer' },
    { section: 'Terminal', keys: ['Ctrl', 'L'], desc: 'Clear active terminal output' },
    { section: 'Global', keys: ['Esc'], desc: 'Close open dialogs or exit full-screen' }
  ];

  const rows = shortcuts.map((s) => `
    <div class="flex items-center justify-between py-2 border-b border-surface-variant/30 font-terminal-code text-xs">
      <span class="text-on-surface-variant">${s.desc}</span>
      <div class="flex items-center gap-1">
        ${s.keys.map(k => `<kbd class="px-2 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface text-[11px] font-bold">${k}</kbd>`).join('+')}
      </div>
    </div>
  `).join('');

  return `
    <div id="shortcuts-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel w-full max-w-lg rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative max-h-[85vh] flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-headline-sm font-bold text-on-surface text-lg flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">keyboard</span>
              <span>Tactical Keybindings</span>
            </h3>
            <button id="shortcuts-close-btn" class="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div class="space-y-1 overflow-y-auto max-h-96 pr-2 scrollbar-thin">
            ${rows}
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-surface-variant/30 text-right">
          <button id="shortcuts-ack-btn" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-xs font-bold uppercase tracking-wider cursor-pointer">
            Understood
          </button>
        </div>
      </div>
    </div>
  `;
}

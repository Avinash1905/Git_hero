/**
 * TerminalHistorySearch
 * Reverse interactive search (Ctrl+R / Cmd+R) for terminal history buffer with fuzzy matching.
 */

export class TerminalHistorySearch {
  search(history = [], query = '') {
    if (!query) return history;
    const clean = query.toLowerCase().trim();
    return history.filter(h => (h.command || h).toLowerCase().includes(clean));
  }

  renderHtml(query = '', results = [], onSelect = 'handleSelectHistoryCommand', onClose = 'handleCloseHistorySearch') {
    const items = results.map(r => {
      const cmd = r.command || r;
      return `
        <div 
          onclick="${onSelect}('${cmd}')"
          class="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-primary/10 border border-outline-variant/20 hover:border-primary/40 font-mono text-xs text-primary flex items-center justify-between cursor-pointer transition-all"
        >
          <span>$ ${cmd}</span>
          <span class="material-symbols-outlined text-[14px] text-on-surface-variant">keyboard_return</span>
        </div>
      `;
    }).join('');

    return `
      <div class="p-3 bg-surface-container-high border border-outline-variant/30 rounded-xl space-y-2 font-mono">
        <div class="flex items-center justify-between text-xs text-primary font-bold">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">search</span>
            (reverse-i-search):
          </span>
          <button onclick="${onClose}()" class="text-on-surface-variant hover:text-on-surface">ESC</button>
        </div>
        <input 
          type="text" 
          id="history-search-input" 
          placeholder="Search history..." 
          class="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-xs text-on-surface focus:border-primary focus:outline-none"
          autofocus
        />
        <div class="space-y-1 max-h-36 overflow-y-auto">
          ${items.length > 0 ? items : '<div class="text-[10px] text-on-surface-variant p-2">No previous commands matching query.</div>'}
        </div>
      </div>
    `;
  }
}

export const terminalHistorySearch = new TerminalHistorySearch();

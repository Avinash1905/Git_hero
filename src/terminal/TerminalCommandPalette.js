/**
 * TerminalCommandPalette
 * Keyboard-driven fast command palette (Cmd+K / Ctrl+K) offering quick actions,
 * cheat-sheet command execution, and interactive Git helper shortcuts.
 */

export class TerminalCommandPalette {
  constructor() {
    this.commands = [
      { id: 'git_status', command: 'git status', desc: 'Inspect current staging area & operative coordinate', category: 'Inspection' },
      { id: 'git_commit', command: 'git commit -m "stage solution"', desc: 'Seal staged commits & verify sector victory', category: 'Actions' },
      { id: 'git_branch', command: 'git branch', desc: 'List active and remote branch refpointers', category: 'Branching' },
      { id: 'git_checkout', command: 'git checkout -b feature', desc: 'Create and switch to newly spawned branch', category: 'Branching' },
      { id: 'git_merge', command: 'git merge origin/master', desc: 'Integrate target branch commits into current HEAD', category: 'Merging' },
      { id: 'git_rebase', command: 'git rebase master', desc: 'Replay current branch commits onto target tip', category: 'Rebasing' },
      { id: 'git_stash', command: 'git stash', desc: 'Temporarily shelve dirty working directory state', category: 'Stashing' },
      { id: 'git_stash_pop', command: 'git stash pop', desc: 'Restore and remove topmost stashed snapshot', category: 'Stashing' },
      { id: 'git_reset', command: 'git reset --hard HEAD', desc: 'Discard uncommitted sector movements and restart turn', category: 'Recovery' },
      { id: 'git_reflog', command: 'git reflog', desc: 'Browse complete reference transaction log', category: 'Plumbing' },
      { id: 'git_diff', command: 'git diff', desc: 'Inspect unstaged changes vs staged repository state', category: 'Inspection' },
      { id: 'clear', command: 'clear', desc: 'Clear the terminal output buffer', category: 'Terminal' }
    ];
  }

  /**
   * Filter commands by query string
   */
  filterCommands(query = '') {
    if (!query) return this.commands;
    const clean = query.toLowerCase().trim();
    return this.commands.filter(c => 
      c.command.toLowerCase().includes(clean) || 
      c.desc.toLowerCase().includes(clean) ||
      c.category.toLowerCase().includes(clean)
    );
  }

  /**
   * Render HTML command palette modal
   */
  renderHtml(query = '', onExecute = 'handleExecutePaletteCommand', onClose = 'handleCloseCommandPalette') {
    const results = this.filterCommands(query);

    const items = results.map(c => `
      <div 
        onclick="${onExecute}('${c.command}')"
        class="p-3 rounded-xl border border-outline-variant/20 hover:border-primary/50 bg-surface-container-lowest hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-between group"
      >
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-primary">${c.command}</span>
            <span class="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant">
              ${c.category}
            </span>
          </div>
          <p class="text-[11px] text-on-surface-variant">${c.desc}</p>
        </div>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
          keyboard_return
        </span>
      </div>
    `).join('');

    return `
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs animate-fade-in" id="terminal-command-palette">
        <div class="w-full max-w-xl bg-surface-container-high border border-outline-variant/40 rounded-2xl p-4 shadow-2xl space-y-3 animate-slide-down">
          
          <!-- Search Box -->
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3.5 text-primary text-[20px]">search</span>
            <input 
              type="text" 
              id="palette-search-input" 
              placeholder="Type a Git command or keyword (e.g. status, merge, rebase)..." 
              class="w-full pl-11 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-mono text-xs focus:border-primary focus:outline-none placeholder:text-on-surface-variant/40"
              autofocus
            />
            <button onclick="${onClose}()" class="absolute right-3 p-1 rounded hover:bg-surface-container text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <!-- Command List -->
          <div class="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            ${items.length > 0 ? items : `
              <div class="p-6 text-center text-xs text-on-surface-variant font-mono">
                No matching Git commands found for "${query}".
              </div>
            `}
          </div>

          <!-- Footer Shortcut Hints -->
          <div class="border-t border-outline-variant/20 pt-2 flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
            <span>Press <kbd class="px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/30">ESC</kbd> to exit</span>
            <span>Click or press <kbd class="px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant/30">Enter</kbd> to execute command</span>
          </div>

        </div>
      </div>
    `;
  }
}

export const terminalCommandPalette = new TerminalCommandPalette();

/**
 * StashCabinet
 * Manages the LIFO stash stack for uncommitted modifications.
 */

export class StashCabinet {
  constructor() {
    this.stashes = [
      {
        id: 'stash@{0}',
        branch: 'main',
        message: 'WIP on sector 42: laser puzzle draft',
        timestamp: '10 minutes ago',
        filesChanged: 3
      },
      {
        id: 'stash@{1}',
        branch: 'feature/teleporter',
        message: 'WIP: alternative portal routes',
        timestamp: '2 hours ago',
        filesChanged: 1
      }
    ];
  }

  pushStash(message, branch = 'main') {
    const newStash = {
      id: `stash@{0}`,
      branch,
      message: message || `WIP on ${branch}`,
      timestamp: 'Just now',
      filesChanged: 2
    };

    // Shift previous stashes
    this.stashes.forEach((s, idx) => {
      s.id = `stash@{${idx + 1}}`;
    });

    this.stashes.unshift(newStash);
    return newStash;
  }

  popStash() {
    if (this.stashes.length === 0) return null;
    const popped = this.stashes.shift();

    // Re-index remaining
    this.stashes.forEach((s, idx) => {
      s.id = `stash@{${idx}}`;
    });

    return popped;
  }

  dropStash(id) {
    const idx = this.stashes.findIndex(s => s.id === id);
    if (idx === -1) return false;

    this.stashes.splice(idx, 1);
    this.stashes.forEach((s, i) => {
      s.id = `stash@{${i}}`;
    });
    return true;
  }

  renderHtml() {
    if (this.stashes.length === 0) {
      return `
        <div class="p-8 text-center text-xs text-on-surface-variant font-terminal-code">
          Stash stack is currently empty.
        </div>
      `;
    }

    const rows = this.stashes.map((s) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4 font-terminal-code text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-terminal-label font-bold uppercase">
              ${s.id}
            </span>
            <span class="font-bold text-on-surface">${s.message}</span>
          </div>
          <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
            <span>Branch: <strong class="text-secondary">${s.branch}</strong></span>
            <span>Created: ${s.timestamp}</span>
            <span>${s.filesChanged} files</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button data-apply-stash="${s.id}" class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary font-terminal-label text-[11px] font-bold uppercase transition-colors cursor-pointer">
            Apply
          </button>
          <button data-drop-stash="${s.id}" class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface hover:text-error font-terminal-label text-[11px] uppercase transition-colors cursor-pointer">
            Drop
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${rows}
      </div>
    `;
  }
}

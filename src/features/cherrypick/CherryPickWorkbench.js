/**
 * CherryPickWorkbench
 * Cross-branch commit cherry-pick matrix.
 */

export class CherryPickWorkbench {
  constructor() {
    this.currentBranch = 'main';
    this.branches = [
      {
        name: 'feature/laser-switches',
        commits: [
          { hash: 'cp-81', message: 'feat: add laser beam emitter', author: 'operative', picked: false },
          { hash: 'cp-82', message: 'fix: align laser reflection prism', author: 'operative', picked: true }
        ]
      },
      {
        name: 'bugfix/door-key-timeout',
        commits: [
          { hash: 'cp-91', message: 'fix: prevent door state desync', author: 'operative', picked: false }
        ]
      }
    ];
    this.stagedPicks = [];
  }

  togglePick(commitHash) {
    for (const b of this.branches) {
      for (const c of b.commits) {
        if (c.hash === commitHash) {
          c.picked = !c.picked;
          if (c.picked) {
            this.stagedPicks.push(c);
          } else {
            this.stagedPicks = this.stagedPicks.filter(p => p.hash !== commitHash);
          }
          return true;
        }
      }
    }
    return false;
  }

  renderHtml() {
    const branchCards = this.branches.map((b) => {
      const commitItems = b.commits.map((c) => `
        <div class="glass-panel p-3 rounded-lg border ${c.picked ? 'border-primary bg-primary/10' : 'border-outline-variant/30'} flex items-center justify-between gap-3 text-xs font-terminal-code">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="text-primary font-bold font-mono text-[11px]">${c.hash}</span>
            <span class="truncate text-on-surface">${c.message}</span>
          </div>

          <button 
            data-cherry-pick="${c.hash}" 
            class="px-2.5 py-1 rounded text-[10px] font-terminal-label uppercase transition-colors cursor-pointer ${c.picked ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'}"
          >
            ${c.picked ? 'STAGED' : 'PICK'}
          </button>
        </div>
      `).join('');

      return `
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold font-terminal-code text-secondary">
            <span class="material-symbols-outlined text-[16px]">fork_right</span>
            <span>${b.name}</span>
          </div>
          <div class="space-y-2">
            ${commitItems}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-2xl font-terminal-code">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-variant/30 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-terminal-label uppercase font-bold border border-tertiary/30">
                GIT CHERRY-PICK
              </span>
              <span class="text-xs text-on-surface font-bold">Target: ${this.currentBranch}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">Select specific commits from feature branches to apply onto main</p>
          </div>

          <button 
            id="btn-execute-picks" 
            ${this.stagedPicks.length > 0 ? '' : 'disabled'}
            class="px-5 py-2.5 rounded-xl ${this.stagedPicks.length > 0 ? 'bg-tertiary hover:bg-tertiary/90 text-on-tertiary cursor-pointer' : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'} font-terminal-label text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[16px]">download</span>
            <span>Apply Selected (${this.stagedPicks.length})</span>
          </button>
        </div>

        <div class="space-y-4">
          ${branchCards}
        </div>
      </div>
    `;
  }
}

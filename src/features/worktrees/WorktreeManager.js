/**
 * WorktreeManager
 * Manages linked working trees sharing a central .git object database.
 */

export class WorktreeManager {
  constructor() {
    this.worktrees = [
      {
        path: '/d/Projects/Git/Git_hero',
        branch: 'main',
        head: 'wt-0101',
        isMain: true,
        locked: false
      },
      {
        path: '/d/Projects/Git/Git_hero-hotfix',
        branch: 'hotfix/patch-250',
        head: 'wt-0202',
        isMain: false,
        locked: false
      }
    ];
  }

  addWorktree(path, branch) {
    const existing = this.worktrees.find(w => w.path === path || w.branch === branch);
    if (existing) {
      return { success: false, reason: 'Worktree path or branch already assigned' };
    }

    const wt = {
      path,
      branch,
      head: `wt-${Math.random().toString(36).substr(2, 6)}`,
      isMain: false,
      locked: false
    };
    this.worktrees.push(wt);
    return { success: true, worktree: wt };
  }

  removeWorktree(path) {
    const wt = this.worktrees.find(w => w.path === path);
    if (!wt) return false;
    if (wt.isMain) return false; // cannot delete main root worktree

    this.worktrees = this.worktrees.filter(w => w.path !== path);
    return true;
  }

  renderHtml() {
    const rows = this.worktrees.map((w) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4 font-terminal-code text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-primary">alt_route</span>
            <span class="font-bold text-on-surface">${w.path}</span>
            ${w.isMain ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-terminal-label uppercase">PRIMARY ROOT</span>` : ''}
          </div>
          <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
            <span>Branch: <strong class="text-secondary">${w.branch}</strong></span>
            <span>HEAD: <strong class="text-primary">${w.head}</strong></span>
          </div>
        </div>

        <div>
          ${!w.isMain ? `
            <button data-remove-wt="${w.path}" class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface hover:text-error font-terminal-label text-[11px] uppercase transition-colors cursor-pointer">
              Prune
            </button>
          ` : ''}
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

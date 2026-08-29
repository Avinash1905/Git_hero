/**
 * WorktreeInspector
 * Manages linked worktree directories, branch lock statuses, and isolation contexts.
 */

export class WorktreeInspector {
  constructor() {
    this.worktrees = [
      { path: '/workspace/main', branch: 'master', headSha: 'dac1658', isMain: true, isLocked: false },
      { path: '/workspace/hotfix-laser', branch: 'hotfix/laser-gate', headSha: 'a909ac5', isMain: false, isLocked: false },
      { path: '/workspace/feature-rebase', branch: 'feature/rebase-engine', headSha: '7d385cc', isMain: false, isLocked: true, lockReason: 'Active build session' }
    ];
  }

  addWorktree(path, branch) {
    if (this.worktrees.some(w => w.path === path || w.branch === branch)) {
      return { success: false, reason: 'Worktree path or branch already assigned' };
    }
    const newWt = {
      path,
      branch,
      headSha: Math.random().toString(16).substring(2, 9),
      isMain: false,
      isLocked: false
    };
    this.worktrees.push(newWt);
    return { success: true, worktree: newWt };
  }

  toggleLock(path, reason = 'Locked by user') {
    const wt = this.worktrees.find(w => w.path === path);
    if (!wt || wt.isMain) return false;
    wt.isLocked = !wt.isLocked;
    wt.lockReason = wt.isLocked ? reason : '';
    return true;
  }

  renderHtml(options = {}) {
    const { onToggleLock = 'handleToggleWorktreeLock' } = options;

    const cards = this.worktrees.map(w => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-lime-500/40 transition-all flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-lime-950/40 text-lime-400 border border-lime-500/20">
            <span class="material-symbols-outlined text-[18px]">workspaces</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-lime-400">${w.branch}</span>
              ${w.isMain ? '<span class="text-[9px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">PRIMARY</span>' : ''}
              ${w.isLocked ? '<span class="text-[9px] bg-warning/20 text-warning px-1.5 py-0.2 rounded font-bold">LOCKED</span>' : ''}
            </div>
            <div class="text-[10px] text-on-surface-variant">${w.path} (${w.headSha})</div>
          </div>
        </div>

        ${!w.isMain ? `
          <button 
            type="button" 
            onclick="${onToggleLock}('${w.path}')"
            class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg border border-outline-variant/20 text-[10px] uppercase font-bold transition-all cursor-pointer"
          >
            ${w.isLocked ? 'Unlock' : 'Lock'}
          </button>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-lime-400">workspaces</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Linked Worktrees (git worktree)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.worktrees.length} Working Trees</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const worktreeInspector = new WorktreeInspector();

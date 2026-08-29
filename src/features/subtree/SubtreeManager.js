/**
 * SubtreeManager
 * Manages Git subtree embeddings, prefix directory synchronization,
 * and splitting component histories into separate upstream repositories.
 */

export class SubtreeManager {
  constructor() {
    this.subtrees = [
      {
        prefix: 'src/adapters',
        repository: 'https://github.com/gitquest/adapters-core.git',
        branch: 'main',
        commit: 'st-1092',
        squashed: true
      },
      {
        prefix: 'lib/terminal-renderer',
        repository: 'https://github.com/gitquest/terminal-renderer.git',
        branch: 'v1.4',
        commit: 'st-3041',
        squashed: false
      }
    ];
  }

  addSubtree(prefix, repository, branch = 'main', squashed = true) {
    const existing = this.subtrees.find(s => s.prefix === prefix);
    if (existing) return { success: false, reason: `Subtree at prefix '${prefix}' already exists` };

    const st = {
      prefix,
      repository,
      branch,
      commit: `st-${Math.random().toString(36).substr(2, 6)}`,
      squashed
    };
    this.subtrees.push(st);
    return { success: true, subtree: st };
  }

  splitSubtree(prefix, newBranchName) {
    const target = this.subtrees.find(s => s.prefix === prefix);
    if (!target) return { success: false, reason: 'Prefix not found' };

    return {
      success: true,
      branch: newBranchName,
      syntheticCommit: `split-${Math.random().toString(36).substr(2, 6)}`,
      message: `Extracted ${prefix} history into branch ${newBranchName}`
    };
  }

  renderHtml() {
    const rows = this.subtrees.map((s) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">account_tree</span>
            <span class="font-bold text-on-surface font-mono">${s.prefix}</span>
            ${s.squashed ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold font-terminal-label uppercase">SQUASHED</span>` : ''}
          </div>
          <span class="text-[10px] text-on-surface-variant font-mono">${s.commit}</span>
        </div>

        <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
          <span>Remote: <strong class="text-on-surface">${s.repository}</strong></span>
          <span>Tracking: <strong class="text-secondary">${s.branch}</strong></span>
        </div>

        <div class="pt-1 flex items-center gap-2">
          <button data-pull-subtree="${s.prefix}" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-terminal-label text-[10px] uppercase transition-colors cursor-pointer">
            git subtree pull
          </button>
          <button data-split-subtree="${s.prefix}" class="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-secondary font-terminal-label text-[10px] uppercase transition-colors cursor-pointer">
            git subtree split
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4 font-terminal-code text-xs">
        ${rows}
      </div>
    `;
  }
}

/**
 * SubtreeWorkflowEngine
 * Visual subtree prefix splitter and remote sync manager (git subtree add, git subtree split, git subtree push).
 */

export class SubtreeWorkflowEngine {
  constructor() {
    this.subtrees = [
      { prefix: 'packages/level-builder', repository: 'https://github.com/githero/level-builder.git', branch: 'main', status: 'merged' },
      { prefix: 'packages/puzzle-engine', repository: 'https://github.com/githero/puzzle-core.git', branch: 'v1.4', status: 'synced' }
    ];
  }

  addSubtree(prefix, repository, branch = 'main') {
    const st = { prefix, repository, branch, status: 'synced' };
    this.subtrees.push(st);
    return st;
  }

  renderHtml() {
    const cards = this.subtrees.map(s => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-violet-950/40 text-violet-400 border border-violet-500/20">
            <span class="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <div>
            <div class="font-bold text-violet-400">${s.prefix}</div>
            <div class="text-[10px] text-on-surface-variant">${s.repository} (${s.branch})</div>
          </div>
        </div>
        <span class="text-[10px] uppercase font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded">
          ${s.status}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-violet-400">lan</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Git Subtree Workflows</span>
          </div>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const subtreeWorkflowEngine = new SubtreeWorkflowEngine();

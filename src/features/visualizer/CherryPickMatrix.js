/**
 * CherryPickMatrix
 * Visual multi-branch commit picker with conflict risk estimator
 * and sequential staging queue for git cherry-pick execution.
 */

export class CherryPickMatrix {
  constructor() {
    this.selectedCommits = [];
  }

  /**
   * Toggle commit selection for cherry-pick queue
   */
  toggleSelection(commit) {
    const index = this.selectedCommits.findIndex(c => c.sha === commit.sha);
    if (index !== -1) {
      this.selectedCommits.splice(index, 1);
    } else {
      this.selectedCommits.push(commit);
    }
    return [...this.selectedCommits];
  }

  /**
   * Estimate conflict risk between source commit and target branch
   */
  estimateConflictRisk(commit = {}, targetBranch = 'master') {
    if (commit.branch === targetBranch) return 'Low (Same Branch)';
    if (commit.filesChanged && commit.filesChanged > 4) return 'High (Multiple Modified Blobs)';
    return 'Moderate (Standard Cherry-Pick)';
  }

  /**
   * Render HTML matrix component
   */
  renderHtml(allBranchCommits = [], targetBranch = 'master', options = {}) {
    const { onToggleCommit = 'handleToggleCherryPick', onExecute = 'handleExecuteCherryPick' } = options;

    const cards = allBranchCommits.map(c => {
      const isSelected = this.selectedCommits.some(sel => sel.sha === c.sha);
      const risk = this.estimateConflictRisk(c, targetBranch);
      const riskCls = risk.startsWith('Low') ? 'text-emerald-400 bg-emerald-950/40' : risk.startsWith('High') ? 'text-error bg-error/10' : 'text-amber-400 bg-amber-950/40';

      return `
        <div 
          onclick="${onToggleCommit}('${c.sha}')"
          class="p-3.5 rounded-xl border ${isSelected ? 'border-rose-500/60 bg-rose-950/20 ring-1 ring-rose-500/30' : 'border-outline-variant/20 bg-surface-container-lowest hover:border-rose-500/30'} flex items-center justify-between gap-4 font-mono text-xs cursor-pointer transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-md border ${isSelected ? 'bg-rose-500 border-rose-400 text-black flex items-center justify-center' : 'border-outline-variant/40 bg-surface-container'}">
              ${isSelected ? '<span class="material-symbols-outlined text-[14px] font-bold">check</span>' : ''}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-rose-400 font-bold">${c.sha.substring(0, 7)}</span>
                <span class="text-on-surface">${c.message}</span>
              </div>
              <div class="text-[10px] text-on-surface-variant">Source: <strong class="text-on-surface">${c.branch}</strong></div>
            </div>
          </div>

          <span class="text-[10px] px-2 py-0.5 rounded-full border border-white/10 font-bold ${riskCls}">
            ${risk}
          </span>
        </div>
      `;
    }).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-rose-400">content_cut</span>
            <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Cherry-Pick Multi-Branch Matrix</h3>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">Target Branch: <strong class="text-primary">${targetBranch}</strong></span>
        </div>

        <div class="space-y-2">
          ${cards}
        </div>

        <div class="pt-2 border-t border-outline-variant/10 flex items-center justify-between">
          <span class="text-xs font-mono text-on-surface-variant">${this.selectedCommits.length} Commits in Pick Queue</span>
          <button 
            type="button" 
            onclick="${onExecute}()"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer ${this.selectedCommits.length === 0 ? 'opacity-50 pointer-events-none' : ''}"
          >
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
            <span>Apply Cherry-Picks</span>
          </button>
        </div>
      </div>
    `;
  }
}

export const cherryPickMatrix = new CherryPickMatrix();

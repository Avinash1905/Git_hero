/**
 * RebaseInteractivePlanner
 * Visual rebase instruction editor enabling operatives to reorder, squash,
 * fixup, reword, and drop commits interactively before executing git rebase.
 */

export class RebaseInteractivePlanner {
  constructor() {
    this.actions = ['pick', 'reword', 'edit', 'squash', 'fixup', 'drop'];
    this.actionColors = {
      pick: 'text-primary bg-primary/10 border-primary/20',
      reword: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/20',
      edit: 'text-amber-400 bg-amber-950/40 border-amber-500/20',
      squash: 'text-purple-400 bg-purple-950/40 border-purple-500/20',
      fixup: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/20',
      drop: 'text-error bg-error/10 border-error/20'
    };
  }

  /**
   * Reorder commit in rebase list
   */
  moveCommit(list = [], fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
      return list;
    }
    const updated = [...list];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    return updated;
  }

  /**
   * Change action for a commit
   */
  setAction(list = [], index, action) {
    if (!this.actions.includes(action) || index < 0 || index >= list.length) {
      return list;
    }
    const updated = [...list];
    updated[index] = { ...updated[index], action };
    return updated;
  }

  /**
   * Compile resulting linear history after squashes and drops
   */
  compileLinearHistory(planList = []) {
    const result = [];
    let currentCombined = null;

    planList.forEach(item => {
      if (item.action === 'drop') return;

      if (item.action === 'squash' || item.action === 'fixup') {
        if (currentCombined) {
          currentCombined.squashedShas.push(item.sha);
          if (item.action === 'squash') {
            currentCombined.message += `\n* ${item.message}`;
          }
        } else {
          // Fallback if first item is squash
          currentCombined = {
            sha: item.sha,
            message: item.message,
            squashedShas: [item.sha]
          };
          result.push(currentCombined);
        }
      } else {
        currentCombined = {
          sha: item.sha,
          message: item.message,
          squashedShas: [item.sha]
        };
        result.push(currentCombined);
      }
    });

    return result;
  }

  /**
   * Render HTML rebase planner table
   */
  renderHtml(planList = [], options = {}) {
    const { onActionChange = 'handleRebaseActionChange', onMove = 'handleRebaseMove', onExecute = 'handleExecuteRebase' } = options;

    const rows = planList.map((item, index) => {
      const actionCls = this.actionColors[item.action] || 'text-on-surface';

      const actionOptions = this.actions.map(act => `
        <option value="${act}" ${act === item.action ? 'selected' : ''}>${act.toUpperCase()}</option>
      `).join('');

      return `
        <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between gap-3 font-mono text-xs">
          <!-- Reorder buttons -->
          <div class="flex flex-col gap-0.5">
            <button onclick="${onMove}(${index}, ${index - 1})" class="p-0.5 rounded hover:bg-surface-container text-on-surface-variant ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">
              <span class="material-symbols-outlined text-[14px]">expand_less</span>
            </button>
            <button onclick="${onMove}(${index}, ${index + 1})" class="p-0.5 rounded hover:bg-surface-container text-on-surface-variant ${index === planList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}">
              <span class="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>

          <!-- Action Dropdown -->
          <select 
            onchange="${onActionChange}(${index}, this.value)"
            class="px-2.5 py-1 rounded-lg border font-bold uppercase text-[10px] ${actionCls} focus:outline-none cursor-pointer bg-surface-container-high"
          >
            ${actionOptions}
          </select>

          <!-- Commit SHA & Message -->
          <div class="flex-1 space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-primary font-bold">${item.sha.substring(0, 7)}</span>
              <span class="text-on-surface">${item.message}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">linear_scale</span>
            <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Interactive Rebase Planner (git rebase -i)</h3>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${planList.length} Commits Staged</span>
        </div>

        <div class="space-y-2">
          ${rows}
        </div>

        <div class="pt-2 border-t border-outline-variant/10 flex justify-end">
          <button 
            type="button" 
            onclick="${onExecute}()"
            class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
            <span>Execute Rebase & Linearize</span>
          </button>
        </div>
      </div>
    `;
  }
}

export const rebaseInteractivePlanner = new RebaseInteractivePlanner();

/**
 * StashShelfVisualizer
 * Visual cabinet representing the Git stash LIFO stack (stash@{0}, stash@{1})
 * with staged diff previews, pop/apply triggers, and drop buttons.
 */

export class StashShelfVisualizer {
  /**
   * Render HTML stash cabinet
   */
  renderHtml(stashList = [], options = {}) {
    const { onPop = 'handlePopStash', onApply = 'handleApplyStash', onDrop = 'handleDropStash' } = options;

    if (!stashList || stashList.length === 0) {
      return `
        <div class="p-6 text-center text-xs font-mono text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-2">
          <span class="material-symbols-outlined text-3xl text-on-surface-variant/40">inventory_2</span>
          <div>Stash shelf is empty. Use <code class="text-primary font-bold">git stash</code> to temporarily shelve dirty turn state.</div>
        </div>
      `;
    }

    const items = stashList.map((item, index) => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-teal-500/40 transition-all flex items-center justify-between gap-4 font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-teal-950/40 text-teal-400 border border-teal-500/20">
            <span class="material-symbols-outlined text-[18px]">archive</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-teal-400">stash@{${index}}</span>
              <span class="text-on-surface">${item.message || 'WIP on branch'}</span>
            </div>
            <div class="text-[10px] text-on-surface-variant">Created on branch: <strong class="text-on-surface">${item.branch || 'master'}</strong></div>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button 
            type="button" 
            onclick="${onApply}(${index})"
            class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg border border-outline-variant/20 text-[10px] uppercase font-bold transition-all cursor-pointer"
          >
            Apply
          </button>
          <button 
            type="button" 
            onclick="${onPop}(${index})"
            class="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded-lg border border-teal-500/30 text-[10px] uppercase font-bold transition-all cursor-pointer"
          >
            Pop
          </button>
          <button 
            type="button" 
            onclick="${onDrop}(${index})"
            class="p-1 text-on-surface-variant hover:text-error rounded-lg transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-teal-400">shelves</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Git Stash Shelf (LIFO Stack)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${stashList.length} Stashed Entries</span>
        </div>
        <div class="space-y-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const stashShelfVisualizer = new StashShelfVisualizer();

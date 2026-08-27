/**
 * CommitHistoryGraph
 * Scrollable commit history timeline with branch pills, author avatar tags,
 * commit SHAs, and interactive commit inspection modals.
 */

export class CommitHistoryGraph {
  /**
   * Render commit history timeline
   */
  renderHtml(commits = [], onInspect = 'handleInspectCommit') {
    if (!commits || commits.length === 0) {
      return `
        <div class="p-8 text-center text-xs font-mono text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">
          No commit records logged in this sector yet.
        </div>
      `;
    }

    const items = commits.map((c, index) => {
      const shaShort = (c.sha || 'a1b2c3d').substring(0, 7);
      const isLatest = index === 0;

      return `
        <div class="relative pl-6 pb-6 group cursor-pointer" onclick="${onInspect}('${c.sha}')">
          <!-- Timeline Vertical Spine -->
          ${index < commits.length - 1 ? `
            <div class="absolute left-2.5 top-3 bottom-0 w-0.5 bg-outline-variant/30 group-hover:bg-primary/50 transition-colors"></div>
          ` : ''}

          <!-- Timeline Dot -->
          <div class="absolute left-1 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${isLatest ? 'bg-primary border-white' : 'bg-surface-container-high border-primary'} group-hover:scale-125 transition-transform"></div>

          <!-- Card Content -->
          <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 transition-all space-y-1.5 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-primary">${shaShort}</span>
                <span class="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[9px] text-on-surface-variant font-bold uppercase border border-outline-variant/20">
                  ${c.branch || 'master'}
                </span>
                ${isLatest ? '<span class="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[8px] font-bold font-mono">HEAD</span>' : ''}
              </div>
              <span class="text-[10px] text-on-surface-variant font-mono">${c.timestamp ? new Date(c.timestamp).toLocaleTimeString() : 'Just now'}</span>
            </div>
            <p class="font-mono text-xs text-on-surface">${c.message || 'Updated puzzle stage'}</p>
            <div class="text-[10px] text-on-surface-variant flex items-center gap-1.5">
              <span>Author: <strong class="text-on-surface">${c.author || 'Operative'}</strong></span>
              ${c.changesCount ? `<span>• ${c.changesCount} files staged</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">history</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Commit Log Timeline</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${commits.length} Total Commits</span>
        </div>
        <div class="pt-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const commitHistoryGraph = new CommitHistoryGraph();

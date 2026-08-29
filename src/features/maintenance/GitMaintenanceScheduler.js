/**
 * GitMaintenanceScheduler
 * Automated repository maintenance scheduler (git gc, git pack-refs, commit-graph optimization).
 */

export class GitMaintenanceScheduler {
  constructor() {
    this.tasks = [
      { id: 'gc', name: 'Garbage Collection (git gc --prune)', status: 'ready', lastRun: '2 hours ago' },
      { id: 'pack_refs', name: 'Pack Loose References (git pack-refs)', status: 'ready', lastRun: '1 day ago' },
      { id: 'commit_graph', name: 'Write Commit Graph', status: 'ready', lastRun: '3 days ago' }
    ];
  }

  runTask(taskId) {
    const t = this.tasks.find(x => x.id === taskId);
    if (!t) return false;
    t.status = 'running';
    setTimeout(() => {
      t.status = 'completed';
      t.lastRun = 'Just now';
    }, 500);
    return true;
  }

  renderHtml(options = {}) {
    const { onRun = 'handleRunMaintenance' } = options;

    const cards = this.tasks.map(t => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-surface-container text-primary border border-outline-variant/20">
            <span class="material-symbols-outlined text-[18px]">build</span>
          </div>
          <div>
            <div class="font-bold text-on-surface">${t.name}</div>
            <div class="text-[10px] text-on-surface-variant">Last executed: ${t.lastRun}</div>
          </div>
        </div>

        <button 
          type="button" 
          onclick="${onRun}('${t.id}')"
          class="px-2.5 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-[10px] font-bold uppercase cursor-pointer"
        >
          Execute
        </button>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">engineering</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Repository Maintenance (git maintenance)</span>
          </div>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const gitMaintenanceScheduler = new GitMaintenanceScheduler();

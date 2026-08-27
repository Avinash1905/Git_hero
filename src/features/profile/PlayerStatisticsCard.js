/**
 * PlayerStatisticsCard
 * Displays comprehensive stats: commits created, branches spawned, merges performed,
 * rebases executed, total stars, average time per sector, and total solved count.
 */

export class PlayerStatisticsCard {
  renderHtml(stats = {}) {
    const metrics = [
      { label: 'Sectors Solved', val: `${stats.completedCount || 0} / 250`, icon: 'task_alt', color: 'text-primary' },
      { label: 'Stars Earned', val: `${stats.starsCount || 0} ★`, icon: 'star', color: 'text-amber-400' },
      { label: 'Total Commits', val: stats.totalCommits || 0, icon: 'commit', color: 'text-cyan-400' },
      { label: 'Branches Spawned', val: stats.branchesSpawned || 0, icon: 'alt_route', color: 'text-purple-400' },
      { label: 'Merges Performed', val: stats.mergesPerformed || 0, icon: 'call_merge', color: 'text-emerald-400' },
      { label: 'Rebases Linearized', val: stats.rebasesExecuted || 0, icon: 'linear_scale', color: 'text-rose-400' }
    ];

    const cards = metrics.map(m => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-2.5">
          <span class="material-symbols-outlined text-[20px] ${m.color}">${m.icon}</span>
          <span class="text-on-surface-variant">${m.label}</span>
        </div>
        <span class="font-bold text-on-surface text-sm">${m.val}</span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">analytics</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Operative Combat Analytics</span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const playerStatisticsCard = new PlayerStatisticsCard();

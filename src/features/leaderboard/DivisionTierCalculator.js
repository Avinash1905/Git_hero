/**
 * DivisionTierCalculator
 * ELO rating and competitive division rank calculator (Recruit -> Contributor -> Maintainer -> Linus Master).
 */

export class DivisionTierCalculator {
  constructor() {
    this.divisions = [
      { id: 'recruit', name: 'Recruit', minXp: 0, icon: 'shield', color: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' },
      { id: 'contributor', name: 'Contributor', minXp: 1000, icon: 'code', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
      { id: 'maintainer', name: 'Maintainer', minXp: 3000, icon: 'verified', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
      { id: 'core_dev', name: 'Core Committer', minXp: 7500, icon: 'star', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
      { id: 'grandmaster', name: 'Git Grandmaster', minXp: 15000, icon: 'diamond', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
      { id: 'linus_master', name: 'Kernel Sovereign', minXp: 30000, icon: 'trophy', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' }
    ];
  }

  /**
   * Determine player division tier based on XP
   */
  getDivision(xp = 0) {
    let currentDiv = this.divisions[0];
    let nextDiv = this.divisions[1];

    for (let i = 0; i < this.divisions.length; i++) {
      if (xp >= this.divisions[i].minXp) {
        currentDiv = this.divisions[i];
        nextDiv = this.divisions[i + 1] || null;
      } else {
        break;
      }
    }

    let progressToNext = 100;
    if (nextDiv) {
      const range = nextDiv.minXp - currentDiv.minXp;
      const progress = xp - currentDiv.minXp;
      progressToNext = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    }

    return {
      current: currentDiv,
      next: nextDiv,
      progressToNext,
      xpNeeded: nextDiv ? nextDiv.minXp - xp : 0
    };
  }

  /**
   * Render HTML division badge card
   */
  renderHtml(xp = 0) {
    const divInfo = this.getDivision(xp);
    const { current, next, progressToNext, xpNeeded } = divInfo;

    return `
      <div class="p-4 rounded-2xl border ${current.border} ${current.bg} space-y-3 shadow-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-black/40 border border-white/10 ${current.color}">
              <span class="material-symbols-outlined text-2xl">${current.icon}</span>
            </div>
            <div>
              <div class="text-[10px] uppercase font-mono tracking-wider font-bold text-on-surface-variant">Competitive Division</div>
              <div class="text-sm font-bold font-mono text-on-surface">${current.name}</div>
            </div>
          </div>
          <span class="text-xs font-mono font-bold ${current.color}">${xp.toLocaleString()} XP</span>
        </div>

        ${next ? `
          <div class="space-y-1.5">
            <div class="flex justify-between text-[10px] font-mono text-on-surface-variant">
              <span>Progress to ${next.name}</span>
              <span>${progressToNext}% (${xpNeeded.toLocaleString()} XP needed)</span>
            </div>
            <div class="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div class="h-full bg-primary rounded-full transition-all" style="width: ${progressToNext}%"></div>
            </div>
          </div>
        ` : `
          <div class="text-[10px] font-mono text-primary font-bold text-center">
            Pinnacle Division Reached — Top Operative Tier
          </div>
        `}
      </div>
    `;
  }
}

export const divisionTierCalculator = new DivisionTierCalculator();

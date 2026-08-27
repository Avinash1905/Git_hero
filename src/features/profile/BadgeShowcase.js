/**
 * BadgeShowcase
 * Manages player profile showcase badges (pin up to 3 showcase badges)
 * and renders high-fidelity interactive badge slots.
 */

export class BadgeShowcase {
  constructor() {
    this.maxPinned = 3;
    this.defaultBadges = [
      { id: 'first_commit', name: 'First Commit', icon: 'flag', tier: 'bronze', desc: 'Solved Level 01', rarity: 'Common' },
      { id: 'branch_hero', name: 'Branch Navigator', icon: 'alt_route', tier: 'silver', desc: 'Mastered World 02', rarity: 'Rare' },
      { id: 'speed_demon', name: 'Speed Demon', icon: 'bolt', tier: 'gold', desc: 'Solved in < 30 seconds', rarity: 'Epic' },
      { id: 'rebase_architect', name: 'Rebase Architect', icon: 'linear_scale', tier: 'platinum', desc: 'Clean squash sequence', rarity: 'Legendary' },
      { id: 'conflict_annihilator', name: 'Merge Master', icon: 'call_merge', tier: 'gold', desc: 'Resolved 50 merge conflicts', rarity: 'Epic' },
      { id: 'plumbing_adept', name: 'Plumbing Adept', icon: 'construction', tier: 'silver', desc: 'Direct cat-file inspection', rarity: 'Rare' }
    ];
  }

  /**
   * Get pinned badges with fallback placeholders
   */
  getPinnedBadges(unlockedIds = [], pinnedIds = []) {
    const activePinned = pinnedIds.filter(id => unlockedIds.includes(id)).slice(0, this.maxPinned);
    
    // Auto-fill with first unlocked badges if none pinned
    if (activePinned.length === 0 && unlockedIds.length > 0) {
      unlockedIds.slice(0, this.maxPinned).forEach(id => activePinned.push(id));
    }

    return activePinned.map(id => {
      return this.defaultBadges.find(b => b.id === id) || {
        id,
        name: id.replace(/_/g, ' ').toUpperCase(),
        icon: 'military_tech',
        tier: 'bronze',
        desc: 'Special Operative Milestone',
        rarity: 'Common'
      };
    });
  }

  /**
   * Toggle pin state for an achievement badge
   */
  togglePin(badgeId, unlockedIds = [], currentPinned = []) {
    if (!unlockedIds.includes(badgeId)) {
      return { success: false, reason: 'Badge not unlocked yet', pinned: currentPinned };
    }

    const index = currentPinned.indexOf(badgeId);
    let updated = [...currentPinned];

    if (index !== -1) {
      updated.splice(index, 1);
    } else {
      if (updated.length >= this.maxPinned) {
        updated.shift(); // Remove oldest
      }
      updated.push(badgeId);
    }

    return {
      success: true,
      pinned: updated
    };
  }

  /**
   * Get tier styling
   */
  getTierStyle(tier) {
    switch (tier) {
      case 'platinum':
      case 'legendary':
        return 'border-cyan-400/50 bg-cyan-950/30 text-cyan-400 shadow-cyan-500/20';
      case 'gold':
      case 'epic':
        return 'border-amber-400/50 bg-amber-950/30 text-amber-400 shadow-amber-500/20';
      case 'silver':
      case 'rare':
        return 'border-slate-300/50 bg-slate-800/30 text-slate-200 shadow-slate-400/20';
      default:
        return 'border-amber-700/50 bg-amber-950/20 text-amber-600 shadow-amber-800/10';
    }
  }

  /**
   * Render HTML showcase widget
   */
  renderHtml(unlockedIds = [], pinnedIds = []) {
    const pinnedBadges = this.getPinnedBadges(unlockedIds, pinnedIds);

    const slots = [];
    for (let i = 0; i < this.maxPinned; i++) {
      const badge = pinnedBadges[i];
      if (badge) {
        const tierCls = this.getTierStyle(badge.tier);
        slots.push(`
          <div class="p-3.5 rounded-xl border ${tierCls} shadow-lg flex flex-col items-center text-center space-y-2 relative group cursor-pointer transition-transform hover:-translate-y-0.5">
            <div class="p-2.5 rounded-full bg-black/40 border border-white/10">
              <span class="material-symbols-outlined text-2xl">${badge.icon}</span>
            </div>
            <div>
              <div class="font-mono text-xs font-bold text-on-surface line-clamp-1">${badge.name}</div>
              <div class="text-[10px] text-on-surface-variant line-clamp-1">${badge.desc}</div>
            </div>
            <span class="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/50 border border-white/10 text-on-surface-variant font-bold">
              ${badge.rarity}
            </span>
          </div>
        `);
      } else {
        slots.push(`
          <div class="p-3.5 rounded-xl border border-dashed border-outline-variant/20 bg-surface-container-lowest/30 flex flex-col items-center justify-center text-center space-y-1.5 opacity-50">
            <span class="material-symbols-outlined text-2xl text-on-surface-variant">lock</span>
            <span class="text-[10px] font-mono text-on-surface-variant">Empty Slot</span>
          </div>
        `);
      }
    }

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-primary">military_tech</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Showcase Badges</span>
          </div>
          <span class="text-[10px] text-on-surface-variant font-mono">
            ${pinnedBadges.length} / ${this.maxPinned} Pinned
          </span>
        </div>

        <div class="grid grid-cols-3 gap-3">
          ${slots.join('')}
        </div>
      </div>
    `;
  }
}

export const badgeShowcase = new BadgeShowcase();

// GitHero Milestone Rewards Tree
// Computes sector progression milestones, unlock tier thresholds, and XP bonuses.

export class MilestoneRewardsTree {
  static MILESTONES = [
    { id: 'm_w1', world: 1, requiredStars: 10, title: 'Sector 01 Pioneer', rewardXP: 500, rewardSkin: 'CYBER_OPERATIVE' },
    { id: 'm_w2', world: 2, requiredStars: 20, title: 'Branch Specialist', rewardXP: 1000, rewardSkin: 'MATRIX_GHOST' },
    { id: 'm_w5', world: 5, requiredStars: 50, title: 'Laser Optics Master', rewardXP: 2500, rewardSkin: 'NEON_RUNNER' },
    { id: 'm_w10', world: 10, requiredStars: 100, title: 'Circuit Architect', rewardXP: 5000, rewardSkin: 'VOID_WALKER' },
    { id: 'm_w15', world: 15, requiredStars: 150, title: 'Quantum Navigator', rewardXP: 10000, rewardSkin: 'SOLARIS_ELITE' },
    { id: 'm_w20', world: 20, requiredStars: 250, title: 'GitHero Legend', rewardXP: 25000, rewardSkin: 'GRANDMASTER' }
  ];

  /**
   * Evaluate milestone progress based on player's total earned stars
   * @param {number} totalStars 
   * @returns {Array}
   */
  static evaluateMilestones(totalStars = 0) {
    return this.MILESTONES.map(m => {
      const isUnlocked = totalStars >= m.requiredStars;
      const progress = Math.min(100, Math.round((totalStars / m.requiredStars) * 100));
      return {
        ...m,
        isUnlocked,
        progress,
        remainingStars: Math.max(0, m.requiredStars - totalStars)
      };
    });
  }

  /**
   * Render milestone progress tree HTML widget
   * @param {number} totalStars 
   * @returns {string} HTML markup
   */
  static renderTreeWidget(totalStars = 0) {
    const milestones = this.evaluateMilestones(totalStars);

    const cards = milestones.map(m => `
      <div class="p-4 rounded-xl border transition ${m.isUnlocked ? 'bg-primary/10 border-primary/40' : 'bg-surface-container border-outline-variant/30'} flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <span class="px-2 py-0.5 text-xs font-mono font-bold rounded ${m.isUnlocked ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}">
              WORLD ${m.world}
            </span>
            <span class="text-xs font-bold ${m.isUnlocked ? 'text-primary' : 'text-on-surface-variant'} flex items-center gap-1">
              <span class="material-symbols-Outlined text-sm">${m.isUnlocked ? 'lock_open' : 'lock'}</span>
              ${m.requiredStars} Stars
            </span>
          </div>
          <h4 class="text-sm font-bold text-on-surface mb-1">${m.title}</h4>
          <p class="text-xs text-on-surface-variant mb-3">Skin Reward: <span class="text-secondary font-mono font-semibold">${m.rewardSkin}</span></p>
        </div>

        <div>
          <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-1.5">
            <div class="h-full bg-primary transition-all duration-300" style="width: ${m.progress}%"></div>
          </div>
          <div class="flex justify-between text-xs text-on-surface-variant font-mono">
            <span>+${m.rewardXP} XP</span>
            <span>${m.isUnlocked ? 'CLAIMED' : `${m.remainingStars} stars left`}</span>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-base font-bold text-on-surface">Sector Milestones & Mastery</h3>
            <p class="text-xs text-on-surface-variant">Unlock exclusive operative skins and XP caches by earning stars across all 20 worlds.</p>
          </div>
          <div class="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
            <span class="material-symbols-Outlined text-tertiary text-sm font-variation-fill">star</span>
            <span class="text-xs font-bold text-on-surface font-mono">${totalStars} / 750 Total Stars</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${cards}
        </div>
      </div>
    `;
  }
}

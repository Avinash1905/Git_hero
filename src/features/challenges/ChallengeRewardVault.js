/**
 * ChallengeRewardVault
 * Evaluates daily challenge streak bonuses, rest-day streak freezes, and claims XP rewards.
 */

export class ChallengeRewardVault {
  constructor() {
    this.streakMilestones = [
      { days: 3, bonusXp: 300, title: 'Streak Cadet' },
      { days: 7, bonusXp: 1000, title: 'Weekly Veteran' },
      { days: 14, bonusXp: 2500, title: 'Fortnight Committer' },
      { days: 30, bonusXp: 6000, title: 'Monthly Legend' }
    ];
  }

  /**
   * Calculate claimable streak bonus
   */
  evaluateStreakBonus(currentStreak = 0) {
    const milestone = this.streakMilestones.filter(m => currentStreak >= m.days).pop() || null;
    return {
      currentStreak,
      milestone,
      bonusXp: milestone ? milestone.bonusXp : 0,
      nextMilestone: this.streakMilestones.find(m => currentStreak < m.days) || null
    };
  }

  /**
   * Render HTML reward vault card
   */
  renderHtml(streak = 0, onClaim = 'handleClaimStreakBonus') {
    const data = this.evaluateStreakBonus(streak);
    const { milestone, nextMilestone } = data;

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">local_fire_department</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Streak Reward Vault</span>
          </div>
          <span class="text-xs font-mono text-amber-400 font-bold">${streak}-Day Streak</span>
        </div>

        ${milestone ? `
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div class="font-mono text-xs font-bold text-amber-400">${milestone.title} Milestone Reached!</div>
              <div class="text-[10px] text-on-surface-variant">+${milestone.bonusXp} Bonus XP Vault Unlocked</div>
            </div>
            <button 
              type="button" 
              onclick="${onClaim}()"
              class="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              Claim XP
            </button>
          </div>
        ` : `
          <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs text-on-surface-variant">
            ${nextMilestone ? `Reach a ${nextMilestone.days}-day streak to unlock ${nextMilestone.title} (+${nextMilestone.bonusXp} XP bonus)!` : 'Complete daily challenges to build your streak!'}
          </div>
        `}
      </div>
    `;
  }
}

export const challengeRewardVault = new ChallengeRewardVault();

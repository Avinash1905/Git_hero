/**
 * CampaignProgressTracker
 * Tracks sector milestones, world star distributions, overall completion rate,
 * and unlocks speedrun / master badges across the 250-level multiverse.
 */

export class CampaignProgressTracker {
  constructor() {
    this.totalLevels = 250;
    this.totalWorlds = 20;
    this.maxStars = 250 * 3; // 750 stars
  }

  /**
   * Calculate full campaign statistics
   */
  getCampaignStats(completedLevels = []) {
    const totalCompleted = completedLevels.length;
    const totalStars = completedLevels.reduce((acc, l) => acc + (l.stars || 3), 0);
    const perfectLevels = completedLevels.filter(l => (l.stars || 3) === 3).length;

    const completionRate = Math.round((totalCompleted / this.totalLevels) * 100);
    const starRate = Math.round((totalStars / this.maxStars) * 100);

    return {
      totalCompleted,
      totalRemaining: this.totalLevels - totalCompleted,
      totalStars,
      maxStars: this.maxStars,
      perfectLevels,
      completionRate,
      starRate,
      isCampaignFinished: totalCompleted === this.totalLevels,
      isCampaignMastered: totalStars === this.maxStars
    };
  }

  /**
   * Render HTML campaign progress banner
   */
  renderHtml(completedLevels = []) {
    const stats = this.getCampaignStats(completedLevels);

    return `
      <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-4 shadow-xl">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-base font-bold font-mono text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">public</span>
              <span>Multiverse Campaign Progress</span>
            </h2>
            <p class="text-xs text-on-surface-variant">Conquer all 250 handcrafted tactical Git sectors</p>
          </div>
          <div class="flex items-center gap-6 font-mono text-right">
            <div>
              <div class="text-xl font-bold text-primary">${stats.totalCompleted} / ${stats.totalLevels}</div>
              <div class="text-[10px] text-on-surface-variant uppercase">Sectors Cleared</div>
            </div>
            <div>
              <div class="text-xl font-bold text-amber-400">${stats.totalStars} / ${stats.maxStars}</div>
              <div class="text-[10px] text-on-surface-variant uppercase">Stars Gathered</div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="space-y-1">
          <div class="flex justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Overall Multiverse Completion</span>
            <span>${stats.completionRate}% (${stats.perfectLevels} Perfect 3-Star Sectors)</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-surface-container-lowest overflow-hidden border border-outline-variant/20">
            <div class="h-full bg-primary rounded-full transition-all duration-500 shadow-sm shadow-primary" style="width: ${stats.completionRate}%"></div>
          </div>
        </div>
      </div>
    `;
  }
}

export const campaignProgressTracker = new CampaignProgressTracker();

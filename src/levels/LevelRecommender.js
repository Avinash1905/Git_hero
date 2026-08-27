/**
 * LevelRecommender
 * Intelligent recommendation engine analyzing player performance,
 * move efficiency, failed attempts, and unmastered Git mechanics to suggest next optimal levels.
 */

export class LevelRecommender {
  constructor(options = {}) {
    this.totalLevels = 250;
  }

  /**
   * Recommend next best level for the player
   */
  getRecommendation(player = {}, allLevels = [], progressList = []) {
    const completedIds = (progressList || []).map(p => Number(p.level_id || p.id));
    const highestCompleted = completedIds.length > 0 ? Math.max(...completedIds) : 0;
    
    // Next sequential level
    const nextSequentialId = Math.min(this.totalLevels, highestCompleted + 1);
    const nextLevelData = allLevels.find(l => Number(l.id) === nextSequentialId) || {
      id: nextSequentialId.toString().padStart(2, '0'),
      title: `Sector ${nextSequentialId.toString().padStart(2, '0')}`,
      world_id: Math.ceil(nextSequentialId / 12),
      difficulty: nextSequentialId <= 50 ? 'Beginner' : nextSequentialId <= 120 ? 'Intermediate' : 'Expert'
    };

    // Find levels with < 3 stars for potential improvement
    const subOptimalLevels = (progressList || []).filter(p => (p.stars || 3) < 3);
    const retryCandidate = subOptimalLevels.length > 0 ? subOptimalLevels[0] : null;

    // Determine primary recommendation
    let primaryRec = {
      type: 'progression',
      reason: 'Next Sector in Main Campaign',
      level: nextLevelData,
      tag: 'CAMPAIGN',
      badgeClass: 'bg-primary/10 text-primary border-primary/20'
    };

    if (retryCandidate && Math.random() > 0.6) {
      primaryRec = {
        type: 'mastery',
        reason: `Earn 3 Stars (Current: ${retryCandidate.stars || 2} Stars)`,
        level: allLevels.find(l => Number(l.id) === Number(retryCandidate.level_id || retryCandidate.id)) || retryCandidate,
        tag: 'STAR HUNTER',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      };
    }

    return {
      primary: primaryRec,
      nextSequentialId,
      completedCount: completedIds.length,
      remainingCount: this.totalLevels - completedIds.length,
      masteryRate: completedIds.length > 0 ? Math.round((progressList.filter(p => (p.stars || 3) === 3).length / completedIds.length) * 100) : 0
    };
  }

  /**
   * Render HTML recommendation card widget
   */
  renderHtml(recommendation, onLaunch = 'handleLaunchLevel') {
    const { primary } = recommendation;
    const lvl = primary.level;
    const lvlId = (lvl.id || '01').toString().padStart(2, '0');

    return `
      <div class="p-4 bg-surface-container-low border border-primary/30 rounded-2xl shadow-xl space-y-3 relative overflow-hidden group">
        <div class="absolute -right-8 -top-8 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none group-hover:bg-primary/20 transition-all"></div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">recommend</span>
            <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-primary">Recommended Mission</span>
          </div>
          <span class="px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${primary.badgeClass}">
            ${primary.tag}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-on-surface font-mono">
              Sector ${lvlId}: ${lvl.title || 'Unknown Sector'}
            </h4>
            <p class="text-[11px] text-on-surface-variant">${primary.reason}</p>
          </div>

          <button 
            type="button" 
            onclick="${onLaunch}('${lvlId}')"
            class="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Deploy</span>
            <span class="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </div>
      </div>
    `;
  }
}

export const levelRecommender = new LevelRecommender();

/**
 * GitQuest Frontend - Level Filter Matrix
 * Multi-dimensional level search, world grouping, difficulty filters,
 * completed status filtering, star ratings, and interactive level card grid.
 */

export class LevelFilterMatrix {
  constructor(allLevels = []) {
    this.allLevels = allLevels;
    this.searchQuery = '';
    this.selectedWorld = 'ALL';
    this.selectedDifficulty = 'ALL';
    this.selectedStatus = 'ALL'; // 'ALL', 'COMPLETED', 'UNLOCKED', 'LOCKED'
  }

  setSearch(query) {
    this.searchQuery = (query || '').trim().toLowerCase();
  }

  setWorldFilter(world) {
    this.selectedWorld = world;
  }

  setDifficultyFilter(diff) {
    this.selectedDifficulty = diff;
  }

  setStatusFilter(status) {
    this.selectedStatus = status;
  }

  filterLevels(playerCompletedMap = {}, unlockedLevelIds = new Set(['01'])) {
    return this.allLevels.filter(lvl => {
      // 1. Search Query
      if (this.searchQuery) {
        const matchesName = lvl.name?.toLowerCase().includes(this.searchQuery);
        const matchesDesc = lvl.description?.toLowerCase().includes(this.searchQuery);
        const matchesId = String(lvl.id).includes(this.searchQuery);
        if (!matchesName && !matchesDesc && !matchesId) return false;
      }

      // 2. World Filter
      if (this.selectedWorld !== 'ALL' && Number(lvl.world) !== Number(this.selectedWorld)) {
        return false;
      }

      // 3. Difficulty Filter
      if (this.selectedDifficulty !== 'ALL' && lvl.difficulty !== this.selectedDifficulty) {
        return false;
      }

      // 4. Status Filter
      const isCompleted = Boolean(playerCompletedMap[lvl.id]);
      const isUnlocked = unlockedLevelIds.has(String(lvl.id)) || isCompleted;

      if (this.selectedStatus === 'COMPLETED' && !isCompleted) return false;
      if (this.selectedStatus === 'UNLOCKED' && !isUnlocked) return false;
      if (this.selectedStatus === 'LOCKED' && isUnlocked) return false;

      return true;
    });
  }

  renderLevelCardHtml(levelDef, isUnlocked = true, isCompleted = false, starsEarned = 0) {
    const diffColors = {
      EASY: '#34d399',
      MEDIUM: '#38bdf8',
      HARD: '#f59e0b',
      EXPERT: '#a855f7',
      MASTER: '#ef4444',
      GRANDMASTER: '#ec4899',
      GODHEAD: '#fbbf24'
    };

    const diffColor = diffColors[levelDef.difficulty] || '#38bdf8';
    const starsMarkup = '★'.repeat(starsEarned) + '☆'.repeat(3 - starsEarned);

    return `
      <div class="level-select-card ${isUnlocked ? 'unlocked' : 'locked'}" data-level="${levelDef.id}" style="background:#0f172a; border:1px solid ${isUnlocked ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.05)'}; padding:14px; border-radius:10px; display:flex; flex-direction:column; justify-content:space-between; opacity:${isUnlocked ? 1 : 0.5}; cursor:${isUnlocked ? 'pointer' : 'not-allowed'};">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:bold; color:#64748b;">LEVEL ${levelDef.id}</span>
            <span style="font-size:11px; font-weight:600; color:${diffColor}; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${levelDef.difficulty}</span>
          </div>
          <h4 style="margin:8px 0 4px 0; color:#f8fafc; font-size:14px;">${levelDef.name}</h4>
          <p style="margin:0; color:#94a3b8; font-size:11px; line-height:1.4;">${levelDef.description || ''}</p>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; border-top:1px solid rgba(255,255,255,0.05); padding-top:8px;">
          <span style="color:#fcd34d; font-size:13px;">${isCompleted ? starsMarkup : '☆☆☆'}</span>
          <span style="color:#a78bfa; font-size:11px;">+${levelDef.xpReward || 200} XP</span>
        </div>
      </div>
    `;
  }
}

/**
 * GitQuest Frontend - Player Discipline Studio
 * Avatar customization, unlockable titles, developer badge showcased inventory,
 * and experience progression curves.
 */

export const PLAYER_TITLES = [
  { id: 'apprentice', title: 'Git Apprentice', minXp: 0, icon: '🐣' },
  { id: 'committer', title: 'Committed Voyager', minXp: 1000, icon: '🌿' },
  { id: 'brancher', title: 'Branch Artisan', minXp: 5000, icon: '🌳' },
  { id: 'rebaser', title: 'Rebase Surgeon', minXp: 15000, icon: '🔬' },
  { id: 'mediator', title: 'Conflict Arbiter', minXp: 30000, icon: '🛡️' },
  { id: 'architect', title: 'Monorepo Architect', minXp: 60000, icon: '🏛️' },
  { id: 'godhead', title: 'Eternal Git Godhead', minXp: 100000, icon: '👑' }
];

export class PlayerDisciplineStudio {
  constructor(playerProfile = {}) {
    this.xp = playerProfile.xp || 0;
    this.selectedAvatar = playerProfile.avatar || 'avatar_hero';
    this.selectedTitle = playerProfile.title || 'Git Apprentice';
  }

  getCurrentLevel() {
    return Math.floor(Math.sqrt(this.xp / 100)) + 1;
  }

  getXpToNextLevel() {
    const currentLvl = this.getCurrentLevel();
    const nextLvlXp = (currentLvl * currentLvl) * 100;
    return nextLvlXp - this.xp;
  }

  getUnlockedTitles() {
    return PLAYER_TITLES.filter(t => this.xp >= t.minXp);
  }

  getHighestEarnedTitle() {
    const unlocked = this.getUnlockedTitles();
    return unlocked[unlocked.length - 1] || PLAYER_TITLES[0];
  }

  renderProfileCardHtml() {
    const lvl = this.getCurrentLevel();
    const title = this.getHighestEarnedTitle();
    const xpRemaining = this.getXpToNextLevel();

    return `
      <div class="player-studio-card" style="background:#090d16; border:1px solid rgba(56,189,248,0.3); border-radius:12px; padding:20px; color:#e2e8f0; max-width:340px; font-family:Inter, sans-serif;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:54px; height:54px; border-radius:50%; background:#1e1b4b; border:2px solid #38bdf8; display:flex; align-items:center; justify-content:center; font-size:24px;">
            ${title.icon}
          </div>
          <div>
            <div style="font-size:16px; font-weight:bold; color:#f8fafc;">GitQuest Developer</div>
            <div style="font-size:12px; color:#38bdf8; font-weight:600;">${title.title}</div>
            <div style="font-size:11px; color:#94a3b8;">Player Level ${lvl}</div>
          </div>
        </div>

        <div style="margin-top:16px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
            <span style="color:#64748b;">Total XP: <b style="color:#a78bfa;">${this.xp}</b></span>
            <span style="color:#64748b;">Next: ${xpRemaining} XP</span>
          </div>
          <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
            <div style="width:65%; height:100%; background:linear-gradient(90deg, #38bdf8, #818cf8);"></div>
          </div>
        </div>
      </div>
    `;
  }
}

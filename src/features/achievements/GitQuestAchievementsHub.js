/**
 * GitQuest Frontend - Achievements Hub & Milestone Tracker
 * Comprehensive achievement evaluation engine, milestone claimer,
 * tier badges (Bronze, Silver, Gold, Platinum, Godhead), and UI card generator.
 */

export const AchievementTiers = {
  BRONZE: { name: 'Bronze', color: '#cd7f32', border: 'rgba(205,127,50,0.5)' },
  SILVER: { name: 'Silver', color: '#c0c0c0', border: 'rgba(192,192,192,0.5)' },
  GOLD: { name: 'Gold', color: '#ffd700', border: 'rgba(255,215,0,0.5)' },
  PLATINUM: { name: 'Platinum', color: '#a78bfa', border: 'rgba(167,139,250,0.5)' },
  GODHEAD: { name: 'Godhead', color: '#38bdf8', border: 'rgba(56,189,248,0.8)' }
};

export const ACHIEVEMENTS_CATALOG = [
  {
    id: 'first_commit',
    title: 'First Contribution',
    tier: 'BRONZE',
    icon: '🌱',
    description: 'Commit your first solved level repository payload.',
    xpReward: 100,
    check: stats => (stats.levelsCompleted || 0) >= 1
  },
  {
    id: 'branch_master',
    title: 'Branch Explorer',
    tier: 'BRONZE',
    icon: '🌿',
    description: 'Create and switch across 10 distinct branches.',
    xpReward: 250,
    check: stats => (stats.branchesCreated || 0) >= 10
  },
  {
    id: 'fast_forward_ace',
    title: 'Fast-Forward Ace',
    tier: 'SILVER',
    icon: '⚡',
    description: 'Complete 25 merge operations without any conflicts.',
    xpReward: 500,
    check: stats => (stats.cleanMerges || 0) >= 25
  },
  {
    id: 'rebase_surgeon',
    title: 'Rebase Surgeon',
    tier: 'SILVER',
    icon: '🔬',
    description: 'Execute 15 linear history rebases successfully.',
    xpReward: 750,
    check: stats => (stats.rebasesCompleted || 0) >= 15
  },
  {
    id: 'conflict_mediator',
    title: 'Conflict Mediator',
    tier: 'GOLD',
    icon: '🛡️',
    description: 'Resolve 20 three-way merge conflicts across Merge Peaks.',
    xpReward: 1200,
    check: stats => (stats.conflictsResolved || 0) >= 20
  },
  {
    id: 'pull_master',
    title: 'Gravitational Pull Master',
    tier: 'GOLD',
    icon: '🧲',
    description: 'Execute 100 directional pull maneuvers (git pull left/right/up/down).',
    xpReward: 1500,
    check: stats => (stats.directionalPulls || 0) >= 100
  },
  {
    id: 'reflog_diver',
    title: 'Reflog Abyss Explorer',
    tier: 'PLATINUM',
    icon: '🤿',
    description: 'Rescue 10 detached HEAD dangling commits from the abyss.',
    xpReward: 2500,
    check: stats => (stats.reflogRescues || 0) >= 10
  },
  {
    id: 'monorepo_conqueror',
    title: 'Monorepo Titan',
    tier: 'PLATINUM',
    icon: '🏰',
    description: 'Clear all World 25 Monorepo Fortress endgame chambers.',
    xpReward: 5000,
    check: stats => (stats.maxWorldReached || 0) >= 25
  },
  {
    id: 'git_godhead',
    title: 'The Eternal Git Godhead',
    tier: 'GODHEAD',
    icon: '👑',
    description: 'Complete Level 300 and achieve mastery over the complete Git multiverse.',
    xpReward: 10000,
    check: stats => Boolean(stats.level300Completed)
  }
];

export class GitQuestAchievementsHub {
  constructor(stats = {}) {
    this.stats = stats;
    this.unlockedIds = new Set();
    this.claimedIds = new Set();
  }

  evaluateUnlocks(playerStats) {
    this.stats = { ...this.stats, ...playerStats };
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS_CATALOG) {
      if (!this.unlockedIds.has(ach.id) && ach.check(this.stats)) {
        this.unlockedIds.add(ach.id);
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }

  claimReward(achievementId) {
    if (this.unlockedIds.has(achievementId) && !this.claimedIds.has(achievementId)) {
      this.claimedIds.add(achievementId);
      const ach = ACHIEVEMENTS_CATALOG.find(a => a.id === achievementId);
      return { success: true, xpEarned: ach?.xpReward || 0 };
    }
    return { success: false, reason: 'Achievement not unlocked or already claimed' };
  }

  renderHubHtml() {
    const totalCount = ACHIEVEMENTS_CATALOG.length;
    const unlockedCount = this.unlockedIds.size;
    const progressPct = Math.round((unlockedCount / totalCount) * 100);

    return `
      <div class="achievements-hub-modal" style="background:#090d16; color:#e2e8f0; padding:24px; border-radius:12px; border:1px solid rgba(56,189,248,0.3); max-width:700px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h2 style="margin:0; font-size:20px; color:#38bdf8;">🏆 GitQuest Achievements Hub</h2>
            <p style="margin:4px 0 0 0; font-size:12px; color:#94a3b8;">Unlock milestones, master Git commands, and claim XP rewards.</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:18px; font-weight:bold; color:#34d399;">${unlockedCount} / ${totalCount}</div>
            <div style="font-size:11px; color:#64748b;">${progressPct}% Completed</div>
          </div>
        </div>

        <div class="achievements-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; max-height:400px; overflow-y:auto; padding-right:6px;">
          ${ACHIEVEMENTS_CATALOG.map(ach => {
            const isUnlocked = this.unlockedIds.has(ach.id);
            const isClaimed = this.claimedIds.has(ach.id);
            const tier = AchievementTiers[ach.tier] || AchievementTiers.BRONZE;

            return `
              <div class="ach-card" style="background:${isUnlocked ? '#0f172a' : '#070a10'}; border:1px solid ${isUnlocked ? tier.border : 'rgba(255,255,255,0.05)'}; padding:12px; border-radius:8px; display:flex; flex-direction:column; justify-content:space-between; opacity:${isUnlocked ? 1 : 0.6};">
                <div style="display:flex; gap:10px;">
                  <div style="font-size:24px;">${ach.icon}</div>
                  <div>
                    <div style="font-weight:600; font-size:13px; color:${isUnlocked ? '#f8fafc' : '#64748b'};">${ach.title}</div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:2px;">${ach.description}</div>
                  </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:11px;">
                  <span style="color:${tier.color}; font-weight:600;">[${tier.name}] +${ach.xpReward} XP</span>
                  ${isUnlocked
                    ? (isClaimed
                        ? '<span style="color:#34d399;">✓ Claimed</span>'
                        : `<button class="claim-btn" data-id="${ach.id}" style="background:#10b981; color:#000; border:none; border-radius:4px; padding:3px 8px; font-weight:bold; cursor:pointer;">Claim</button>`)
                    : '<span style="color:#475569;">🔒 Locked</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

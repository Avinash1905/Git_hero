/**
 * AvatarTitleStudio
 * Customization studio for player operative titles and avatars based on unlocked achievements and sector milestones.
 */

export class AvatarTitleStudio {
  constructor() {
    this.titles = [
      { id: 'apprentice', title: 'Git Apprentice', reqLevel: 1, reqAch: 0, desc: 'Started journey into version control' },
      { id: 'branch_weaver', title: 'Branch Weaver', reqLevel: 15, reqAch: 2, desc: 'Master of parallel commit trees' },
      { id: 'merge_tactician', title: 'Merge Tactician', reqLevel: 30, reqAch: 5, desc: 'Conflict resolver extraordinaire' },
      { id: 'rebase_architect', title: 'Rebase Architect', reqLevel: 50, reqAch: 8, desc: 'Curator of immaculate linear commit histories' },
      { id: 'plumbing_adept', title: 'Plumbing Adept', reqLevel: 100, reqAch: 12, desc: 'Direct manipulator of SHA-1 blobs and trees' },
      { id: 'reflog_wizard', title: 'Reflog Wizard', reqLevel: 150, reqAch: 15, desc: 'Resurrects orphaned commits from the void' },
      { id: 'submodule_commander', title: 'Submodule Commander', reqLevel: 200, reqAch: 20, desc: 'Nested repository orchestrator' },
      { id: 'kernel_maintainer', title: 'Kernel Maintainer', reqLevel: 250, reqAch: 25, desc: 'Conquered the entire 250-sector multiverse' }
    ];

    this.avatars = [
      { id: 'cyber_hero', icon: 'smart_toy', color: 'text-primary', bg: 'bg-primary/10', name: 'Cyber Operative' },
      { id: 'terminal_ghost', icon: 'terminal', color: 'text-emerald-400', bg: 'bg-emerald-950/40', name: 'Terminal Ghost' },
      { id: 'quantum_coder', icon: 'deployed_code', color: 'text-cyan-400', bg: 'bg-cyan-950/40', name: 'Quantum Coder' },
      { id: 'branch_ninja', icon: 'alt_route', color: 'text-amber-400', bg: 'bg-amber-950/40', name: 'Branch Ninja' },
      { id: 'void_walker', icon: 'blur_on', color: 'text-purple-400', bg: 'bg-purple-950/40', name: 'Void Walker' },
      { id: 'kernel_overlord', icon: 'memory', color: 'text-rose-400', bg: 'bg-rose-950/40', name: 'Kernel Overlord' }
    ];
  }

  /**
   * Get available titles based on player level and achievement count
   */
  getAvailableTitles(playerLevel = 1, completedCount = 0, achCount = 0) {
    return this.titles.map(t => {
      const unlocked = completedCount >= t.reqLevel || playerLevel >= t.reqLevel;
      return {
        ...t,
        unlocked
      };
    });
  }

  /**
   * Render HTML customization studio
   */
  renderHtml(player = {}, options = {}) {
    const { onSelectTitle = 'handleSelectTitle', onSelectAvatar = 'handleSelectAvatar' } = options;
    const completedCount = player.completedLevels?.length || player.completedCount || 0;
    const achCount = player.achievements?.length || 0;
    const currentTitle = player.title || 'Git Apprentice';
    const currentAvatar = player.avatar || 'cyber_hero';

    const availableTitles = this.getAvailableTitles(player.level || 1, completedCount, achCount);

    const titleOptions = availableTitles.map(t => `
      <div 
        onclick="${t.unlocked ? `${onSelectTitle}('${t.title}')` : ''}"
        class="p-3 rounded-xl border ${t.title === currentTitle ? 'border-primary bg-primary/10' : t.unlocked ? 'border-outline-variant/30 hover:border-primary/50 cursor-pointer bg-surface-container-lowest' : 'border-outline-variant/10 opacity-40 bg-surface-container-lowest/30'} flex items-center justify-between transition-all"
      >
        <div class="space-y-0.5">
          <div class="font-mono text-xs font-bold ${t.title === currentTitle ? 'text-primary' : 'text-on-surface'}">
            ${t.title}
          </div>
          <div class="text-[10px] text-on-surface-variant">${t.desc}</div>
        </div>
        <div class="text-right font-mono text-[10px]">
          ${t.unlocked ? (t.title === currentTitle ? '<span class="text-primary font-bold">EQUIPPED</span>' : '<span class="text-on-surface-variant">EQUIP</span>') : `<span class="text-on-surface-variant flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">lock</span> Lvl ${t.reqLevel}</span>`}
        </div>
      </div>
    `).join('');

    const avatarGrid = this.avatars.map(a => `
      <button 
        type="button" 
        onclick="${onSelectAvatar}('${a.id}')"
        class="p-3 rounded-xl border ${a.id === currentAvatar ? 'border-primary ring-2 ring-primary/30 bg-primary/10' : 'border-outline-variant/30 hover:border-primary/40 bg-surface-container-lowest'} flex flex-col items-center gap-2 transition-all cursor-pointer"
      >
        <div class="w-10 h-10 rounded-full ${a.bg} flex items-center justify-center ${a.color}">
          <span class="material-symbols-outlined text-2xl">${a.icon}</span>
        </div>
        <span class="text-[10px] font-mono text-on-surface line-clamp-1">${a.name}</span>
      </button>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
          <span class="material-symbols-outlined text-[18px] text-primary">badge</span>
          <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Operative Identity & Titles</h3>
        </div>

        <!-- Avatars -->
        <div class="space-y-2">
          <span class="text-[10px] uppercase font-mono text-on-surface-variant font-bold">Avatar Crest</span>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
            ${avatarGrid}
          </div>
        </div>

        <!-- Titles -->
        <div class="space-y-2">
          <span class="text-[10px] uppercase font-mono text-on-surface-variant font-bold">Operative Title</span>
          <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            ${titleOptions}
          </div>
        </div>
      </div>
    `;
  }
}

export const avatarTitleStudio = new AvatarTitleStudio();

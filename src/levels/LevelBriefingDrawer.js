/**
 * LevelBriefingDrawer
 * Detailed sliding briefing panel for sector objectives, Git concepts, hints, and tactical parameters.
 */

export class LevelBriefingDrawer {
  /**
   * Render HTML drawer markup
   */
  renderHtml(level = {}, options = {}) {
    const {
      onClose = 'handleCloseBriefingDrawer',
      onLaunch = 'handleLaunchLevel',
      isUnlocked = true,
      stars = 0
    } = options;

    const levelId = (level.id || '01').toString().padStart(2, '0');
    const objectives = level.objectives || [
      'Stage all modified commit boxes on the target ref line',
      'Execute git commit to seal repository state',
      'Merge branch into master without merge conflicts'
    ];

    const objectiveItems = objectives.map((obj, i) => `
      <div class="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
        <span class="p-1 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">0${i + 1}</span>
        <span class="text-xs text-on-surface leading-relaxed">${obj}</span>
      </div>
    `).join('');

    const starIcons = [1, 2, 3].map(s => `
      <span class="material-symbols-outlined text-lg ${s <= stars ? 'text-amber-400' : 'text-outline-variant/30'}">star</span>
    `).join('');

    return `
      <div class="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in" id="level-briefing-drawer">
        <div class="w-full max-w-md h-full bg-surface-container-high border-l border-outline-variant/30 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-left">
          
          <div class="space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
              <div class="space-y-0.5">
                <span class="text-[10px] uppercase font-mono font-bold tracking-widest text-primary">Sector Dossier</span>
                <h2 class="text-lg font-bold text-on-surface font-mono">Sector ${levelId}: ${level.title || 'Classified'}</h2>
              </div>
              <button onclick="${onClose}()" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Metadata Pills -->
            <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant">
                World ${level.world_id || 1}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant">
                ${level.difficulty || 'Normal'} Tier
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">bolt</span> +${level.xp_reward || 100} XP
              </span>
              <div class="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                ${starIcons}
              </div>
            </div>

            <!-- Concept Card -->
            <div class="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
              <div class="flex items-center gap-1.5 text-primary text-xs font-mono font-bold uppercase">
                <span class="material-symbols-outlined text-[16px]">psychology</span>
                <span>Core Concept: ${level.concept || 'Branching & Commits'}</span>
              </div>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                ${level.description || 'Master Git mechanics by staging and synchronizing commit payloads into designated repository branches.'}
              </p>
            </div>

            <!-- Objectives List -->
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-mono tracking-wider font-bold text-on-surface-variant">
                Mission Directives
              </span>
              <div class="space-y-2">
                ${objectiveItems}
              </div>
            </div>

            <!-- Hint Section -->
            <div class="p-3 rounded-xl bg-surface-container-lowest/60 border border-dashed border-outline-variant/30 text-xs text-on-surface-variant space-y-1">
              <div class="font-mono text-[10px] font-bold uppercase text-on-surface flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px] text-amber-400">lightbulb</span>
                <span>Tactical Advice</span>
              </div>
              <p class="leading-relaxed text-[11px]">
                ${level.hint || 'Inspect your spatial staging line before executing git commit. Avoid corner deadlocks by pulling laser nodes carefully.'}
              </p>
            </div>
          </div>

          <!-- Bottom Launch Bar -->
          <div class="border-t border-outline-variant/20 pt-4 space-y-2">
            ${isUnlocked ? `
              <button 
                type="button" 
                onclick="${onLaunch}('${levelId}')"
                class="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Deploy Operative to Sector ${levelId}</span>
              </button>
            ` : `
              <button 
                type="button" 
                disabled
                class="w-full py-3 px-4 bg-surface-container text-on-surface-variant font-mono text-xs uppercase font-bold tracking-wider rounded-xl opacity-60 flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <span class="material-symbols-outlined text-[18px]">lock</span>
                <span>Sector Locked — Complete Previous Sectors</span>
              </button>
            `}
          </div>

        </div>
      </div>
    `;
  }
}

export const levelBriefingDrawer = new LevelBriefingDrawer();

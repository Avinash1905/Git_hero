/**
 * LevelInfoModal
 * Tactical briefing modal before launching a specific level.
 */

export function renderLevelInfoModal(level, progress = {}) {
  const isCompleted = Boolean(progress.completed || progress.status === 'COMPLETED');
  const stars = progress.stars || 0;

  const starsHtml = [1, 2, 3].map(s => `
    <span class="material-symbols-outlined text-2xl ${s <= stars ? 'text-tertiary drop-shadow-[0_0_8px_#ffb95f]' : 'text-outline-variant/30'}" style="font-variation-settings: 'FILL' ${s <= stars ? 1 : 0};">star</span>
  `).join('');

  return `
    <div id="level-info-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in font-terminal-code">
      <div class="glass-panel w-full max-w-md rounded-2xl p-6 md:p-8 border border-outline-variant/40 shadow-2xl relative space-y-6">
        <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-terminal-label uppercase font-bold border border-primary/30">
              Sector ${String(level.number).padStart(2, '0')}
            </span>
            <span class="text-xs text-on-surface-variant">World ${level.world || 1}</span>
          </div>

          <button id="level-info-close-btn" class="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div>
          <h3 class="text-xl font-bold text-on-surface font-headline-sm mb-1">${level.name}</h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">${level.description || 'Initialize and verify git commits in this tactical arena.'}</p>
        </div>

        <!-- Stars Display -->
        <div class="flex items-center justify-center gap-2 py-2">
          ${starsHtml}
        </div>

        <!-- Grid Attributes -->
        <div class="grid grid-cols-3 gap-2 bg-surface-container-lowest/80 p-3 rounded-xl border border-outline-variant/20 text-xs">
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Difficulty</div>
            <div class="text-primary font-bold mt-0.5">${level.difficulty || 'EASY'}</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Grid Size</div>
            <div class="text-secondary font-bold mt-0.5">${level.gridSize || 6} x ${level.gridSize || 6}</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Bounty</div>
            <div class="text-tertiary font-bold mt-0.5">+${level.xpReward || 200} XP</div>
          </div>
        </div>

        <button 
          id="level-info-launch-btn"
          data-level-id="${level.id}"
          class="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>${isCompleted ? 'Replay Sector' : 'Initialize Mission'}</span>
          <span class="material-symbols-outlined text-lg">play_arrow</span>
        </button>
      </div>
    </div>
  `;
}

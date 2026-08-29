/**
 * LevelVictoryCelebration
 * High-impact victory modal with animated star reveals, score tallies, XP counters, and next-sector navigation.
 */

export function renderLevelVictoryCelebration(victoryData = {}, options = {}) {
  const {
    onNextLevel = 'handleNextLevel',
    onReplay = 'handleReplayLevel',
    onLevelSelect = 'handleReturnToLevels'
  } = options;

  const levelId = (victoryData.levelId || '01').toString().padStart(2, '0');
  const nextLevelId = (Number(levelId) + 1).toString().padStart(2, '0');
  const stars = victoryData.stars || 3;
  const xpEarned = victoryData.xpEarned || 150;
  const moveCount = victoryData.moveCount || 12;
  const durationSeconds = victoryData.durationSeconds || 24;

  const starElements = [1, 2, 3].map(s => `
    <div class="flex flex-col items-center">
      <span class="material-symbols-outlined text-4xl ${s <= stars ? 'text-amber-400 animate-bounce' : 'text-outline-variant/30'}">star</span>
    </div>
  `).join('');

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="level-victory-modal">
      <div class="w-full max-w-md bg-surface-container-high border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-6 text-center animate-scale-up relative overflow-hidden">
        
        <!-- Background Radial Glow -->
        <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Header -->
        <div class="space-y-1">
          <span class="text-[10px] uppercase font-mono tracking-widest font-bold text-primary">Sector Cleared</span>
          <h2 class="text-2xl font-bold font-mono text-on-surface">Sector ${levelId} Conquered</h2>
        </div>

        <!-- Stars Display -->
        <div class="flex items-center justify-center gap-3 py-2">
          ${starElements}
        </div>

        <!-- Statistics Grid -->
        <div class="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 font-mono">
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase">XP Reward</div>
            <div class="text-sm font-bold text-primary">+${xpEarned}</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase">Moves</div>
            <div class="text-sm font-bold text-on-surface">${moveCount}</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase">Time</div>
            <div class="text-sm font-bold text-on-surface">${durationSeconds}s</div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-2.5 pt-2">
          <button 
            type="button" 
            onclick="${onNextLevel}('${nextLevelId}')"
            class="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Sector ${nextLevelId}</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <div class="flex gap-2">
            <button 
              type="button" 
              onclick="${onReplay}('${levelId}')"
              class="flex-1 py-2.5 px-3 bg-surface-container hover:bg-surface-container-highest text-on-surface font-mono text-xs font-bold rounded-xl border border-outline-variant/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">replay</span>
              <span>Replay</span>
            </button>

            <button 
              type="button" 
              onclick="${onLevelSelect}()"
              class="flex-1 py-2.5 px-3 bg-surface-container hover:bg-surface-container-highest text-on-surface font-mono text-xs font-bold rounded-xl border border-outline-variant/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Sectors</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

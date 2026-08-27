/**
 * GameplayHUD
 * Renders the top status bar and objective trackers for active gameplay sessions.
 */

export class GameplayHUD {
  /**
   * Render the top HUD bar
   * @param {import('../../adapters/EngineStateMapper.js').FrontendGameplayState} gameState
   * @returns {string}
   */
  static renderHUDHtml(gameState) {
    if (!gameState) return '';

    const isStaged = gameState.isGoalReached;
    const stageBadgeClass = isStaged
      ? 'bg-primary text-on-primary font-bold shadow-[0_0_12px_#4edea350]'
      : 'bg-surface-variant text-on-surface-variant';

    return `
      <header class="hud-panel rounded-xl p-4 mb-4 bg-surface-container/90 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl select-none">
        <!-- Left: Sector & Branch Info -->
        <div class="flex items-center gap-3">
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="text-xs font-terminal-label font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                LEVEL ${gameState.levelId}
              </span>
              <span class="text-xs font-terminal-label text-on-surface-variant">
                World ${gameState.world}
              </span>
            </div>
            <h2 class="text-headline-sm font-bold text-on-surface text-base md:text-lg mt-0.5">
              ${gameState.levelName}
            </h2>
          </div>
        </div>

        <!-- Center: Objective Status -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest/80 border border-outline-variant/20">
          <span class="text-xs text-on-surface-variant font-terminal-label uppercase tracking-wider">Objective:</span>
          <span class="text-xs font-terminal-label px-2 py-0.5 rounded ${stageBadgeClass} transition-all">
            ${isStaged ? 'TARGET STAGED (READY TO COMMIT)' : 'DELIVER ASSET TO STAGING NODE'}
          </span>
        </div>

        <!-- Right: Realtime Stats & Actions -->
        <div class="flex items-center gap-4 text-xs font-terminal-code">
          <!-- Timer -->
          <div class="flex items-center gap-1 text-on-surface">
            <span class="material-symbols-outlined text-[16px] text-primary">timer</span>
            <span id="game-live-timer" class="font-bold">${gameState.formattedTime || '00:00'}</span>
          </div>

          <!-- Moves -->
          <div class="flex items-center gap-1 text-on-surface">
            <span class="material-symbols-outlined text-[16px] text-secondary">directions_walk</span>
            <span><strong id="hud-moves-count">${gameState.moves || 0}</strong> moves</span>
          </div>

          <!-- Controls: Undo & Reset -->
          <div class="flex items-center gap-1 ml-2 border-l border-outline-variant/30 pl-3">
            <button 
              id="btn-undo-move" 
              title="Undo Move (Ctrl+Z)" 
              class="p-1.5 rounded bg-surface-variant/80 hover:bg-surface-variant text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[18px]">undo</span>
            </button>
            <button 
              id="btn-reset-level" 
              title="Restart Level" 
              class="p-1.5 rounded bg-surface-variant/80 hover:bg-surface-variant text-on-surface hover:text-error transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }
}

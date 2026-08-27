/**
 * GitHero Game HUD Component
 * Displays real-time lives, timer, move counters, branch badges, and objective progress.
 */

export function renderGameHUD(gameState, onTogglePause, onOpenHints, onResetLevel) {
  const level = gameState.levelDef;
  const livesCount = gameState.lives ?? 3;
  const heartsHtml = Array(3).fill(null).map((_, i) => {
    const isAlive = i < livesCount;
    return `
      <span class="material-symbols-outlined text-[18px] ${isAlive ? 'text-primary' : 'text-outline-variant/40'}" style="font-variation-settings: 'FILL' ${isAlive ? 1 : 0};">
        favorite
      </span>
    `;
  }).join('');

  return `
    <div class="w-full flex items-center justify-between px-4 py-3 bg-surface-container-high/90 backdrop-blur-md border-b border-outline-variant/30 shrink-0">
      <!-- Left: Lives & Level Info -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
          ${heartsHtml}
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-terminal-label text-primary font-bold tracking-wider uppercase">
            LVL ${level.id}
          </span>
          <span class="text-xs font-terminal-code text-on-surface-variant hidden sm:inline">
            :: ${level.name}
          </span>
        </div>
      </div>

      <!-- Center: Moves & Timer -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <span class="material-symbols-outlined text-tertiary text-[16px]">timer</span>
          <span id="game-timer-display" class="font-hud-stat text-sm text-tertiary font-mono">
            ${gameState.getFormattedTime ? gameState.getFormattedTime() : '00:00'}
          </span>
        </div>

        <div class="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
          <span class="material-symbols-outlined text-secondary text-[16px]">footprint</span>
          <span id="game-moves-display" class="font-hud-stat text-sm text-secondary font-mono">
            ${gameState.moves}
          </span>
        </div>
      </div>

      <!-- Right: Action Buttons (Hint, Reset, Pause) -->
      <div class="flex items-center gap-2">
        <button id="hud-hint-btn" title="View Level Hint" class="p-2 rounded-lg bg-surface-container-low hover:bg-surface-variant border border-outline-variant/30 text-tertiary transition-colors flex items-center gap-1 text-xs font-terminal-label">
          <span class="material-symbols-outlined text-[16px]">lightbulb</span>
          <span class="hidden md:inline">HINT</span>
        </button>

        <button id="hud-reset-btn" title="Reset Level (git reset --hard)" class="p-2 rounded-lg bg-surface-container-low hover:bg-surface-variant border border-outline-variant/30 text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 text-xs font-terminal-label">
          <span class="material-symbols-outlined text-[16px]">restart_alt</span>
          <span class="hidden md:inline">RESET</span>
        </button>

        <button id="hud-pause-btn" title="Quick Pause" class="p-2 rounded-lg bg-surface-container-low hover:bg-surface-variant border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors">
          <span class="material-symbols-outlined text-[16px]">pause</span>
        </button>
      </div>
    </div>
  `;
}

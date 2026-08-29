/**
 * GhostComparisonEngine
 * Compares two player run telemetry streams (timestamp, delta moves, branch switches, solve latency)
 * to output step-by-step telemetry differentials for ghost duels.
 */

export class GhostComparisonEngine {
  /**
   * Compare player run with ghost run
   */
  compareRuns(playerRun = {}, ghostRun = {}) {
    const playerTime = playerRun.durationSeconds || playerRun.time || 60;
    const ghostTime = ghostRun.durationSeconds || ghostRun.time || 60;
    const playerMoves = playerRun.moves || (playerRun.moveHistory?.length) || 20;
    const ghostMoves = ghostRun.moves || (ghostRun.moveHistory?.length) || 20;

    const timeDelta = Math.round((playerTime - ghostTime) * 10) / 10;
    const movesDelta = playerMoves - ghostMoves;

    const isWinner = playerTime < ghostTime || (playerTime === ghostTime && playerMoves <= ghostMoves);

    return {
      isWinner,
      winner: isWinner ? (playerRun.username || 'You') : (ghostRun.username || 'Ghost Operative'),
      timeDelta,
      movesDelta,
      playerStats: { time: playerTime, moves: playerMoves },
      ghostStats: { time: ghostTime, moves: ghostMoves }
    };
  }

  /**
   * Render HTML duel summary card
   */
  renderDuelResult(comparison) {
    const { isWinner, winner, timeDelta, movesDelta, playerStats, ghostStats } = comparison;

    return `
      <div class="p-6 rounded-2xl border ${isWinner ? 'border-primary/50 bg-primary/10' : 'border-error/40 bg-error/10'} shadow-2xl space-y-4 font-mono text-xs">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-2xl ${isWinner ? 'text-primary' : 'text-error'}">
              ${isWinner ? 'emoji_events' : 'sentiment_very_dissatisfied'}
            </span>
            <span class="text-base font-bold uppercase ${isWinner ? 'text-primary' : 'text-error'}">
              ${isWinner ? 'VICTORY — GHOST OUTPACED' : 'DEFEAT — GHOST CLAIMS SECTOR'}
            </span>
          </div>
          <span class="text-[10px] uppercase font-bold text-on-surface-variant">Duel Telemetry</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span class="text-[10px] text-on-surface-variant">Your Run</span>
            <div class="text-sm font-bold text-on-surface">${playerStats.time}s • ${playerStats.moves} moves</div>
          </div>
          <div class="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span class="text-[10px] text-on-surface-variant">Ghost Competitor</span>
            <div class="text-sm font-bold text-on-surface">${ghostStats.time}s • ${ghostStats.moves} moves</div>
          </div>
        </div>

        <div class="text-[11px] text-on-surface-variant">
          Time Differential: <strong class="${timeDelta <= 0 ? 'text-primary' : 'text-error'}">${timeDelta > 0 ? '+' : ''}${timeDelta}s</strong> | 
          Moves Differential: <strong class="${movesDelta <= 0 ? 'text-primary' : 'text-error'}">${movesDelta > 0 ? '+' : ''}${movesDelta} moves</strong>
        </div>
      </div>
    `;
  }
}

export const ghostComparisonEngine = new GhostComparisonEngine();

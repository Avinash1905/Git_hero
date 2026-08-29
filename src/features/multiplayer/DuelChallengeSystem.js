/**
 * DuelChallengeSystem
 * Ghost replay recorder and asynchronous time-trial duel simulator between operatives.
 */

export class DuelChallengeSystem {
  constructor() {
    this.activeDuel = {
      levelId: '12',
      challenger: {
        username: 'commander_alpha',
        timeSeconds: 42.5,
        moves: 14,
        history: ['down', 'down', 'right', 'push', 'commit']
      },
      opponent: {
        username: 'ghost_operative_07',
        timeSeconds: 38.2,
        moves: 12,
        history: ['right', 'down', 'down', 'push', 'commit']
      }
    };
  }

  compareRuns() {
    const challenger = this.activeDuel.challenger;
    const opponent = this.activeDuel.opponent;

    const timeDelta = (challenger.timeSeconds - opponent.timeSeconds).toFixed(1);
    const movesDelta = challenger.moves - opponent.moves;
    const isWinner = challenger.timeSeconds <= opponent.timeSeconds;

    return {
      isWinner,
      timeDelta: Math.abs(timeDelta),
      movesDelta: Math.abs(movesDelta),
      winner: isWinner ? challenger.username : opponent.username
    };
  }

  renderHtml() {
    const comparison = this.compareRuns();

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-6 shadow-2xl">
        <div class="flex items-center justify-between border-b border-surface-variant/30 pb-4">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-terminal-label uppercase font-bold border border-tertiary/30">
              ASYNC DUEL TRIAL
            </span>
            <span class="text-xs text-on-surface font-bold">Sector ${this.activeDuel.levelId} Speedrun</span>
          </div>

          <span class="text-xs font-bold ${comparison.isWinner ? 'text-primary' : 'text-error'}">
            ${comparison.isWinner ? 'VICTORY SECURED' : 'GHOST PACED AHEAD'}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Operative -->
          <div class="p-4 rounded-xl bg-surface-container-lowest/80 border ${comparison.isWinner ? 'border-primary/50' : 'border-outline-variant/30'} space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-on-surface text-sm">${this.activeDuel.challenger.username} (You)</span>
              <span class="text-primary font-bold">${this.activeDuel.challenger.timeSeconds}s</span>
            </div>
            <div class="text-[11px] text-on-surface-variant">Moves: <strong>${this.activeDuel.challenger.moves}</strong></div>
          </div>

          <!-- Ghost Opponent -->
          <div class="p-4 rounded-xl bg-surface-container-lowest/80 border ${!comparison.isWinner ? 'border-primary/50' : 'border-outline-variant/30'} space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-on-surface text-sm">${this.activeDuel.opponent.username}</span>
              <span class="text-secondary font-bold">${this.activeDuel.opponent.timeSeconds}s</span>
            </div>
            <div class="text-[11px] text-on-surface-variant">Moves: <strong>${this.activeDuel.opponent.moves}</strong></div>
          </div>
        </div>

        <div class="text-center p-3 rounded-xl bg-surface-container-high/40 text-xs text-on-surface-variant">
          Time Differential: <strong class="text-on-surface">${comparison.timeDelta} seconds</strong> • Move Differential: <strong class="text-on-surface">${comparison.movesDelta} moves</strong>
        </div>
      </div>
    `;
  }
}

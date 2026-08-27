/**
 * ChallengeModifierMatrix
 * Generates daily game puzzle modifiers and rulesets (e.g., Blindfold, 3-Commit Limit, No Stash)
 * and computes dynamic score multipliers.
 */

export class ChallengeModifierMatrix {
  constructor() {
    this.modifiers = [
      { id: 'blindfold', name: 'Blindfold Mode', desc: 'Minimap and distant sector tiles are obscured by fog-of-war.', multiplier: 1.5, icon: 'visibility_off' },
      { id: 'three_commit_limit', name: 'Strict 3-Commit Quota', desc: 'Maximum of 3 git commit commands permitted per puzzle run.', multiplier: 1.3, icon: 'pin' },
      { id: 'no_stash_allowed', name: 'No Stash Permitted', desc: 'Git stash and stash pop commands are blocked.', multiplier: 1.25, icon: 'block' },
      { id: 'speedrun_rush', name: '60s Countdown Rush', desc: 'Complete the entire sector before the 60-second timer hits zero.', multiplier: 1.75, icon: 'alarm' },
      { id: 'inverted_controls', name: 'Reversed Polarities', desc: 'Directional movement controls are inverted by magnetic interference.', multiplier: 1.4, icon: 'swap_calls' }
    ];
  }

  /**
   * Get deterministic modifiers for a specific date (YYYY-MM-DD)
   */
  getModifiersForDate(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    const day = date.getDate() + (date.getMonth() * 31);
    
    // Pick 2 deterministic modifiers based on date hash
    const mod1 = this.modifiers[day % this.modifiers.length];
    const mod2 = this.modifiers[(day + 2) % this.modifiers.length];

    const active = mod1.id === mod2.id ? [mod1] : [mod1, mod2];
    const totalMultiplier = active.reduce((acc, m) => acc * m.multiplier, 1.0);

    return {
      date: date.toISOString().split('T')[0],
      modifiers: active,
      totalMultiplier: Math.round(totalMultiplier * 100) / 100
    };
  }

  /**
   * Render HTML modifiers card
   */
  renderHtml(dateString) {
    const data = this.getModifiersForDate(dateString);
    const modCards = data.modifiers.map(m => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-lg bg-warning/10 text-warning border border-warning/20">
            <span class="material-symbols-outlined text-[18px]">${m.icon}</span>
          </div>
          <div>
            <div class="font-mono text-xs font-bold text-on-surface">${m.name}</div>
            <div class="text-[10px] text-on-surface-variant">${m.desc}</div>
          </div>
        </div>
        <span class="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          x${m.multiplier}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-warning">tune</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Active Sector Modifiers</span>
          </div>
          <span class="text-xs font-mono text-primary font-bold">
            Total Multiplier: x${data.totalMultiplier}
          </span>
        </div>
        <div class="space-y-2">
          ${modCards}
        </div>
      </div>
    `;
  }
}

export const challengeModifierMatrix = new ChallengeModifierMatrix();

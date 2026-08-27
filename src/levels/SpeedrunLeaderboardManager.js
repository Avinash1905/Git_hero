/**
 * SpeedrunLeaderboardManager
 * Tracks personal best times, split records, and gold medals for speedrunning sectors.
 */

export class SpeedrunLeaderboardManager {
  constructor() {
    this.storageKey = 'githero_speedrun_records';
  }

  /**
   * Get all recorded personal bests
   */
  getRecords() {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Record a sector completion run and check for personal best
   */
  recordRun(levelId, durationSeconds, moveCount) {
    const records = this.getRecords();
    const existing = records[levelId];

    let isNewRecord = false;
    if (!existing || durationSeconds < existing.timeSeconds) {
      records[levelId] = {
        timeSeconds: Math.round(durationSeconds * 10) / 10,
        moveCount,
        recordedAt: new Date().toISOString()
      };
      isNewRecord = true;

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(records));
      }
    }

    return {
      isNewRecord,
      record: records[levelId],
      previous: existing || null
    };
  }

  /**
   * Render HTML personal bests card
   */
  renderHtml(records = {}) {
    const entries = Object.entries(records);
    if (entries.length === 0) {
      return `
        <div class="p-6 text-center text-xs font-mono text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">
          No speedrun records logged yet. Clear sectors rapidly to set your personal bests!
        </div>
      `;
    }

    const rows = entries.slice(0, 10).map(([lvlId, rec]) => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-2">
          <span class="text-primary font-bold">Sector ${lvlId.padStart(2, '0')}</span>
          <span class="text-on-surface-variant">• ${rec.moveCount} moves</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-amber-400 font-bold">${rec.timeSeconds}s</span>
          <span class="material-symbols-outlined text-amber-400 text-[16px]">timer</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">speed</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Speedrun Best Splits</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${entries.length} Sectors Recorded</span>
        </div>
        <div class="space-y-2">
          ${rows}
        </div>
      </div>
    `;
  }
}

export const speedrunLeaderboardManager = new SpeedrunLeaderboardManager();

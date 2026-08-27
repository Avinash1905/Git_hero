/**
 * WorldProgressionMap
 * Visual interactive world node map rendering all 20 Worlds connected by topological ref arrows.
 */

import { worldProgressionEngine } from '../../levels/WorldProgressionEngine.js';

export class WorldProgressionMap {
  renderHtml(completedLevels = [], options = {}) {
    const { onSelectWorld = 'handleSelectWorld' } = options;
    const worlds = worldProgressionEngine.getAllWorldSummaries(completedLevels);

    const worldCards = worlds.map(w => {
      const isUnlocked = w.isUnlocked;
      const isCompleted = w.isCompleted;

      return `
        <div 
          onclick="${isUnlocked ? `${onSelectWorld}(${w.worldId})` : ''}"
          class="p-4 rounded-2xl border ${isCompleted ? 'border-primary/50 bg-primary/10' : isUnlocked ? 'border-outline-variant/30 bg-surface-container-low hover:border-primary/40 cursor-pointer' : 'border-outline-variant/10 bg-surface-container-lowest/30 opacity-40 cursor-not-allowed'} space-y-3 transition-all"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-primary">WORLD ${w.worldId.toString().padStart(2, '0')}</span>
            <div class="flex items-center gap-1 font-mono text-[10px] text-amber-400">
              <span>${w.starsCollected} / ${w.maxPossibleStars}</span>
              <span class="material-symbols-outlined text-[14px]">star</span>
            </div>
          </div>

          <div>
            <h4 class="font-mono text-sm font-bold text-on-surface">${w.name}</h4>
            <p class="text-[11px] text-on-surface-variant">Sectors ${w.range[0]} – ${w.range[1]}</p>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[9px] font-mono text-on-surface-variant">
              <span>Sectors Cleared</span>
              <span>${w.completedCount} / ${w.totalInWorld} (${w.completionPercentage}%)</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
              <div class="h-full bg-primary rounded-full" style="width: ${w.completionPercentage}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          ${worldCards}
        </div>
      </div>
    `;
  }
}

export const worldProgressionMap = new WorldProgressionMap();

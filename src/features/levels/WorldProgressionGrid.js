/**
 * WorldProgressionGrid
 * Renders the visual World Map nodes for Worlds 1-20, connecting paths,
 * lock statuses, and progress indicators.
 */

import { LevelProgressManager } from './LevelProgressManager.js';
import { LevelDataAdapter } from '../../adapters/LevelDataAdapter.js';

export class WorldProgressionGrid {
  /**
   * Render World Map nodes 1..20
   * @param {Array<Object>} allLevels
   * @param {Object} userProgress
   * @returns {string}
   */
  static renderWorldNodesHtml(allLevels, userProgress = {}) {
    const worlds = Array.from({ length: 20 }, (_, i) => i + 1);

    return worlds.map((worldNum) => {
      const worldStats = LevelProgressManager.calculateWorldStats(worldNum, allLevels, userProgress);
      const worldName = LevelDataAdapter.getWorldName(worldNum);

      // World 1 is unlocked. World N is unlocked if World N-1 has >= 60% completion or at least 1 completed
      const isUnlocked = worldNum === 1 || (worldStats.unlockedCount > 0);
      const isCompleted = worldStats.percentage === 100;

      return `
        <div 
          data-world-node="${worldNum}"
          class="glass-panel p-5 rounded-2xl border ${isUnlocked ? 'border-primary/40 hover:border-primary cursor-pointer hover:shadow-[0_0_25px_#4edea320]' : 'border-outline-variant/20 opacity-50 cursor-not-allowed'} transition-all flex flex-col justify-between group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-terminal-label font-terminal-label text-xs uppercase px-2 py-0.5 rounded ${isUnlocked ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-container-high text-on-surface-variant'}">
              Sector ${String(worldNum).padStart(2, '0')}
            </span>
            <div class="flex items-center gap-1 text-xs font-terminal-code ${isCompleted ? 'text-primary font-bold' : 'text-on-surface-variant'}">
              <span class="material-symbols-outlined text-[16px]">${isCompleted ? 'verified' : (isUnlocked ? 'lock_open' : 'lock')}</span>
              <span>${worldStats.percentage}%</span>
            </div>
          </div>

          <div>
            <h3 class="text-headline-sm font-bold text-on-surface text-lg group-hover:text-primary transition-colors">
              ${worldName}
            </h3>
            <p class="text-xs text-on-surface-variant font-terminal-code mt-1">
              Levels ${(worldNum - 1) * 12 + 1} - ${Math.min(250, worldNum * 13)}
            </p>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4 pt-3 border-t border-surface-variant/30">
            <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full transition-all duration-500" style="width: ${worldStats.percentage}%"></div>
            </div>
            <div class="flex justify-between items-center text-[10px] text-on-surface-variant font-terminal-code mt-1.5">
              <span>${worldStats.completedCount}/${worldStats.totalLevels} Completed</span>
              <span class="text-tertiary flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">star</span>
                ${worldStats.totalStars}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

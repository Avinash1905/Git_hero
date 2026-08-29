/**
 * LevelVictoryHandler
 * Manages level victory modal, star displays, XP rewards, and navigation to the next level.
 */

import { LevelNavigation } from '../levels/LevelNavigation.js';
import { levelStore } from '../../state/LevelStore.js';
import { playerStore } from '../../state/PlayerStore.js';
import { soundService } from '../../services/soundService.js';
import { progressService } from '../../services/progressService.js';

export class LevelVictoryHandler {
  /**
   * Render victory modal HTML
   * @param {Object} stats
   * @returns {string}
   */
  static renderVictoryModalHtml(stats) {
    const starCount = stats.stars || 3;
    const starsHtml = [1, 2, 3].map((s) => `
      <span class="material-symbols-outlined text-4xl ${s <= starCount ? 'text-tertiary drop-shadow-[0_0_12px_#ffb95f]' : 'text-outline-variant/40'}" style="font-variation-settings: 'FILL' ${s <= starCount ? 1 : 0};">
        star
      </span>
    `).join('');

    return `
      <div id="level-complete-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
        <canvas id="victory-confetti-canvas" class="absolute inset-0 pointer-events-none"></canvas>

        <div class="glass-panel w-full max-w-md rounded-2xl p-6 md:p-8 border border-primary/40 shadow-2xl relative overflow-hidden text-center z-10 animate-scale-up">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-terminal-label font-bold uppercase tracking-widest mb-3">
            <span class="material-symbols-outlined text-[14px]">verified</span>
            <span>Commit Verified</span>
          </div>

          <h2 class="text-headline-md font-headline-md text-on-surface font-bold">
            Sector Cleared!
          </h2>
          <p class="text-on-surface-variant text-sm font-terminal-code mt-1">
            Repository changes merged to origin successfully
          </p>

          <!-- Stars -->
          <div class="flex items-center justify-center gap-2 my-6">
            ${starsHtml}
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-2 bg-surface-container-lowest/80 p-3 rounded-xl border border-outline-variant/20 mb-6 font-terminal-code text-xs">
            <div>
              <div class="text-on-surface-variant/70 text-[10px] uppercase">Time</div>
              <div class="text-on-surface font-bold text-sm mt-0.5">${stats.time || '00:00'}</div>
            </div>
            <div>
              <div class="text-on-surface-variant/70 text-[10px] uppercase">Moves</div>
              <div class="text-primary font-bold text-sm mt-0.5">${stats.moves || 0}</div>
            </div>
            <div>
              <div class="text-on-surface-variant/70 text-[10px] uppercase">Score</div>
              <div class="text-secondary font-bold text-sm mt-0.5">${stats.score || 0}</div>
            </div>
          </div>

          <!-- XP Awarded Banner -->
          <div class="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between font-terminal-code">
            <span class="text-xs text-on-surface-variant">XP Awarded</span>
            <span class="text-primary font-bold text-sm">+${stats.xpAwarded || 500} XP</span>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2">
            <button 
              id="modal-next-btn" 
              class="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Next Sector</span>
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <button 
                id="modal-replay-btn" 
                class="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-terminal-label font-bold transition-colors cursor-pointer"
              >
                Replay Level
              </button>
              <button 
                id="modal-map-btn" 
                class="py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-terminal-label font-bold transition-colors cursor-pointer"
              >
                Sector Map
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Handle completion logic: persist progress, award XP, and play fanfare
   * @param {string|number} levelId
   * @param {Object} stats
   * @param {Function} onNavigate
   */
  static handleCompletion(levelId, stats, onNavigate) {
    soundService.playVictory();
    levelStore.completeLevel(levelId, stats);
    playerStore.addXp(stats.xpAwarded || 500);

    // Save to backend asynchronously
    progressService.saveProgress(levelId, stats).catch((err) => {
      console.warn('[LevelVictoryHandler] Progress save error:', err);
    });

    const modalHtml = this.renderVictoryModalHtml(stats);
    const existing = document.getElementById('level-complete-overlay');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Bind buttons
    document.getElementById('modal-next-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      const nextId = LevelNavigation.getNextLevelId(levelId);
      if (nextId) {
        onNavigate('gameplay', { levelId: nextId });
      } else {
        onNavigate('world-map');
      }
    });

    document.getElementById('modal-replay-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      onNavigate('gameplay', { levelId });
    });

    document.getElementById('modal-map-btn')?.addEventListener('click', () => {
      document.getElementById('level-complete-overlay')?.remove();
      onNavigate('world-map');
    });
  }
}

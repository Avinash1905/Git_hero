/**
 * LevelSelector
 * Faithful implementation of the Stitch 250-level selection screen.
 * Displays levels strictly numerically (1, 2, 3 ... 250), grouped by Worlds 1-20,
 * with search and difficulty filters, locked/unlocked state badges, and star displays.
 */

import { LevelDataAdapter } from '../../adapters/LevelDataAdapter.js';
import { LevelProgressManager } from './LevelProgressManager.js';
import { LevelMetadata } from './LevelMetadata.js';

export class LevelSelector {
  /**
   * Filter and sort level list according to user criteria
   * @param {Array<Object>} levels - All levels
   * @param {Object} criteria
   * @param {Object} userProgress
   * @returns {Array<Object>}
   */
  static filterLevels(levels, criteria = {}, userProgress = {}) {
    const { world, difficulty, search } = criteria;

    return levels
      .filter((lvl) => {
        const lvlWorld = lvl.world || LevelDataAdapter.calculateWorld(lvl.number);
        if (world && world !== 'ALL' && lvlWorld !== Number(world)) {
          return false;
        }

        if (difficulty && difficulty !== 'ALL' && lvl.difficulty?.toUpperCase() !== difficulty.toUpperCase()) {
          return false;
        }

        if (search) {
          const q = search.toLowerCase();
          const matchesName = (lvl.name || '').toLowerCase().includes(q);
          const matchesDesc = (lvl.description || '').toLowerCase().includes(q);
          const matchesId = String(lvl.id).includes(q) || String(lvl.number).includes(q);
          if (!matchesName && !matchesId && !matchesDesc) return false;
        }

        return true;
      })
      // Strictly numeric ordering: 1, 2, 3 ... 250
      .sort((a, b) => a.number - b.number)
      .map((lvl) => {
        const status = LevelProgressManager.getLevelStatus(lvl.id, userProgress);
        return {
          ...lvl,
          status,
          isUnlocked: status === 'UNLOCKED' || status === 'IN_PROGRESS' || status === 'COMPLETED',
          isCompleted: status === 'COMPLETED'
        };
      });
  }

  /**
   * Render the level selector HTML structure
   * @param {Array<Object>} levels
   * @param {Object} activeFilters
   * @param {Object} userProgress
   * @returns {string}
   */
  static renderSelectorHtml(levels, activeFilters = {}, userProgress = {}) {
    const filtered = this.filterLevels(levels, activeFilters, userProgress);
    const activeWorld = Number(activeFilters.world) || 1;

    const thumbnails = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGAUOrEHN-n9EDOreSZ-h2tgapD-taEQ68-ZSHNt25hyDugoQysKqhH6dGCudtsx56wTMY_totlbbam3Wju3juN9jfuk-wxCxFtXjbPKQwvqRWyjeXLXjw-T3jjJTat_z7io5tlB5kRkMdTt7gl2lB3d-gZ-R3qK7MlLlwqZNb26tFAO0_5HylAHe10wWDa7DEXZBJocNF_2Z7Kd8eAiAdH1I1YCLi5HxfMBmcodiiSt2Jq2KGB8U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVIOqfhUkqQRqZZ0eBKIYDhTz_8YDP_tbP1ZXG76PqKxkw-R4nRxnl_cJ8r7zhLmH2unGJZ0BGqERq2po3UekgP2UnY-KA7VeGtd5TdFf_C55pFkcoL0wTuO1JxUPRSPOgMcJPILrayDXuqa3C68-q7nuGWHllIdWTFoUiSMDn9VvSWo50232wQ-DibLJ2gmEzs4958IM68uiNsxeSzDlM0yUVRU7TO08CFZSvM4JgSw-idGG5tMo'
    ];

    const cardsHtml = filtered.map((lvl, index) => {
      const isUnlocked = lvl.isUnlocked;
      const isCompleted = lvl.isCompleted;
      const thumbUrl = thumbnails[index % thumbnails.length];
      const diffCfg = LevelMetadata.getDifficultyConfig(lvl.difficulty);

      const prog = userProgress[lvl.id] || userProgress[String(lvl.number)] || {};
      const starCount = isCompleted ? (prog.stars || 3) : 0;
      const starsHtml = [1, 2, 3].map(s => `
        <span class="material-symbols-outlined text-[16px] ${s <= starCount ? 'text-tertiary' : 'text-outline-variant'}" style="font-variation-settings: 'FILL' ${s <= starCount ? 1 : 0};">star</span>
      `).join('');

      return `
        <article 
          data-level-id="${lvl.id}" 
          data-unlocked="${isUnlocked ? 'true' : 'false'}"
          class="hud-panel rounded-xl overflow-hidden level-card relative group transition-all duration-200 ${isUnlocked ? 'cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_20px_#4edea330]' : 'opacity-60 cursor-not-allowed border border-outline-variant/20'}"
        >
          <div class="relative w-full aspect-video bg-surface-dim overflow-hidden">
            <img class="w-full h-full object-cover ${isCompleted ? 'opacity-80 group-hover:opacity-100' : (isUnlocked ? 'opacity-50 group-hover:opacity-80' : 'opacity-25 grayscale')} transition-all duration-300" alt="${lvl.name}" src="${thumbUrl}">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-80"></div>
            
            <div class="absolute top-sm right-sm">
              ${isCompleted ? `
                <span class="bg-primary text-on-primary px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold shadow-md flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">check</span> COMPLETED
                </span>
              ` : (isUnlocked ? `
                <span class="bg-secondary/20 text-secondary border border-secondary/40 px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold shadow-md">
                  AVAILABLE
                </span>
              ` : `
                <span class="bg-surface-container-high/80 text-on-surface-variant px-2.5 py-1 rounded text-terminal-label font-terminal-label flex items-center gap-1 border border-outline-variant/30">
                  <span class="material-symbols-outlined text-[14px]">lock</span> LOCKED
                </span>
              `)}
            </div>
            
            <div class="absolute bottom-sm left-sm font-terminal-label text-xs text-primary font-bold px-2 py-0.5 rounded bg-surface-container-lowest/80 border border-primary/20">
              #${lvl.id}
            </div>
          </div>
          
          <div class="p-md bg-surface-container/90 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="${diffCfg.color} ${diffCfg.bg} border ${diffCfg.border} text-[10px] px-2 py-0.5 rounded font-terminal-label font-bold">
                  ${diffCfg.label}
                </span>
                <div class="flex items-center gap-0.5">
                  ${starsHtml}
                </div>
              </div>
              
              <h3 class="text-on-surface font-headline-sm text-base font-bold truncate group-hover:text-primary transition-colors">
                ${lvl.name}
              </h3>
              
              <p class="text-on-surface-variant text-xs font-terminal-code line-clamp-2 mt-1 min-h-[32px]">
                ${lvl.description}
              </p>
            </div>
            
            <div class="mt-md pt-sm border-t border-surface-variant/40 flex items-center justify-between text-xs text-on-surface-variant font-terminal-code">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-tertiary">military_tech</span>
                <span>+${lvl.xpReward} XP</span>
              </span>
              <span class="flex items-center gap-1 text-secondary">
                <span class="material-symbols-outlined text-[16px]">commit</span>
                <span>${lvl.commitsReq} commits</span>
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // World buttons 1..20
    const worldPillsHtml = Array.from({ length: 20 }, (_, i) => i + 1).map(w => `
      <button 
        data-world-tab="${w}" 
        class="px-3 py-1.5 rounded-lg text-xs font-terminal-label transition-all cursor-pointer ${w === activeWorld ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-variant'}"
      >
        World ${w}
      </button>
    `).join('');

    return `
      <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 backdrop-blur-md mb-2">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span class="text-terminal-label font-terminal-label text-primary uppercase tracking-widest text-xs">Repository Sector Index</span>
            </div>
            <h1 class="text-headline-md font-headline-md text-on-surface font-bold">250 Levels Index</h1>
            <p class="text-on-surface-variant text-sm font-terminal-code">Explore 20 Worlds from foundational commands to multiverse architectures</p>
          </div>

          <!-- Search & Filter Controls -->
          <div class="flex items-center gap-2">
            <input 
              id="levels-search-input" 
              type="text" 
              placeholder="Search level or mechanic..." 
              value="${activeFilters.search || ''}"
              class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs font-terminal-code text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40"
            />
          </div>
        </div>

        <!-- World Selector Tabs (1..20) -->
        <div class="mb-6 overflow-x-auto scrollbar-thin pb-2 flex items-center gap-2">
          ${worldPillsHtml}
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${cardsHtml}
        </div>
      </main>
    `;
  }
}

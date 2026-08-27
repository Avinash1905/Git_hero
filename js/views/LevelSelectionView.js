/**
 * GitHero Level Selection View
 * Displays all 30+ handcrafted levels across the 6 worlds with strict numeric ordering and unlock states.
 */

import { LEVELS, WORLDS } from '../engine/Levels.js';
import { StorageService } from '../services/StorageService.js';

export function renderLevelSelectionView(selectedWorldId = null) {
  const userState = StorageService.load();
  const completedLevels = userState.progress.levels || {};

  const levelThumbnails = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAGAUOrEHN-n9EDOreSZ-h2tgapD-taEQ68-ZSHNt25hyDugoQysKqhH6dGCudtsx56wTMY_totlbbam3Wju3juN9jfuk-wxCxFtXjbPKQwvqRWyjeXLXjw-T3jjJTat_z7io5tlB5kRkMdTt7gl2lB3d-gZ-R3qK7MlLlwqZNb26tFAO0_5HylAHe10wWDa7DEXZBJocNF_2Z7Kd8eAiAdH1I1YCLi5HxfMBmcodiiSt2Jq2KGB8U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVIOqfhUkqQRqZZ0eBKIYDhTz_8YDP_tbP1ZXG76PqKxkw-R4nRxnl_cJ8r7zhLmH2unGJZ0BGqERq2po3UekgP2UnY-KA7VeGtd5TdFf_C55pFkcoL0wTuO1JxUPRSPOgMcJPILrayDXuqa3C68-q7nuGWHllIdWTFoUiSMDn9VvSWo50232wQ-DibLJ2gmEzs4958IM68uiNsxeSzDlM0yUVRU7TO08CFZSvM4JgSw-idGG5tMo'
  ];

  const allLevels = Object.values(LEVELS).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
  const filteredLevels = selectedWorldId ? allLevels.filter(lvl => lvl.world === parseInt(selectedWorldId, 10)) : allLevels;

  const worldFilterTabsHtml = `
    <div class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
      <button data-world-filter="all" class="px-4 py-1.5 rounded-lg text-xs font-terminal-label whitespace-nowrap transition-all ${!selectedWorldId ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}">
        ALL WORLDS (30)
      </button>
      ${WORLDS.map(w => `
        <button data-world-filter="${w.id}" class="px-4 py-1.5 rounded-lg text-xs font-terminal-label whitespace-nowrap transition-all ${selectedWorldId === String(w.id) ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}">
          WORLD ${w.id}: ${w.name.toUpperCase()}
        </button>
      `).join('')}
    </div>
  `;

  const cardsHtml = filteredLevels.map((lvl, index) => {
    const numId = parseInt(lvl.id, 10);
    const prevId = String(numId - 1).padStart(2, '0');
    
    // Level 01 is always unlocked. Others require previous level completed.
    const isUnlocked = numId === 1 || !!completedLevels[prevId]?.completed;
    const prog = completedLevels[lvl.id] || { completed: false, stars: 0 };
    const isCompleted = prog.completed;
    const thumbUrl = levelThumbnails[index % levelThumbnails.length];

    // Generate stars
    const starCount = isCompleted ? (prog.stars || 3) : 0;
    const starsHtml = [1, 2, 3].map(s => {
      if (s <= starCount) {
        return `<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">star</span>`;
      }
      return `<span class="material-symbols-outlined text-[16px] text-outline-variant" style="font-variation-settings: 'FILL' 0;">star</span>`;
    }).join('');

    // Difficulty badge color
    let diffBadgeColor = 'text-primary bg-primary/10 border-primary/30';
    if (lvl.difficulty === 'HARD') diffBadgeColor = 'text-tertiary bg-tertiary/10 border-tertiary/30';
    else if (lvl.difficulty === 'EXPERT') diffBadgeColor = 'text-secondary bg-secondary/10 border-secondary/30';
    else if (lvl.difficulty === 'MASTER' || lvl.difficulty === 'BOSS' || lvl.difficulty === 'GRANDMASTER') diffBadgeColor = 'text-error bg-error/10 border-error/30';

    return `
      <article 
        data-level-id="${lvl.id}" 
        data-unlocked="${isUnlocked ? 'true' : 'false'}"
        class="hud-panel rounded-xl overflow-hidden level-card relative group transition-all duration-200 ${isUnlocked ? 'cursor-pointer hover:scale-[1.03] hover:shadow-[0_0_20px_#4edea330]' : 'opacity-60 cursor-not-allowed border border-outline-variant/20'}"
      >
        <div class="relative w-full aspect-video bg-surface-dim overflow-hidden">
          <img class="w-full h-full object-cover ${isCompleted ? 'opacity-80 group-hover:opacity-100' : (isUnlocked ? 'opacity-50 group-hover:opacity-80' : 'opacity-25 grayscale')} transition-all duration-300" alt="${lvl.name}" src="${thumbUrl}">
          <div class="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-80"></div>
          
          <!-- Status Badge -->
          <div class="absolute top-sm right-sm">
            ${isCompleted ? `
              <span class="bg-primary text-on-primary px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold shadow-md flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">check</span> COMPLETED
              </span>
            ` : (isUnlocked ? `
              <span class="bg-surface-container-high/90 text-primary border border-primary/40 px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold backdrop-blur-md">
                UNLOCKED
              </span>
            ` : `
              <span class="bg-surface-dim/80 text-on-surface-variant px-2.5 py-1 rounded text-terminal-label font-terminal-label flex items-center gap-1 border border-outline-variant/30">
                <span class="material-symbols-outlined text-[14px]">lock</span> LOCKED
              </span>
            `)}
          </div>

          <!-- Level Number & World -->
          <div class="absolute bottom-sm left-sm z-10">
            <span class="text-terminal-label font-terminal-label text-primary font-bold tracking-widest text-xs uppercase">
              W${lvl.world} · LEVEL ${lvl.id}
            </span>
            <h3 class="text-headline-sm font-headline-sm text-on-surface text-base sm:text-lg font-bold">${lvl.name}</h3>
          </div>
        </div>

        <div class="p-md bg-surface-container flex flex-col justify-between h-36">
          <p class="text-on-surface-variant text-xs font-body-md line-clamp-2">${lvl.description}</p>
          
          <div class="flex items-center justify-between pt-sm border-t border-outline-variant/20 mt-auto">
            <div class="flex items-center space-x-1">
              ${starsHtml}
            </div>
            
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-terminal-label border ${diffBadgeColor}">
                ${lvl.difficulty}
              </span>
              <span class="text-secondary font-hud-stat text-xs font-bold">+${lvl.xpReward || 500} XP</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <main class="pt-24 pb-28 md:pb-12 px-hud-margin max-w-7xl mx-auto min-h-screen">
      <!-- Section Header -->
      <div class="mb-6">
        <div class="flex items-center gap-sm mb-xs">
          <span class="text-terminal-code font-terminal-code text-primary">~/levels/select<span class="cursor-blink inline-block w-2 h-4 bg-primary ml-1 align-middle"></span></span>
        </div>
        <h1 class="text-display-lg font-display-lg text-on-surface">Mission Partitions</h1>
        <p class="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">Traverse 30 progressively complex Git challenge partitions across 6 worlds.</p>
      </div>

      <!-- World Tabs -->
      ${worldFilterTabsHtml}

      <!-- Grid of Levels -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
        ${cardsHtml}
      </div>
    </main>
  `;
}

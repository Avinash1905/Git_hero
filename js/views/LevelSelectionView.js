// LevelSelectionView - 100% faithful to Stitch Level Selection Screen
// Strict Numeric Ordering & Progressive Unlocking System

import { LEVELS } from '../engine/Levels.js';
import { StorageService } from '../services/StorageService.js';

export function renderLevelSelectionView() {
  const userState = StorageService.load();
  const completedLevels = userState.progress.levels || {};

  const levelThumbnails = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAGAUOrEHN-n9EDOreSZ-h2tgapD-taEQ68-ZSHNt25hyDugoQysKqhH6dGCudtsx56wTMY_totlbbam3Wju3juN9jfuk-wxCxFtXjbPKQwvqRWyjeXLXjw-T3jjJTat_z7io5tlB5kRkMdTt7gl2lB3d-gZ-R3qK7MlLlwqZNb26tFAO0_5HylAHe10wWDa7DEXZBJocNF_2Z7Kd8eAiAdH1I1YCLi5HxfMBmcodiiSt2Jq2KGB8U',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAVIOqfhUkqQRqZZ0eBKIYDhTz_8YDP_tbP1ZXG76PqKxkw-R4nRxnl_cJ8r7zhLmH2unGJZ0BGqERq2po3UekgP2UnY-KA7VeGtd5TdFf_C55pFkcoL0wTuO1JxUPRSPOgMcJPILrayDXuqa3C68-q7nuGWHllIdWTFoUiSMDn9VvSWo50232wQ-DibLJ2gmEzs4958IM68uiNsxeSzDlM0yUVRU7TO08CFZSvM4JgSw-idGG5tMo'
  ];

  // Strictly sort levels numerically: 01, 02, 03, ... 16
  const sortedLevels = Object.values(LEVELS).sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

  const cardsHtml = sortedLevels.map((lvl, index) => {
    const numId = parseInt(lvl.id, 10);
    const prevId = String(numId - 1).padStart(2, '0');
    
    // Level 01 is always unlocked. Others require previous level completed.
    const isUnlocked = numId === 1 || !!completedLevels[prevId]?.completed;
    const prog = completedLevels[lvl.id] || { completed: false, stars: 0 };
    const isCompleted = prog.completed;
    const isActive = isUnlocked && !isCompleted;
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
            ` : (isActive ? `
              <span class="bg-secondary text-on-secondary px-2.5 py-1 rounded text-terminal-label font-terminal-label font-bold animate-pulse shadow-md flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">play_arrow</span> AVAILABLE
              </span>
            ` : `
              <span class="bg-surface-variant/90 text-on-surface-variant px-2.5 py-1 rounded text-terminal-label font-terminal-label border border-outline-variant/40 flex items-center gap-1 backdrop-blur-sm">
                <span class="material-symbols-outlined text-[14px]">lock</span> LOCKED
              </span>
            `)}
          </div>

          <!-- Difficulty Pill -->
          <div class="absolute bottom-sm left-sm">
            <span class="px-2 py-0.5 rounded text-[10px] font-terminal-label font-bold border ${diffBadgeColor}">
              ${lvl.difficulty}
            </span>
          </div>
        </div>

        <div class="p-md">
          <div class="flex justify-between items-start mb-2">
            <div>
              <span class="text-[10px] text-on-surface-variant font-terminal-label uppercase tracking-wider">World 0${lvl.world}</span>
              <h3 class="text-headline-sm font-headline-sm text-on-surface ${isUnlocked ? 'group-hover:text-primary' : ''} transition-colors">Level ${lvl.id}: ${lvl.name}</h3>
            </div>
            <div class="flex items-center gap-0.5">
              ${starsHtml}
            </div>
          </div>
          
          <p class="text-body-md font-body-md text-on-surface-variant text-sm line-clamp-2 mb-md">
            ${lvl.description}
          </p>

          <div class="flex justify-between items-center pt-sm border-t border-outline-variant/30 text-xs">
            <span class="text-terminal-label font-terminal-label text-tertiary font-bold">+${lvl.xpReward} XP</span>
            <span class="text-terminal-code font-terminal-code text-on-surface-variant">${lvl.commitsReq} commits req.</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  return `
    <main class="flex-1 p-hud-margin pt-24 pb-28 md:pb-12 max-w-7xl mx-auto min-h-screen">
      <header class="mb-lg">
        <div class="glass-panel inline-block px-4 py-2 rounded-lg border border-outline-variant/50 mb-4">
          <span class="text-terminal-label font-terminal-label text-on-surface-variant">path: </span>
          <span class="text-terminal-code font-terminal-code text-primary">~/levels/select<span class="cursor-blink inline-block w-2 h-4 bg-primary ml-1 align-middle"></span></span>
        </div>
        <h1 class="text-headline-md font-headline-md text-on-surface">Select Level</h1>
        <p class="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">Traverse 16 progressively complex Git challenge partitions. Solve puzzles to unlock advanced repositories.</p>
      </header>

      <!-- Level Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        ${cardsHtml}
      </div>
    </main>
  `;
}

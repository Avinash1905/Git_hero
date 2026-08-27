// DashboardView - 100% faithful to Stitch Dashboard Screen

import { StorageService } from '../services/StorageService.js';

export function renderDashboardView(onPlayLevel, onOpenDaily, onOpenWorld) {
  const userState = StorageService.load();
  const xpFormatted = (userState.player.xp / 1000).toFixed(1) + 'k';
  const completedLevels = userState.player.completedLevelsCount || 104;

  return `
    <main class="pt-24 pb-24 md:pb-8 px-hud-margin max-w-7xl mx-auto min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-lg mx-auto">
        <!-- Dashboard Header -->
        <div class="col-span-1 lg:col-span-12 mb-md">
          <h1 class="text-headline-md font-headline-md text-on-surface">Dashboard</h1>
          <p class="text-on-surface-variant mt-sm">Welcome back, Player. Ready to resolve some conflicts?</p>
        </div>

        <!-- Left Column: Primary Focus -->
        <div class="col-span-1 lg:col-span-8 flex flex-col gap-lg">
          <!-- Continue Level Card -->
          <section id="dash-continue-card" class="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden shadow-lg relative group cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
            <div class="h-48 relative overflow-hidden">
              <div class="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-300 z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none"></div>
              <img class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" alt="Level 07 Preview" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVIOqfhUkqQRqZZ0eBKIYDhTz_8YDP_tbP1ZXG76PqKxkw-R4nRxnl_cJ8r7zhLmH2unGJZ0BGqERq2po3UekgP2UnY-KA7VeGtd5TdFf_C55pFkcoL0wTuO1JxUPRSPOgMcJPILrayDXuqa3C68-q7nuGWHllIdWTFoUiSMDn9VvSWo50232wQ-DibLJ2gmEzs4958IM68uiNsxeSzDlM0yUVRU7TO08CFZSvM4JgSw-idGG5tMo">
              
              <div class="absolute top-md left-md z-20 flex gap-sm">
                <span class="px-2 py-1 bg-surface-container-highest/90 text-primary text-terminal-label font-terminal-label rounded backdrop-blur-md border border-primary/30 uppercase tracking-widest">Active</span>
                <span class="px-2 py-1 bg-surface-container-highest/90 text-on-surface-variant text-terminal-label font-terminal-label rounded backdrop-blur-md border border-outline-variant/50">Level 07</span>
              </div>
            </div>

            <div class="p-lg relative z-20 bg-surface-container border-t border-outline-variant/30">
              <div class="flex justify-between items-end">
                <div>
                  <h2 class="text-headline-sm font-headline-sm text-on-surface mb-xs">Merge Conflict Substation</h2>
                  <p class="text-on-surface-variant text-body-md">Resolve the divergent branches before the main trunk collapses.</p>
                </div>
                <button id="dash-play-btn" class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center pulse-glow group-hover:bg-primary-container transition-colors shadow-lg">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                </button>
              </div>

              <div class="mt-md flex items-center gap-md">
                <div class="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div class="h-full w-3/4 bg-secondary"></div>
                </div>
                <span class="text-terminal-label font-terminal-label text-secondary">75% Complete</span>
              </div>
            </div>
          </section>

          <!-- Current World Progress -->
          <section id="dash-world-progress" class="bg-surface-container rounded-xl border border-outline-variant/50 p-lg shadow-lg cursor-pointer hover:border-primary/40 transition-colors">
            <div class="flex justify-between items-center mb-md">
              <h3 class="text-headline-sm font-headline-sm text-on-surface flex items-center gap-sm">
                <span class="material-symbols-outlined text-primary">map</span> 
                Commit Canyon
              </h3>
              <span class="text-terminal-label font-terminal-label text-on-surface-variant">World 2 of 5</span>
            </div>

            <div class="relative py-xl">
              <!-- Connection Line -->
              <div class="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-outline-variant/50 -translate-y-1/2 z-0"></div>
              <div class="absolute top-1/2 left-0 w-2/3 h-0.5 bg-primary -translate-y-1/2 z-0"></div>

              <!-- Nodes -->
              <div class="flex justify-between items-center relative z-10 px-md">
                <div class="flex flex-col items-center gap-sm">
                  <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_#4edea340]">
                    <span class="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                  </div>
                  <span class="text-terminal-label font-terminal-label text-on-surface-variant">Lvl 04</span>
                </div>

                <div class="flex flex-col items-center gap-sm">
                  <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_#4edea340]">
                    <span class="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                  </div>
                  <span class="text-terminal-label font-terminal-label text-on-surface-variant">Lvl 05</span>
                </div>

                <div class="flex flex-col items-center gap-sm">
                  <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_#4edea340]">
                    <span class="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                  </div>
                  <span class="text-terminal-label font-terminal-label text-on-surface-variant">Lvl 06</span>
                </div>

                <div class="flex flex-col items-center gap-sm">
                  <div class="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center pulse-glow">
                    <div class="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <span class="text-terminal-label font-terminal-label text-primary font-bold">Lvl 07</span>
                </div>

                <div class="flex flex-col items-center gap-sm opacity-50">
                  <div class="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                    <div class="w-2 h-2 bg-outline-variant rounded-full"></div>
                  </div>
                  <span class="text-terminal-label font-terminal-label text-on-surface-variant">Boss</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column: Secondary Info & Stats -->
        <div class="col-span-1 lg:col-span-4 flex flex-col gap-lg">
          <!-- Stats Summary Bento -->
          <div class="grid grid-cols-2 gap-md">
            <div class="bg-surface-container rounded-xl border border-outline-variant/50 p-md flex flex-col justify-between">
              <span class="text-terminal-label font-terminal-label text-on-surface-variant mb-sm">Total XP</span>
              <div class="text-headline-md font-headline-md text-tertiary">${xpFormatted}</div>
              <div class="mt-sm flex gap-1">
                <div class="h-1 flex-1 bg-tertiary rounded"></div>
                <div class="h-1 flex-1 bg-tertiary rounded"></div>
                <div class="h-1 flex-1 bg-tertiary/20 rounded"></div>
              </div>
            </div>

            <div class="bg-surface-container rounded-xl border border-outline-variant/50 p-md flex flex-col justify-between">
              <span class="text-terminal-label font-terminal-label text-on-surface-variant mb-sm">Levels</span>
              <div class="text-headline-md font-headline-md text-secondary">${completedLevels}</div>
              <div class="mt-sm text-terminal-label font-terminal-label text-secondary">+3 this week</div>
            </div>
          </div>

          <!-- Daily Challenge -->
          <section id="dash-daily-card" class="bg-surface-container rounded-xl border border-outline-variant/50 p-md relative overflow-hidden group cursor-pointer hover:border-tertiary/50 transition-colors">
            <div class="absolute inset-0 bg-gradient-to-br from-tertiary-container/10 to-transparent z-0 pointer-events-none"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-sm mb-md">
                <span class="material-symbols-outlined text-tertiary fill-icon">local_fire_department</span>
                <span class="text-terminal-label font-terminal-label text-tertiary uppercase tracking-widest">Daily Challenge</span>
              </div>
              <h4 class="text-headline-sm font-headline-sm text-on-surface mb-xs">Rebase Race</h4>
              <p class="text-on-surface-variant text-body-md mb-md text-sm">Complete 3 rebase puzzles under 2 minutes each.</p>
              <div class="flex justify-between items-center bg-surface-container-highest rounded p-sm border border-outline-variant/30">
                <span class="text-terminal-label font-terminal-label text-on-surface">Reward: 500 XP</span>
                <span class="px-2 py-1 bg-surface-variant text-on-surface-variant text-terminal-label font-terminal-label rounded">0/3</span>
              </div>
            </div>
          </section>

          <!-- Statistics Line Graph (Mockup) -->
          <section class="bg-surface-container rounded-xl border border-outline-variant/50 p-md flex-1">
            <div class="flex justify-between items-center mb-md">
              <span class="text-terminal-label font-terminal-label text-on-surface-variant">Activity</span>
              <span class="material-symbols-outlined text-on-surface-variant text-sm">more_horiz</span>
            </div>
            <div class="h-32 flex items-end justify-between gap-1 relative border-b border-outline-variant/30 pb-2">
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 30%"></div>
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 50%"></div>
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 40%"></div>
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 80%"></div>
              <div class="w-full bg-secondary rounded-t relative" style="height: 65%">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-surface text-secondary text-xs px-1 rounded border border-secondary/50">Today</div>
              </div>
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 20%"></div>
              <div class="w-full bg-surface-container-highest rounded-t hover:bg-secondary transition-colors" style="height: 45%"></div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-on-surface-variant font-terminal-label">
              <span>Mon</span>
              <span>Sun</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  `;
}

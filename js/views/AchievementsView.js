// AchievementsView - 100% faithful to Stitch Achievements Screen

import { StorageService } from '../services/StorageService.js';

export function renderAchievementsView() {
  const userState = StorageService.load();
  const achievements = userState.achievements || [];

  const cardsHtml = achievements.map(ach => {
    if (ach.unlocked) {
      return `
        <article class="glass-panel rounded-xl p-md flex flex-col gap-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div class="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500 pointer-events-none"></div>
          
          <header class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-primary/40 glow-box text-primary">
              <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">${ach.icon}</span>
            </div>
            <span class="font-terminal-label text-terminal-label text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">UNLOCKED</span>
          </header>

          <div>
            <h2 class="font-headline-sm text-headline-sm text-on-surface mb-unit">${ach.title}</h2>
            <p class="font-body-md text-body-md text-on-surface-variant text-sm">${ach.desc}</p>
          </div>

          <footer class="mt-auto pt-sm border-t border-outline-variant/20 flex justify-between items-center">
            <span class="font-terminal-code text-terminal-code text-primary text-xs">Reward: +${ach.xp} XP</span>
            <span class="font-terminal-label text-terminal-label text-on-surface-variant opacity-50 text-xs">${ach.date || 'UNLOCKED'}</span>
          </footer>
        </article>
      `;
    }

    const progressPct = ach.maxProgress ? Math.floor((ach.progress / ach.maxProgress) * 100) : 0;

    return `
      <article class="glass-panel rounded-xl p-md flex flex-col gap-sm relative overflow-hidden cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity">
        <header class="flex justify-between items-start">
          <div class="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface-variant">
            <span class="material-symbols-outlined text-on-surface-variant">${ach.icon}</span>
          </div>
          <span class="font-terminal-label text-terminal-label text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded border border-outline-variant/30">LOCKED</span>
        </header>

        <div>
          <h2 class="font-headline-sm text-headline-sm text-on-surface/60 mb-unit">${ach.title}</h2>
          <p class="font-body-md text-body-md text-on-surface-variant/70 text-sm">${ach.desc}</p>
        </div>

        ${ach.maxProgress ? `
          <div class="mt-sm">
            <div class="w-full bg-surface-container-high rounded-full h-1.5 mb-1">
              <div class="bg-primary/50 h-1.5 rounded-full" style="width: ${progressPct}%"></div>
            </div>
            <span class="font-terminal-label text-terminal-label text-on-surface-variant/70 text-[10px]">${ach.progress} / ${ach.maxProgress} COMPLETED</span>
          </div>
        ` : ''}

        <footer class="mt-auto pt-sm border-t border-outline-variant/20">
          <span class="font-terminal-code text-terminal-code text-on-surface-variant/50 text-xs">Reward: +${ach.xp} XP</span>
        </footer>
      </article>
    `;
  }).join('');

  return `
    <main class="pt-24 pb-28 md:pb-12 px-hud-margin max-w-7xl mx-auto min-h-screen">
      <!-- Header -->
      <header class="mb-lg">
        <h1 class="font-display-lg text-display-lg text-on-surface mb-unit">Achievements</h1>
        <p class="font-terminal-code text-terminal-code text-on-surface-variant">~/githero/achievements</p>
        
        <div class="mt-md flex items-center gap-md">
          <div class="flex flex-col">
            <span class="font-terminal-label text-terminal-label text-on-surface-variant">TOTAL UNLOCKED</span>
            <span class="font-hud-stat text-hud-stat text-primary">3/7</span>
          </div>
          <div class="h-8 w-px bg-outline-variant/30"></div>
          <div class="flex flex-col">
            <span class="font-terminal-label text-terminal-label text-on-surface-variant">COMPLETION</span>
            <span class="font-hud-stat text-hud-stat text-secondary">43%</span>
          </div>
        </div>
      </header>

      <!-- Achievements Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        ${cardsHtml}
      </div>
    </main>
  `;
}

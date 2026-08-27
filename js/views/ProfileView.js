// ProfileView - 100% faithful to Stitch Player Profile Screen

import { StorageService } from '../services/StorageService.js';

export function renderProfileView() {
  const userState = StorageService.load();
  const player = userState.player;

  return `
    <main class="flex-1 p-hud-margin pt-24 pb-28 md:pb-12 max-w-5xl mx-auto min-h-screen">
      <!-- Player Header Banner -->
      <section class="glass-panel rounded-2xl p-lg md:p-xl flex flex-col md:flex-row items-center gap-lg mb-lg border border-outline-variant/40 shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent pointer-events-none"></div>

        <div class="relative">
          <div class="w-28 h-28 rounded-full border-2 border-primary glow-primary overflow-hidden shadow-xl">
            <img class="w-full h-full object-cover" alt="Avatar" src="${player.avatar}">
          </div>
          <div class="absolute -bottom-2 -right-2 bg-primary text-on-primary text-[10px] font-terminal-label font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            LVL 4
          </div>
        </div>

        <div class="flex-1 text-center md:text-left">
          <h1 class="text-headline-md font-headline-md text-on-surface mb-xs font-bold">${player.username}</h1>
          <p class="text-terminal-code font-terminal-code text-primary mb-md">${player.title}</p>
          
          <!-- XP Bar -->
          <div class="w-full max-w-md bg-surface-container-lowest rounded-full h-4 border border-outline-variant/30 overflow-hidden relative mx-auto md:mx-0">
            <div class="bg-gradient-to-r from-secondary-container to-secondary h-full rounded-full" style="width: 75%;"></div>
            <div class="absolute inset-0 flex justify-between px-1 pointer-events-none">
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
              <div class="w-px h-full bg-surface-container-lowest/50"></div>
            </div>
          </div>
          <div class="flex justify-between max-w-md mt-1 text-terminal-label font-terminal-label text-on-surface-variant mx-auto md:mx-0 text-xs">
            <span>XP: ${(player.xp).toLocaleString()}</span>
            <span>Next: 15,000</span>
          </div>
        </div>
      </section>

      <!-- Bento Grid Stats -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <div class="glass-panel rounded-xl p-md flex flex-col justify-center items-center text-center">
          <span class="material-symbols-outlined text-tertiary text-4xl mb-sm" style="font-variation-settings: 'FILL' 1;">military_tech</span>
          <h3 class="text-terminal-label font-terminal-label text-on-surface-variant mb-xs">Completed Levels</h3>
          <p class="text-display-lg font-display-lg text-on-surface">${player.completedLevelsCount}</p>
        </div>

        <div class="glass-panel rounded-xl p-md flex flex-col justify-center items-center text-center">
          <span class="material-symbols-outlined text-primary text-4xl mb-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
          <h3 class="text-terminal-label font-terminal-label text-on-surface-variant mb-xs">Perfect Clears</h3>
          <p class="text-display-lg font-display-lg text-on-surface">${player.perfectClears}</p>
        </div>

        <div class="glass-panel rounded-xl p-md flex flex-col justify-center items-center text-center">
          <span class="material-symbols-outlined text-secondary text-4xl mb-sm">bug_report</span>
          <h3 class="text-terminal-label font-terminal-label text-on-surface-variant mb-xs">Bugs Squashed</h3>
          <p class="text-display-lg font-display-lg text-on-surface">${player.bugsSquashed}</p>
        </div>
      </section>

      <!-- Command Frequency & Badges -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <!-- Command Frequency Chart -->
        <div class="glass-panel rounded-xl p-md">
          <div class="flex items-center justify-between mb-md border-b border-outline-variant/30 pb-sm">
            <h2 class="text-headline-sm font-headline-sm text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary">bar_chart</span> Command Usage
            </h2>
          </div>
          <div class="space-y-sm">
            <div class="flex items-center gap-sm">
              <span class="text-terminal-code font-terminal-code text-on-surface-variant w-28 text-xs">git commit</span>
              <div class="flex-grow bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
                <div class="bg-primary h-full rounded-full" style="width: 85%;"></div>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface w-12 text-right text-xs">85%</span>
            </div>

            <div class="flex items-center gap-sm">
              <span class="text-terminal-code font-terminal-code text-on-surface-variant w-28 text-xs">git push</span>
              <div class="flex-grow bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
                <div class="bg-secondary h-full rounded-full" style="width: 65%;"></div>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface w-12 text-right text-xs">65%</span>
            </div>

            <div class="flex items-center gap-sm">
              <span class="text-terminal-code font-terminal-code text-on-surface-variant w-28 text-xs">git status</span>
              <div class="flex-grow bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
                <div class="bg-tertiary h-full rounded-full" style="width: 95%;"></div>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface w-12 text-right text-xs">95%</span>
            </div>

            <div class="flex items-center gap-sm">
              <span class="text-terminal-code font-terminal-code text-on-surface-variant w-28 text-xs">git switch</span>
              <div class="flex-grow bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
                <div class="bg-primary-container h-full rounded-full" style="width: 40%;"></div>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface w-12 text-right text-xs">40%</span>
            </div>

            <div class="flex items-center gap-sm">
              <span class="text-terminal-code font-terminal-code text-on-surface-variant w-28 text-xs">git pull</span>
              <div class="flex-grow bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
                <div class="bg-error h-full rounded-full" style="width: 35%;"></div>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface w-12 text-right text-xs">35%</span>
            </div>
          </div>
        </div>

        <!-- Badges Showcase -->
        <div class="glass-panel rounded-xl p-md">
          <div class="flex items-center justify-between mb-md border-b border-outline-variant/30 pb-sm">
            <h2 class="text-headline-sm font-headline-sm text-on-surface flex items-center gap-sm">
              <span class="material-symbols-outlined text-tertiary">emoji_events</span> Badges Showcase
            </h2>
          </div>
          <div class="grid grid-cols-3 gap-sm">
            <div class="bg-surface-container p-sm rounded-lg flex flex-col items-center text-center border border-outline-variant/20 hover:border-primary/50 transition-colors">
              <div class="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-xs text-primary glow-box">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">merge_type</span>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface text-[10px]">Merge Master</span>
            </div>

            <div class="bg-surface-container p-sm rounded-lg flex flex-col items-center text-center border border-outline-variant/20 hover:border-secondary/50 transition-colors">
              <div class="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mb-xs text-secondary glow-secondary">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">speed</span>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface text-[10px]">Speed Demon</span>
            </div>

            <div class="bg-surface-container p-sm rounded-lg flex flex-col items-center text-center border border-outline-variant/20 hover:border-tertiary/50 transition-colors">
              <div class="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-xs text-tertiary glow-amber">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">military_tech</span>
              </div>
              <span class="text-terminal-label font-terminal-label text-on-surface text-[10px]">Grandmaster</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

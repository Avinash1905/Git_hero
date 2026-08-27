// WorldMapView - 100% faithful to Stitch World Map Screen

import { StorageService } from '../services/StorageService.js';

export function renderWorldMapView(onSelectWorld) {
  const userState = StorageService.load();
  const xp = (userState.player.xp || 1240).toLocaleString();

  return `
    <main class="relative w-full h-screen pt-16 md:pb-0 pb-20 overflow-hidden flex items-center justify-center z-10 bg-[#081425]">
      <!-- Background grid pattern -->
      <div class="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>

      <!-- Map Container -->
      <div class="relative w-[1200px] h-[800px] scale-50 sm:scale-65 md:scale-75 lg:scale-100 transition-transform duration-500 origin-center">
        <!-- Connection Lines (SVG) -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <!-- Foundations to Push/Pull -->
          <line class="stroke-primary stroke-[3px]" x1="200" x2="400" y1="600" y2="450"></line>
          <!-- Push/Pull to Commit Canyon -->
          <line class="stroke-primary stroke-[3px]" x1="400" x2="650" y1="450" y2="550"></line>
          <!-- Commit Canyon to Switch Station -->
          <line class="stroke-outline-variant stroke-[2px] map-line" x1="650" x2="850" y1="550" y2="350"></line>
          <!-- Switch Station to Mastery Mountains -->
          <line class="stroke-outline-variant stroke-[2px] map-line" x1="850" x2="1050" y1="350" y2="200"></line>
        </svg>

        <!-- Node 1: Foundations (Completed) -->
        <div id="node-world-1" class="absolute left-[180px] top-[580px] group cursor-pointer" title="World 1: Foundations">
          <div class="w-10 h-10 rounded-full bg-primary-container border-2 border-primary flex items-center justify-center shadow-[0_0_15px_#10b98140] group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-on-primary-container text-[20px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <div class="mt-2 text-center w-32 -ml-11">
            <p class="text-terminal-label font-terminal-label text-primary">Foundations</p>
            <p class="text-xs text-on-surface-variant font-terminal-code">100% Sync</p>
          </div>
        </div>

        <!-- Node 2: Push & Pull Valley (Completed) -->
        <div id="node-world-2" class="absolute left-[380px] top-[430px] group cursor-pointer" title="World 2: Push & Pull Valley">
          <div class="w-10 h-10 rounded-full bg-primary-container border-2 border-primary flex items-center justify-center shadow-[0_0_15px_#10b98140] group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined text-on-primary-container text-[20px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <div class="mt-2 text-center w-40 -ml-14">
            <p class="text-terminal-label font-terminal-label text-primary">Push & Pull Valley</p>
            <p class="text-xs text-on-surface-variant font-terminal-code">100% Sync</p>
          </div>
        </div>

        <!-- Node 3: Commit Canyon (Current Active) -->
        <div id="node-world-3" class="absolute left-[630px] top-[530px] group cursor-pointer z-20" title="World 3: Commit Canyon">
          <div class="w-12 h-12 rounded-full bg-surface-container border-2 border-primary flex items-center justify-center pulse-node shadow-[0_0_25px_#4edea360]">
            <span class="material-symbols-outlined text-primary text-[24px]">adjust</span>
          </div>
          <!-- Active Indicator Pin -->
          <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-container-high border border-outline-variant px-3 py-1 rounded-md shadow-lg flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-on-surface whitespace-nowrap">HEAD</span>
          </div>
          <div class="mt-2 text-center w-36 -ml-12">
            <p class="text-terminal-label font-terminal-label text-on-surface font-bold shadow-sm">Commit Canyon</p>
            <p class="text-xs text-primary font-terminal-code">In Progress</p>
          </div>
        </div>

        <!-- Node 4: Switch Station (Locked) -->
        <div id="node-world-4" class="absolute left-[830px] top-[330px] group cursor-not-allowed opacity-60" title="World 4: Switch Station (Locked)">
          <div class="w-10 h-10 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center">
            <span class="material-symbols-outlined text-outline text-[20px]">lock</span>
          </div>
          <div class="mt-2 text-center w-36 -ml-12">
            <p class="text-terminal-label font-terminal-label text-outline-variant">Switch Station</p>
            <p class="text-xs text-outline-variant font-terminal-code">Locked</p>
          </div>
        </div>

        <!-- Node 5: Mastery Mountains (Locked) -->
        <div id="node-world-5" class="absolute left-[1030px] top-[180px] group cursor-not-allowed opacity-60" title="World 5: Mastery Mountains (Locked)">
          <div class="w-10 h-10 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center">
            <span class="material-symbols-outlined text-outline text-[20px]">lock</span>
          </div>
          <div class="mt-2 text-center w-40 -ml-14">
            <p class="text-terminal-label font-terminal-label text-outline-variant">Mastery Mountains</p>
            <p class="text-xs text-outline-variant font-terminal-code">Locked</p>
          </div>
        </div>
      </div>

      <!-- HUD: Terminal Status (Bottom Left) -->
      <div class="absolute bottom-hud-margin left-hud-margin w-80 bg-surface-container/80 backdrop-blur-xl border border-surface-variant rounded-lg p-md hidden md:flex flex-col gap-2 z-20 shadow-lg">
        <div class="flex items-center gap-2 border-b border-surface-variant pb-2">
          <span class="material-symbols-outlined text-primary text-[16px]">terminal</span>
          <span class="text-terminal-label font-terminal-label text-on-surface-variant">System Status</span>
        </div>
        <div class="font-terminal-code text-terminal-code text-sm">
          <p class="text-primary">&gt; git status</p>
          <p class="text-on-surface-variant">On branch main</p>
          <p class="text-on-surface-variant">Your branch is up to date with 'origin/main'.</p>
          <p class="text-secondary mt-1">Ready to explore new nodes.</p>
          <span class="inline-block w-2 h-4 bg-primary animate-pulse align-middle mt-1"></span>
        </div>
      </div>

      <!-- HUD: XP/Stats (Top Left under Nav) -->
      <div class="absolute top-20 left-hud-margin bg-surface-container/80 backdrop-blur-xl border border-surface-variant rounded-lg p-sm hidden md:flex flex-col gap-1 z-20 shadow-lg min-w-[200px]">
        <div class="flex justify-between items-end mb-1">
          <span class="text-terminal-label font-terminal-label text-on-surface-variant">LVL 4</span>
          <span class="text-hud-stat font-hud-stat text-on-surface">${xp} XP</span>
        </div>
        <!-- Progress Bar -->
        <div class="flex gap-1">
          <div class="h-2 flex-1 bg-secondary rounded-sm"></div>
          <div class="h-2 flex-1 bg-secondary rounded-sm"></div>
          <div class="h-2 flex-1 bg-secondary rounded-sm"></div>
          <div class="h-2 flex-1 bg-surface-variant rounded-sm"></div>
          <div class="h-2 flex-1 bg-surface-variant rounded-sm"></div>
        </div>
      </div>
    </main>
  `;
}

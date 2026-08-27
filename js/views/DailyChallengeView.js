// DailyChallengeView - 100% faithful to Stitch Daily Challenge Screen

import { MockBackend } from '../services/MockBackend.js';

export function renderDailyChallengeView(onStartChallenge) {
  const challenge = MockBackend.getDailyChallenge();

  // Generate 8x8 Preview Grid Cells
  let previewGridCells = '';
  for (let i = 0; i < 64; i++) {
    let cls = "grid-tile rounded-sm ";
    if (i === 27 || i === 35) {
      cls += "bg-tertiary/20 border-tertiary/50 "; // hazards
    } else if (i === 63) {
      cls += "bg-primary/20 border-primary/50 glow-primary "; // goal
    } else if (i === 0) {
      cls += "bg-secondary/40 border-secondary "; // player start
    } else if (i === 18 || i === 45) {
      cls += "bg-surface-variant "; // firewall wall
    } else {
      cls += "bg-surface-container-low ";
    }
    previewGridCells += `<div class="${cls}"></div>`;
  }

  return `
    <main class="pt-24 pb-32 px-hud-margin max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg relative min-h-screen">
      <!-- Left/Main Column: Challenge Arena -->
      <div class="lg:col-span-8 flex flex-col gap-lg relative z-10">
        <!-- Hero Header -->
        <div class="bg-surface-container-high/60 backdrop-blur-md rounded-xl border border-outline-variant/30 p-lg relative overflow-hidden shadow-2xl">
          <div class="absolute inset-0 bg-gradient-to-br from-tertiary-container/10 to-transparent pointer-events-none"></div>
          <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-tertiary-container text-on-tertiary-container px-2 py-1 rounded text-terminal-label font-terminal-label flex items-center gap-1 glow-amber">
                  <span class="material-symbols-outlined text-[14px]">warning</span> ${challenge.difficulty}
                </span>
                <span class="text-tertiary text-terminal-label font-terminal-label font-bold tracking-widest">:: DAILY_CRON_JOB</span>
              </div>
              <h1 class="text-display-lg font-display-lg text-on-surface">${challenge.title}</h1>
              <p class="text-on-surface-variant font-body-md text-body-md mt-sm max-w-xl">
                ${challenge.description}
              </p>
            </div>
            <div class="flex flex-col items-end text-right">
              <span class="text-terminal-label font-terminal-label text-on-surface-variant mb-1">TIME REMAINING</span>
              <div id="daily-timer-box" class="text-headline-md font-headline-md text-tertiary-fixed font-mono flex items-center gap-2 glow-amber px-4 py-2 bg-surface-dim rounded-lg border border-tertiary-container/50">
                <span class="material-symbols-outlined text-tertiary">timer</span>
                ${challenge.timeRemaining}
              </div>
            </div>
          </div>
        </div>

        <!-- Puzzle Preview & Action Area -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <!-- Preview Canvas -->
          <div class="bg-surface-container border border-outline-variant/20 rounded-xl p-md flex flex-col justify-between aspect-square md:aspect-auto">
            <div class="text-terminal-label font-terminal-label text-on-surface-variant mb-md flex justify-between">
              <span>&gt; ./preview --map</span>
              <span class="text-secondary">GRID_SIZE: ${challenge.gridSize}</span>
            </div>
            <!-- Abstract Grid Representation -->
            <div class="flex-grow grid grid-cols-8 grid-rows-8 gap-[1px] bg-surface-dim p-[2px] rounded border border-outline-variant/10 min-h-[260px]">
              ${previewGridCells}
            </div>
          </div>

          <!-- Challenge Details & Start -->
          <div class="bg-surface-container border border-outline-variant/20 rounded-xl p-md flex flex-col justify-between">
            <div class="space-y-md">
              <div class="text-terminal-label font-terminal-label text-on-surface-variant border-b border-outline-variant/30 pb-sm">
                SYSTEM CONSTRAINTS
              </div>
              <ul class="space-y-sm text-sm font-terminal-code text-on-surface">
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Max Commits: 3 Allowed
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Memory Obstacles: Active
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-primary">✓</span> Time Limit: 120 Seconds
                </li>
              </ul>

              <div class="text-terminal-label font-terminal-label text-on-surface-variant border-b border-outline-variant/30 pb-sm pt-sm">
                COMPLETION REWARDS
              </div>
              <div class="bg-surface-container-highest/80 p-sm rounded-lg border border-primary/30 flex items-center justify-between">
                <span class="text-primary font-terminal-label text-sm">+${challenge.rewardXP} XP</span>
                <span class="text-xs text-on-surface-variant font-terminal-code">Daily Streak +1</span>
              </div>
            </div>

            <button id="start-daily-btn" class="w-full mt-lg py-md bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-[1.02] transition-transform duration-200 shadow-[0_0_20px_rgba(78,222,163,0.4)] btn-shimmer">
              [LAUNCH DAILY CHALLENGE]
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Briefing Log -->
      <div class="lg:col-span-4 flex flex-col gap-md">
        <div class="glass-panel rounded-xl p-md flex-1">
          <div class="text-terminal-label font-terminal-label text-on-surface-variant mb-md flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">terminal</span>
            MISSION BRIEFING
          </div>
          <div class="font-terminal-code text-xs text-on-surface space-y-2">
            <p class="text-primary">&gt; status check</p>
            <p class="text-on-surface-variant">System memory leak detected in block 0x89A.</p>
            <p class="text-tertiary">Warning: Divergent pointers will cause stack overflow.</p>
            <p class="text-on-surface-variant">Resolve memory conflicts and commit the state before the countdown expires.</p>
          </div>
        </div>
      </div>
    </main>
  `;
}

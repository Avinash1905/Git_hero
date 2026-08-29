/**
 * DuelPage
 * Master workbench for operative time-trial duels and ghost replays.
 */

import { DuelChallengeSystem } from '../features/multiplayer/DuelChallengeSystem.js';

export function renderDuelPage() {
  const duel = new DuelChallengeSystem();
  const html = duel.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Asynchronous Time Trials</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Sector Ghost Duels
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Compete against recorded operative telemetry ghosts in sub-second precision speedruns
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

/**
 * WorldMapPage
 * Displays the visual sector map of Worlds 1-20 with completion paths and unlock states.
 */

import { levelStore } from '../state/LevelStore.js';
import { WorldProgressionGrid } from '../features/levels/WorldProgressionGrid.js';

export function renderWorldMapPage() {
  const { levels, progress } = levelStore.getState();
  const nodesHtml = WorldProgressionGrid.renderWorldNodesHtml(levels, progress);

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Planetary Sector Grid</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            20 Designed Worlds
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Navigate the git topology across 20 distinct system sectors
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${nodesHtml}
      </div>
    </main>
  `;
}

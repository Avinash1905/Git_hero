/**
 * StashPage
 * Master workbench for stashing working tree modifications.
 */

import { StashCabinet } from '../features/stash/StashCabinet.js';

export function renderStashPage() {
  const cabinet = new StashCabinet();
  const html = cabinet.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Workspace Memory Buffer</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Stash Cabinet
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Temporarily shelter dirty working tree modifications without generating permanent commits
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

/**
 * CherryPickPage
 * Master workbench for cross-branch cherry-picking operations.
 */

import { CherryPickWorkbench } from '../features/cherrypick/CherryPickWorkbench.js';

export function renderCherryPickPage() {
  const workbench = new CherryPickWorkbench();
  const html = workbench.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Patch Extraction Studio</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Cherry-Pick Matrix
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Isolate and harvest individual commit deltas from divergent branches into your working stream
          </p>
        </div>
      </div>

      <div id="cherry-pick-workbench-container">
        ${html}
      </div>
    </main>
  `;
}

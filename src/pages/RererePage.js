/**
 * RererePage
 * Master workbench for RERERE (Reuse Recorded Resolution) cache and pattern inspection.
 */

import { RerereWorkbench } from '../features/rerere/RerereWorkbench.js';

export function renderRererePage() {
  const workbench = new RerereWorkbench();
  const html = workbench.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Conflict Memory Cache</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git RERERE Workbench
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Reuse Recorded Resolution: automatically replay past conflict resolutions during repeating rebase loops
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

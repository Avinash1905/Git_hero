/**
 * SubmodulePage
 * Master workbench for submodule tracking and gitlink management.
 */

import { SubmoduleManager } from '../features/submodules/SubmoduleManager.js';

export function renderSubmodulePage() {
  const manager = new SubmoduleManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Nested Repositories</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Submodule Registry
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Track foreign commit hashes via gitlinks embedded inside repository tree objects
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

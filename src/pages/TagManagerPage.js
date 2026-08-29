/**
 * TagManagerPage
 * Master workbench for creating and managing release tags.
 */

import { TagManager } from '../features/tags/TagManager.js';

export function renderTagManagerPage() {
  const manager = new TagManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span>Milestone Registry</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Tag & Release Manager
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Affix immutable version tags and cryptographic provenance markers to milestones
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

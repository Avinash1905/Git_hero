/**
 * GitAttributesPage
 * Master workbench for path-specific attributes (.gitattributes).
 */

import { GitAttributesManager } from '../features/attributes/GitAttributesManager.js';

export function renderGitAttributesPage() {
  const manager = new GitAttributesManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Path Behaviors</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Attributes Configuration (.gitattributes)
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Control line-ending conversions, smudge/clean filters, binary markers, and archive export rules
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

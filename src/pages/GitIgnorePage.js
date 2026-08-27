/**
 * GitIgnorePage
 * Master workbench for .gitignore pattern inspection and untracked file filtering.
 */

import { GitIgnoreManager } from '../features/ignore/GitIgnoreManager.js';

export function renderGitIgnorePage() {
  const manager = new GitIgnoreManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/30 text-error text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span>Exclusion Rules</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Ignore Rules (.gitignore)
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Ensure build artifacts, logs, and sensitive credentials remain untracked across your working tree
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

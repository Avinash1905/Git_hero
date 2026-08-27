/**
 * GitCleanerPage
 * Master workbench for purging large binary assets and redacted credentials.
 */

import { GitCleanerStudio } from '../features/cleaner/GitCleanerStudio.js';

export function renderGitCleanerPage() {
  const studio = new GitCleanerStudio();
  const html = studio.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/30 text-error text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span>History Disinfection</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git History Cleaner (Filter-Repo)
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Permanently excise heavy binaries and compromised credentials across all historic tree nodes
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

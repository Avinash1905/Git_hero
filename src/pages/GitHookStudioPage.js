/**
 * GitHookStudioPage
 * Master workbench for client-side git hooks and repository policy automation.
 */

import { GitHookStudio } from '../features/hooks/GitHookStudio.js';

export function renderGitHookStudioPage() {
  const studio = new GitHookStudio();
  const html = studio.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Policy Verification Engine</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Hook Automation Studio
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Configure lifecycle hooks to validate commit formatting, execute tests, and prevent credential leaks
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

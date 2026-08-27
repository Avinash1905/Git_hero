/**
 * WorktreePage
 * Master workbench for managing linked multi-branch worktrees.
 */

import { WorktreeManager } from '../features/worktrees/WorktreeManager.js';

export function renderWorktreePage() {
  const manager = new WorktreeManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Concurrent Workspaces</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Worktree Matrix
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Check out multiple repository branches simultaneously across isolated filesystem directories
          </p>
        </div>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl">
        ${html}
      </div>
    </main>
  `;
}

/**
 * GitMaintenancePage
 * Master workbench for automated repository maintenance, packfiles, and commit-graph.
 */

import { GitMaintenanceCenter } from '../features/maintenance/GitMaintenanceCenter.js';

export function renderGitMaintenancePage() {
  const center = new GitMaintenanceCenter();
  const html = center.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Performance Maintenance</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Maintenance & Commit-Graph Studio
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Execute scheduled maintenance tasks: commit-graph compilation, bloom filter indexing, and incremental packfile compaction
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

/**
 * GitBundlePage
 * Master workbench for creating and verifying offline Git bundles.
 */

import { GitBundleManager } from '../features/bundle/GitBundleManager.js';

export function renderGitBundlePage() {
  const manager = new GitBundleManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Airgapped Transport</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Bundle Packaging Center
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Package and verify self-contained binary bundle archives for transport across airgapped networks
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

/**
 * SparseCheckoutPage
 * Master workbench for monorepo sparse-checkout patterns and disk space conservation.
 */

import { SparseCheckoutManager } from '../features/sparse/SparseCheckoutManager.js';

export function renderSparseCheckoutPage() {
  const manager = new SparseCheckoutManager();
  const html = manager.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Monorepo Optimizer</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Sparse-Checkout Studio
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Selectively materialize only essential directories in huge monorepo repositories to save gigabytes of disk
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

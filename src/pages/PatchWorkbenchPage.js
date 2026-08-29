/**
 * PatchWorkbenchPage
 * Master workbench for email patch mailboxes and decentralized review flows.
 */

import { PatchWorkbench } from '../features/patch/PatchWorkbench.js';

export function renderPatchWorkbenchPage() {
  const workbench = new PatchWorkbench();
  const html = workbench.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Decentralized Review</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Patch Mailbox (git-am)
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Inspect, apply, and verify cryptographic patch mailboxes across offline channels
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

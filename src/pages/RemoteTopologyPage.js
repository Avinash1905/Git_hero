/**
 * RemoteTopologyPage
 * Master workbench for distributed remote endpoints and refspec synchronization.
 */

import { RemoteTopologyMapper } from '../features/remotes/RemoteTopologyMapper.js';

export function renderRemoteTopologyPage() {
  const mapper = new RemoteTopologyMapper();
  const html = mapper.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Distributed Mesh</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Remote Topology & Refspecs
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Configure upstream remotes, fetch refspec namespaces, and mirror repositories
          </p>
        </div>
      </div>

      <div class="space-y-6">
        ${html}
      </div>
    </main>
  `;
}

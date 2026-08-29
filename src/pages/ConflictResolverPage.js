/**
 * ConflictResolverPage
 * Master workbench for multi-file 3-way merge conflict resolution.
 */

import { MergeConflictState } from '../features/merge/MergeConflictState.js';
import { MergeConflictResolver } from '../features/merge/MergeConflictResolver.js';

export function renderConflictResolverPage() {
  const multiFileConflicts = [
    {
      filePath: 'src/engine/topology.js',
      baseBranch: 'main',
      targetBranch: 'feature/quantum-rebase',
      hunks: [
        {
          id: 'top-1',
          lineNumber: 42,
          current: '  const maxVelocity = 12;\n  const damping = 0.85;',
          incoming: '  const maxVelocity = 18;\n  const damping = 0.92;',
          base: '  const maxVelocity = 10;\n  const damping = 0.80;',
          resolution: null
        }
      ]
    },
    {
      filePath: 'src/config/cluster.json',
      baseBranch: 'main',
      targetBranch: 'feature/quantum-rebase',
      hunks: [
        {
          id: 'conf-1',
          lineNumber: 12,
          current: '  "clusterNodes": 250,\n  "replicationFactor": 3',
          incoming: '  "clusterNodes": 250,\n  "replicationFactor": 5',
          base: '  "clusterNodes": 100,\n  "replicationFactor": 2',
          resolution: null
        }
      ]
    }
  ];

  const state1 = new MergeConflictState(multiFileConflicts[0]);
  const resolver = new MergeConflictResolver(state1);
  const resolverHtml = resolver.renderHtml();

  const fileTreeHtml = multiFileConflicts.map((f, idx) => `
    <button 
      data-conflict-file="${f.filePath}"
      class="w-full px-3 py-2 rounded-lg text-left text-xs font-terminal-code flex items-center justify-between transition-colors cursor-pointer ${idx === 0 ? 'bg-primary/20 text-primary border border-primary/30 font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'}"
    >
      <span class="truncate">${f.filePath}</span>
      <span class="text-[10px] px-1.5 py-0.2 rounded bg-error/20 text-error font-terminal-label uppercase">1 CONFLICT</span>
    </button>
  `).join('');

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 border border-error/30 text-error text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span>Conflict Resolution Center</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            3-Way Merge Workbench
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Reconcile divergent file hunks between HEAD and incoming branch payloads
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- File Tree (3 cols) -->
        <div class="lg:col-span-3 glass-panel p-4 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-3">
          <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">Conflicted Files</h4>
          <div class="space-y-1">
            ${fileTreeHtml}
          </div>
        </div>

        <!-- Hunk Inspector (9 cols) -->
        <div class="lg:col-span-9" id="active-resolver-container">
          ${resolverHtml}
        </div>
      </div>
    </main>
  `;
}

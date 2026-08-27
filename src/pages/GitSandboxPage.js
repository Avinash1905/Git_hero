/**
 * GitSandboxPage
 * Master playground providing real-time Directed Acyclic Graph simulation,
 * branch divergence testing, and three-way merge conflict resolution.
 */

import { CommandSandbox } from '../features/manual/CommandSandbox.js';
import { MergeConflictResolver } from '../features/merge/MergeConflictResolver.js';

export function renderGitSandboxPage() {
  const sandbox = new CommandSandbox('sandbox-dag');
  sandbox.init();
  const dagHtml = sandbox.render();

  const resolver = new MergeConflictResolver();
  const resolverHtml = resolver.renderHtml();

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Interactive Laboratory</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Git Plumbing Sandbox
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Execute low-level commands, observe topological graph evolution, and resolve merge conflicts
          </p>
        </div>
      </div>

      <!-- Live Directed Acyclic Graph Section -->
      <div class="space-y-3">
        <h3 class="text-xs font-bold text-on-surface font-terminal-code uppercase tracking-wider">
          Topological DAG Visualizer
        </h3>
        <div id="sandbox-dag-container">
          ${dagHtml}
        </div>
      </div>

      <!-- Split View: Sandbox Terminal vs 3-Way Conflict Resolver -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Sandbox CLI Console (5 cols) -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span class="text-xs font-bold text-on-surface uppercase">Sandbox Shell</span>
            </div>
            <span class="text-[10px] text-on-surface-variant">Active Branch: main</span>
          </div>

          <div id="sandbox-log-output" class="h-48 overflow-y-auto scrollbar-thin text-xs space-y-1.5 p-2 bg-surface-container-lowest/80 rounded-lg border border-outline-variant/20">
            <div class="text-primary font-bold">GitHero Visual Sandbox Ready.</div>
            <div class="text-on-surface-variant">Try typing: <code>git commit -m "my commit"</code> or <code>git branch feature</code></div>
          </div>

          <form id="sandbox-input-form" class="flex items-center gap-2">
            <span class="text-primary font-bold text-xs">$</span>
            <input 
              id="sandbox-cmd-input" 
              type="text" 
              placeholder="git commit, git switch..." 
              class="flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-terminal-label text-xs font-bold uppercase transition-colors cursor-pointer">
              Run
            </button>
          </form>
        </div>

        <!-- 3-Way Merge Conflict Resolver (7 cols) -->
        <div class="lg:col-span-7">
          ${resolverHtml}
        </div>
      </div>
    </main>
  `;
}

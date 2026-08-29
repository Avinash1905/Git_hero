/**
 * GitLogVisualizerPage
 * Full-screen visual commit topology explorer with search, branch filtering,
 * and unified diff inspector.
 */

import { TerminalGraphRenderer } from '../features/terminal/TerminalGraphRenderer.js';
import { TerminalDiffViewer } from '../features/terminal/TerminalDiffViewer.js';

export function renderGitLogVisualizerPage(commits = []) {
  const sampleCommits = (commits && commits.length > 0) ? commits : [
    { hash: 'a1b2c3d4', message: 'Initial commit: setup tactical grid', branch: 'main', isHead: false },
    { hash: 'e5f6g7h8', message: 'feat: add pushable box mechanics', branch: 'main', isHead: false },
    { hash: 'i9j0k1l2', message: 'feat: implement terminal CLI', branch: 'feature/terminal', isHead: false },
    { hash: 'm3n4o5p6', message: 'fix: resolve wall collision bug', branch: 'feature/terminal', isHead: true }
  ];

  const graphHtml = TerminalGraphRenderer.renderHtmlGraph(sampleCommits);

  const sampleDiff = `diff --git a/src/engine/grid.js b/src/engine/grid.js
--- a/src/engine/grid.js
+++ b/src/engine/grid.js
@@ -14,6 +14,8 @@
-  return moveValid ? true : false;
+  if (isWall(x, y)) return false;
+  if (isHazard(x, y)) return false;
+  return true;`;

  const diffHtml = TerminalDiffViewer.formatDiffHtml(sampleDiff);

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>History Visualizer</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Commit Topology & Diff Log
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Examine commit lineage, branch divergence, and unified diff hunks
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left: Commit Graph (7 cols) -->
        <div class="lg:col-span-7 glass-panel p-5 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-4">
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <h3 class="font-bold text-on-surface text-xs uppercase tracking-wider">Commit DAG History</h3>
            <span class="text-[10px] text-on-surface-variant">git log --graph --all</span>
          </div>

          <div class="space-y-3 p-2 bg-surface-container-lowest/70 rounded-xl border border-outline-variant/20">
            ${graphHtml}
          </div>
        </div>

        <!-- Right: Diff Inspector (5 cols) -->
        <div class="lg:col-span-5 glass-panel p-5 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-4">
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <h3 class="font-bold text-on-surface text-xs uppercase tracking-wider">Unified Diff Hunk</h3>
            <span class="text-[10px] text-primary">HEAD vs Working Tree</span>
          </div>

          ${diffHtml}
        </div>
      </div>
    </main>
  `;
}

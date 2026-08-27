import { renderCommandGuideHtml } from '../features/manual/GitHeroCommandGuide.js';

export function renderUserManualPage() {
  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span>Knowledge Base</span>
        </div>
        <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
          GitQuest Tactical Manual
        </h1>
        <p class="text-on-surface-variant text-sm font-terminal-code">
          Reference guide covering git plumbing, navigation mechanics, and CLI operations
        </p>
      </div>

      <div class="space-y-4">
        <!-- Manual Card 1: Core Navigation -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <h3 class="text-on-surface font-bold text-base font-headline-sm text-primary flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">directions_walk</span>
            <span>Movement & Directional Navigation</span>
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Move your hero avatar across the 2D sector grid using either standard keyboard controls (<kbd class="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface">W</kbd><kbd class="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface">A</kbd><kbd class="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface">S</kbd><kbd class="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface">D</kbd> or Arrow keys), touch D-Pad, or explicit terminal commands:
          </p>
          <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-xs text-on-surface space-y-1">
            <div><span class="text-primary font-bold">git up</span> - Move one tile upward</div>
            <div><span class="text-primary font-bold">git down</span> - Move one tile downward</div>
            <div><span class="text-primary font-bold">git left</span> - Move one tile to the left</div>
            <div><span class="text-primary font-bold">git right</span> - Move one tile to the right</div>
          </div>
        </div>

        <!-- Manual Card 2: Git Push & Pull -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <h3 class="text-on-surface font-bold text-base font-headline-sm text-secondary flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">swap_vert</span>
            <span>Push & Pull Interaction Solvers</span>
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Manipulate repository boxes across obstacles into target staging nodes:
          </p>
          <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-xs text-on-surface space-y-1">
            <div><span class="text-secondary font-bold">git push</span> - Pushes an adjacent box forward in your current facing direction</div>
            <div><span class="text-secondary font-bold">git pull</span> - Pulls an adjacent box toward your current position</div>
            <div><span class="text-secondary font-bold">git pull left / right / up / down</span> - Directional pull toward specific adjacent vector</div>
          </div>
        </div>

        <!-- Manual Card 3: Commit & Staging -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <h3 class="text-on-surface font-bold text-base font-headline-sm text-tertiary flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">check_circle</span>
            <span>Staging Verification & Level Clears</span>
          </h3>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            When all repository boxes are positioned on designated goal nodes, the working tree transitions to <code>STAGED</code>. Finalize the sector by issuing:
          </p>
          <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20 text-xs text-on-surface space-y-1">
            <div><span class="text-tertiary font-bold">git commit</span> - Creates an immutable commit object, triggers victory verification, and awards XP</div>
            <div><span class="text-tertiary font-bold">git status</span> - Inspects branch name, box staging status, and required commits</div>
          </div>
        </div>

        <!-- Comprehensive Command Guide (PR #3) -->
        ${renderCommandGuideHtml()}
      </div>
    </main>
  `;
}

export function renderNotFoundPage() {
  return `
    <main class="min-h-screen pt-24 pb-20 px-4 flex flex-col items-center justify-center text-center font-terminal-code">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/15 border border-error/40 text-error text-xs font-terminal-label font-bold uppercase mb-4">
        <span>404 :: Sector Not Found</span>
      </div>
      <h1 class="text-headline-md font-bold text-on-surface text-3xl mb-2">Detached HEAD State</h1>
      <p class="text-on-surface-variant text-sm max-w-md mb-6 leading-relaxed">
        The requested branch or sector does not exist in the repository tree.
      </p>
      <a href="#hero" class="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30">
        Return to Root Origin
      </a>
    </main>
  `;
}

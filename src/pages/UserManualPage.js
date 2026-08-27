import { renderCommandGuideHtml } from '../features/manual/GitHeroCommandGuide.js';
import { renderSolvingGuideHtml } from '../features/manual/GitHeroSolvingGuide.js';

export function renderUserManualPage() {
  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Knowledge Base</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            GitHero Tactical Manual & Tutorial
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Complete guide covering player controls, game mechanics, terminal commands, and level progression
          </p>
        </div>

        <button 
          id="open-tutorial-btn" 
          class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span class="material-symbols-outlined text-base">school</span>
          <span>Launch Interactive Tutorial</span>
        </button>
      </div>

      <div class="space-y-4">
        <!-- Section: Welcome to GitHero -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-on-surface font-bold text-base font-headline-sm text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">terminal</span>
              <span>WELCOME TO GITHERO</span>
            </h3>
            <span class="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10 font-terminal-label uppercase">Orientation</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            <strong>GitHero</strong> is a command-line puzzle adventure designed to teach genuine Git version-control concepts through tactile 2D puzzle gameplay. Your mission is to navigate 250 repository sectors across 20 worlds, manipulate commit payloads onto designated target nodes, and record verified commits to advance.
          </p>
        </div>

        <!-- Section: How the Game Works -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-on-surface font-bold text-base font-headline-sm text-secondary flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">grid_view</span>
              <span>HOW THE GAME WORKS</span>
            </h3>
            <span class="text-[10px] font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10 font-terminal-label uppercase">Core Rules</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Every sector represents an active Git repository state containing a player operative (active HEAD pointer), repository payload boxes, target goal nodes, and walls. When all repository boxes occupy target goal nodes, the working tree transitions to <code class="text-primary font-bold">STAGED</code>, enabling a successful commit to unlock the exit and advance.
          </p>
        </div>

        <!-- Section: Controls -->
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code text-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-on-surface font-bold text-base font-headline-sm text-tertiary flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px]">sports_esports</span>
              <span>CONTROLS & MOVEMENT</span>
            </h3>
            <span class="text-[10px] font-bold text-tertiary px-2 py-0.5 rounded bg-tertiary/10 font-terminal-label uppercase">Input Systems</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-relaxed">
            Navigate your operative using either standard keyboard controls or the on-screen touch D-Pad buttons:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <div class="font-bold text-on-surface text-[11px] mb-1">Keyboard Navigation</div>
              <div><span class="text-primary font-bold">↑</span> - Move Up (or W)</div>
              <div><span class="text-primary font-bold">↓</span> - Move Down (or S)</div>
              <div><span class="text-primary font-bold">←</span> - Move Left (or A)</div>
              <div><span class="text-primary font-bold">→</span> - Move Right (or D)</div>
            </div>
            <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-1">
              <div class="font-bold text-on-surface text-[11px] mb-1">On-Screen Buttons</div>
              <div><span class="text-secondary font-bold font-mono">[ ↑ ]</span> - Move Up Button</div>
              <div><span class="text-secondary font-bold font-mono">[ ↓ ]</span> - Move Down Button</div>
              <div><span class="text-secondary font-bold font-mono">[ ← ]</span> - Move Left Button</div>
              <div><span class="text-secondary font-bold font-mono">[ → ]</span> - Move Right Button</div>
            </div>
          </div>
          <p class="text-[11px] text-on-surface-variant/80 italic">
            Note: Keyboard controls and on-screen controls perform the exact same movement actions.
          </p>
        </div>

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

        <!-- Comprehensive Level Solving Guide (PR #4) -->
        ${renderSolvingGuideHtml()}
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

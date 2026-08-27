/**
 * GitHero User Manual View
 * Cheatsheet, command references, puzzle mechanics guide, and Git concept explanations.
 */

export function renderUserManualView() {
  return `
    <main class="pt-24 pb-28 md:pb-12 px-4 md:px-hud-margin max-w-6xl mx-auto min-h-screen">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-display-lg font-display-lg text-on-surface mb-2">User Manual & Git Reference</h1>
        <p class="text-sm font-terminal-code text-on-surface-variant">Complete operational handbook for the GitHero platform.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar Navigation -->
        <aside class="md:col-span-1 glass-panel rounded-xl p-4 h-fit sticky top-24 space-y-2 text-xs font-terminal-label">
          <a href="#section-controls" class="block p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold">1. CONTROLS & NAVIGATION</a>
          <a href="#section-git-cli" class="block p-2.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant">2. GIT CLI TERMINAL COMMANDS</a>
          <a href="#section-mechanics" class="block p-2.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant">3. PUZZLE ENTITIES & MECHANICS</a>
          <a href="#section-concepts" class="block p-2.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant">4. GIT CONCEPTS DICTIONARY</a>
        </aside>

        <!-- Main Handbook Content -->
        <div class="md:col-span-2 space-y-8">
          <!-- Section 1: Controls -->
          <section id="section-controls" class="glass-panel rounded-xl p-6 space-y-4">
            <h2 class="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">sports_esports</span> 1. Controls & Navigation
            </h2>
            <p class="text-sm font-body-md text-on-surface-variant">
              GitHero supports dual input modes: interactive terminal commands and keyboard arrow/vim shortcuts.
            </p>
            <div class="grid grid-cols-2 gap-3 text-xs font-terminal-code">
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <span class="text-primary font-bold">Arrow Keys / WASD</span>
                <p class="text-on-surface-variant mt-1">Navigate player across grid partitions.</p>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <span class="text-primary font-bold">H, J, K, L (Vim Mode)</span>
                <p class="text-on-surface-variant mt-1">Enable Vim navigation in Settings.</p>
              </div>
            </div>
          </section>

          <!-- Section 2: Git CLI Commands -->
          <section id="section-git-cli" class="glass-panel rounded-xl p-6 space-y-4">
            <h2 class="text-headline-sm font-headline-sm text-secondary flex items-center gap-2">
              <span class="material-symbols-outlined">terminal</span> 2. Git CLI Commands
            </h2>
            <div class="space-y-3 font-terminal-code text-xs">
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <code class="text-primary font-bold">git status</code>
                <p class="text-on-surface-variant mt-1">Inspects current branch, box staging status, and objectives.</p>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <code class="text-primary font-bold">git push</code>
                <p class="text-on-surface-variant mt-1">Pushes the adjacent repository payload box forward along player direction.</p>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <code class="text-primary font-bold">git pull [left|right|up|down]</code>
                <p class="text-on-surface-variant mt-1">Pulls adjacent box toward player from the specified cardinal direction.</p>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <code class="text-primary font-bold">git commit [-m "message"]</code>
                <p class="text-on-surface-variant mt-1">Creates a final commit snapshot when the box is placed on the green goal.</p>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30">
                <code class="text-primary font-bold">git switch &lt;level_id&gt;</code>
                <p class="text-on-surface-variant mt-1">Switches branch and loads target level (e.g. <code class="text-secondary">git switch 08</code>).</p>
              </div>
            </div>
          </section>

          <!-- Section 3: Puzzle Mechanics -->
          <section id="section-mechanics" class="glass-panel rounded-xl p-6 space-y-4">
            <h2 class="text-headline-sm font-headline-sm text-tertiary flex items-center gap-2">
              <span class="material-symbols-outlined">widgets</span> 3. Puzzle Entities & Mechanics
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-terminal-code">
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-3 items-center">
                <div class="w-8 h-8 rounded bg-secondary flex items-center justify-center text-on-secondary shrink-0"><span class="material-symbols-outlined text-sm">package_2</span></div>
                <div>
                  <strong class="text-secondary">Repository Box</strong>
                  <p class="text-on-surface-variant">The staging payload that must be aligned with the goal.</p>
                </div>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-3 items-center">
                <div class="w-8 h-8 rounded bg-primary/20 border border-primary text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-sm">target</span></div>
                <div>
                  <strong class="text-primary">Target Goal</strong>
                  <p class="text-on-surface-variant">The staging destination required before executing git commit.</p>
                </div>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-3 items-center">
                <div class="w-8 h-8 rounded bg-error/20 border border-error text-error flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-sm">lock</span></div>
                <div>
                  <strong class="text-error">Firewall Gate</strong>
                  <p class="text-on-surface-variant">Locked partition that opens when linked switch is activated.</p>
                </div>
              </div>
              <div class="p-3 bg-surface-container rounded-lg border border-outline-variant/30 flex gap-3 items-center">
                <div class="w-8 h-8 rounded bg-tertiary/20 border border-tertiary text-tertiary flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-sm">radio_button_checked</span></div>
                <div>
                  <strong class="text-tertiary">Pressure Switch</strong>
                  <p class="text-on-surface-variant">Step on or place a box to trigger linked partition gates.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Section 4: Git Concepts -->
          <section id="section-concepts" class="glass-panel rounded-xl p-6 space-y-4">
            <h2 class="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
              <span class="material-symbols-outlined">menu_book</span> 4. Git Concepts Dictionary
            </h2>
            <div class="space-y-3 text-xs font-terminal-code text-on-surface-variant">
              <p><strong class="text-on-surface">Working Tree:</strong> The directory of files currently active on your local partition.</p>
              <p><strong class="text-on-surface">Staging Area (Index):</strong> Intermediate buffer holding changes designated for the next commit snapshot.</p>
              <p><strong class="text-on-surface">Branch:</strong> A lightweight movable pointer to a commit hash sequence.</p>
              <p><strong class="text-on-surface">Detached HEAD:</strong> State when HEAD points directly to a commit hash rather than a named branch.</p>
              <p><strong class="text-on-surface">Three-Way Merge:</strong> Algorithm reconciling changes using common ancestor (BASE), local (OURS), and remote (THEIRS).</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  `;
}

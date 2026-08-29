/**
 * HomePage
 * 100% faithful to the Stitch Hero Landing Page design.
 * Cyberpunk terminal aesthetics, live CTA triggers, and feature cards.
 */

export function renderHomePage() {
  return `
    <main class="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center justify-center relative overflow-hidden bg-background">
      <!-- Background Ambient Glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center space-y-8 my-auto">
        <!-- Status Pill -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-variant/80 border border-primary/40 backdrop-blur-md shadow-lg shadow-primary/5 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span class="text-terminal-label font-terminal-label text-primary text-xs uppercase tracking-widest font-bold">
            Sector 250 Engine Online
          </span>
        </div>

        <!-- Headline -->
        <div class="space-y-4">
          <h1 class="text-display-lg font-display-lg text-on-surface font-extrabold tracking-tight max-w-4xl mx-auto leading-none text-4xl sm:text-5xl md:text-6xl">
            Master Git by <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-fixed to-secondary">
              Changing the World
            </span>
          </h1>
          
          <p class="text-on-surface-variant text-base md:text-lg max-w-2xl mx-auto font-terminal-code leading-relaxed">
            A command-line puzzle adventure blending the tactical precision of a terminal with tactile 2D repository mechanics across 250 designed sectors.
          </p>
        </div>

        <!-- Action CTAs -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            id="hero-play-btn" 
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold text-sm uppercase tracking-wider transition-all shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Initialize Terminal</span>
            <span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">terminal</span>
          </button>

          <button 
            id="hero-explore-btn" 
            class="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface border border-outline-variant/40 font-terminal-label font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg text-secondary">explore</span>
            <span>Browse 250 Levels</span>
          </button>
        </div>

        <!-- Feature Bento Grid Preview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 text-left">
          <div class="glass-panel p-5 rounded-xl border border-outline-variant/30 hover:border-primary/40 transition-colors">
            <div class="flex items-center gap-2 mb-2 text-primary font-bold font-terminal-label text-xs uppercase">
              <span class="material-symbols-outlined text-[18px]">terminal</span>
              <span>Real CLI Engine</span>
            </div>
            <p class="text-xs text-on-surface-variant font-terminal-code leading-relaxed">
              Type actual git commands like <code>git commit</code>, <code>git switch</code>, and <code>git push</code> to transform live level topology.
            </p>
          </div>

          <div class="glass-panel p-5 rounded-xl border border-outline-variant/30 hover:border-secondary/40 transition-colors">
            <div class="flex items-center gap-2 mb-2 text-secondary font-bold font-terminal-label text-xs uppercase">
              <span class="material-symbols-outlined text-[18px]">alt_route</span>
              <span>20 Designed Worlds</span>
            </div>
            <p class="text-xs text-on-surface-variant font-terminal-code leading-relaxed">
              Progress through 250 uniquely designed levels spanning basic commits to multidimensional git rebase challenges.
            </p>
          </div>

          <div class="glass-panel p-5 rounded-xl border border-outline-variant/30 hover:border-tertiary/40 transition-colors">
            <div class="flex items-center gap-2 mb-2 text-tertiary font-bold font-terminal-label text-xs uppercase">
              <span class="material-symbols-outlined text-[18px]">military_tech</span>
              <span>Live Progression</span>
            </div>
            <p class="text-xs text-on-surface-variant font-terminal-code leading-relaxed">
              Earn validated XP, unlock achievements, climb global leaderboards, and master the full spectrum of Git plumbing.
            </p>
          </div>
        </div>
      </div>
    </main>
  `;
}

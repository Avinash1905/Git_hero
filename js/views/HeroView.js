// HeroView - 100% faithful to Stitch Landing / Hero Screen

export function renderHeroView(onPlay, onExplore) {
  return `
    <main class="pt-16 pb-20 md:pb-0 min-h-screen relative">
      <!-- Hero Section -->
      <section class="relative w-full min-h-[921px] flex flex-col items-center justify-center pt-xl px-md overflow-hidden hero-gradient">
        <div class="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-lg">
          <div class="inline-flex items-center gap-xs px-md py-sm rounded-full bg-surface-variant/50 border border-outline-variant/50 backdrop-blur-md mb-md">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="text-terminal-label font-terminal-label text-primary">v2.0 Update Available</span>
          </div>

          <h1 class="text-display-lg font-display-lg text-on-surface tracking-tighter uppercase">
            GITHERO
          </h1>

          <p class="text-headline-sm font-headline-sm text-on-surface-variant max-w-2xl text-center">
            Master Git by changing the world.<span class="inline-block w-3 h-[1em] bg-primary ml-sm align-middle cursor-blink"></span>
          </p>

          <div class="flex flex-col sm:flex-row gap-md mt-xl">
            <button id="hero-play-btn" class="px-xl py-md bg-primary text-on-primary text-terminal-label font-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(78,222,163,0.4)] relative overflow-hidden group">
              <div class="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              [PLAY NOW]
            </button>
            
            <button id="hero-explore-btn" class="px-xl py-md bg-surface-container-high text-on-surface border border-outline-variant/50 text-terminal-label font-terminal-label uppercase tracking-widest rounded-lg hover:bg-surface-variant transition-colors duration-200">
              [EXPLORE LEVELS]
            </button>
          </div>
        </div>

        <!-- Isometric Game Preview Area -->
        <div class="relative w-full max-w-6xl mx-auto mt-xl px-4 perspective-[1000px]">
          <div class="w-full h-96 relative transform rotate-x-[20deg] rotate-y-[-10deg] rotate-z-[5deg] scale-95 hover:rotate-x-[15deg] hover:rotate-y-[0deg] transition-transform duration-700 ease-out preserve-3d">
            <!-- Decorative Base Platform -->
            <div class="absolute inset-0 bg-surface-container/80 backdrop-blur-xl rounded-xl border border-outline-variant/30 shadow-2xl overflow-hidden">
              <div class="absolute inset-0 bg-grid-pattern opacity-50"></div>
              
              <!-- Pseudo 3D Elements -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-surface-variant/40 border border-outline-variant/50 rotate-45 flex items-center justify-center">
                <!-- Player Character representation -->
                <div class="w-12 h-12 bg-secondary transform -rotate-45 relative z-20 glow-secondary flex items-center justify-center">
                  <div class="w-8 h-8 bg-on-secondary rotate-45"></div>
                </div>
                <!-- Glowing Box Objective -->
                <div class="absolute top-8 right-8 w-16 h-16 bg-primary/20 border border-primary/50 transform -rotate-45 flex items-center justify-center glow-primary animate-pulse">
                  <span class="material-symbols-outlined text-primary text-headline-sm">package_2</span>
                </div>
                <!-- Connection Line -->
                <div class="absolute top-1/2 left-1/2 w-32 h-[2px] bg-primary/50 transform -rotate-45 origin-left shadow-[0_0_8px_rgba(78,222,163,0.5)]"></div>
              </div>

              <!-- Floating UI Cards in 3D Space -->
              <div class="absolute top-8 left-8 w-48 bg-surface-container-high/90 backdrop-blur border border-outline-variant p-md rounded-lg transform translate-z-10">
                <div class="text-terminal-label font-terminal-label text-on-surface-variant mb-xs">Objective</div>
                <div class="text-body-md font-body-md text-primary font-bold">Merge Branch: feature/box</div>
              </div>
              <div class="absolute bottom-8 right-8 w-64 bg-surface-container-high/90 backdrop-blur border border-outline-variant p-md rounded-lg transform translate-z-20">
                <div class="text-terminal-label font-terminal-label text-on-surface-variant mb-sm">Terminal log</div>
                <div class="text-terminal-code font-terminal-code text-on-surface/80 text-sm">
                  <span class="text-secondary">$</span> git add box.js<br/>
                  <span class="text-secondary">$</span> git commit -m "add box"<br/>
                  <span class="text-primary">Staged 1 file. Ready.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}

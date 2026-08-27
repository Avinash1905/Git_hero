// LevelCompleteModal Component - 100% faithful to Stitch victory screen

export function renderLevelCompleteModal(stats, onNextLevel, onReplay, onWorldMap) {
  const starsCount = stats.stars || 3;
  const starsHtml = [1, 2, 3].map(i => {
    if (i <= starsCount) {
      return `<span class="material-symbols-outlined text-display-lg text-tertiary star-pulse" style="font-variation-settings: 'FILL' 1; animation-delay: ${(i-1)*0.2}s;">star</span>`;
    }
    return `<span class="material-symbols-outlined text-display-lg text-outline-variant" style="font-variation-settings: 'FILL' 0;">star</span>`;
  }).join('');

  return `
    <div id="level-complete-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md overflow-hidden p-4">
      <!-- Particle Container -->
      <div class="absolute inset-0 z-0 pointer-events-none" id="particle-container"></div>

      <!-- Main Victory Card -->
      <main class="relative z-10 w-full max-w-2xl px-4 md:px-0 animate-in fade-in zoom-in duration-300">
        <div class="bg-surface-container-highest/90 backdrop-blur-xl border border-surface-bright rounded-xl shadow-2xl success-glow overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
          
          <div class="p-lg md:p-xl flex flex-col items-center text-center space-y-lg relative z-10">
            <div class="space-y-sm">
              <h1 class="text-display-lg font-display-lg text-primary tracking-tighter drop-shadow-[0_0_15px_rgba(78,222,163,0.5)]">
                LEVEL COMPLETE!
              </h1>
              <div class="flex items-center justify-center space-x-md text-primary font-terminal-code text-terminal-code">
                <span class="flex items-center"><span class="material-symbols-outlined mr-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span> Objective completed</span>
                <span class="flex items-center"><span class="material-symbols-outlined mr-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span> Commit created</span>
              </div>
            </div>

            <!-- 3 Stars -->
            <div class="flex space-x-md py-lg">
              ${starsHtml}
            </div>

            <!-- XP Reward Badge -->
            <div class="text-secondary font-hud-stat text-headline-sm flex items-center bg-surface-variant px-md py-sm rounded-lg border border-surface-bright glow-box">
              <span class="material-symbols-outlined mr-sm text-secondary">military_tech</span> +${stats.xpAwarded || 500} XP
            </div>

            <!-- Stats Breakdown Bento -->
            <div class="w-full bg-surface-container-low rounded-lg p-md border border-outline-variant/30 mt-md">
              <h2 class="text-headline-sm font-headline-sm text-on-surface mb-md border-b border-outline-variant/30 pb-sm text-left">Stats Breakdown</h2>
              <div class="grid grid-cols-2 gap-md text-left">
                <div class="flex justify-between items-center bg-surface p-sm rounded border border-surface-bright">
                  <span class="text-on-surface-variant font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">timer</span> TIME
                  </span>
                  <span class="font-hud-stat text-hud-stat text-primary">${stats.time || '01:45'}</span>
                </div>
                <div class="flex justify-between items-center bg-surface p-sm rounded border border-surface-bright">
                  <span class="text-on-surface-variant font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">terminal</span> COMMANDS
                  </span>
                  <span class="font-hud-stat text-hud-stat text-secondary">${stats.commands || 12}</span>
                </div>
                <div class="flex justify-between items-center bg-surface p-sm rounded border border-surface-bright">
                  <span class="text-on-surface-variant font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">upload</span> PUSH COUNT
                  </span>
                  <span class="font-hud-stat text-hud-stat text-on-surface">${stats.pushCount || 1}</span>
                </div>
                <div class="flex justify-between items-center bg-surface p-sm rounded border border-surface-bright">
                  <span class="text-on-surface-variant font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">download</span> PULL COUNT
                  </span>
                  <span class="font-hud-stat text-hud-stat text-on-surface">${stats.pullCount || 0}</span>
                </div>
                <div class="flex justify-between items-center bg-surface p-sm rounded border border-surface-bright">
                  <span class="text-on-surface-variant font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">info</span> STATUS COUNT
                  </span>
                  <span class="font-hud-stat text-hud-stat text-on-surface">${stats.statusCount || 2}</span>
                </div>
                <div class="flex justify-between items-center bg-surface-variant p-sm rounded border border-primary/30">
                  <span class="text-primary font-terminal-label text-terminal-label flex items-center">
                    <span class="material-symbols-outlined text-[16px] mr-xs">sports_score</span> SCORE
                  </span>
                  <span class="font-hud-stat text-headline-sm text-primary">${(stats.score || 9420).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-md w-full mt-lg">
              <button id="modal-next-btn" class="flex-1 py-md bg-primary text-on-primary font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg glow-primary hover:scale-[1.02] transition-transform duration-200 shadow-[0_0_20px_rgba(78,222,163,0.4)] btn-shimmer">
                [NEXT LEVEL →]
              </button>
              <button id="modal-replay-btn" class="px-lg py-md bg-surface-container-high text-on-surface border border-outline-variant/50 font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg hover:bg-surface-variant transition-colors duration-200">
                [REPLAY]
              </button>
              <button id="modal-map-btn" class="px-lg py-md bg-surface-container-high text-on-surface border border-outline-variant/50 font-terminal-label text-terminal-label uppercase tracking-widest rounded-lg hover:bg-surface-variant transition-colors duration-200">
                [WORLD MAP]
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  `;
}

export function initParticleSystem() {
  const container = document.getElementById('particle-container');
  if (!container) return;

  const chars = ['{', '}', ';', '>', '<', '/', '*', 'git', 'commit', 'push', 'merge', 'HEAD'];
  const colors = ['#4edea3', '#adc6ff', '#2f3a4c', '#ffb95f'];

  function createParticle() {
    if (!document.getElementById('particle-container')) return;
    const el = document.createElement('div');
    el.classList.add('particle', 'font-terminal-code', 'text-terminal-code');
    el.innerText = chars[Math.floor(Math.random() * chars.length)];
    
    const startX = Math.random() * 100;
    const duration = 4 + Math.random() * 5;
    const size = 11 + Math.random() * 18;
    
    el.style.left = `${startX}vw`;
    el.style.bottom = '-40px';
    el.style.fontSize = `${size}px`;
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = `${duration}s`;
    
    container.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, duration * 1000);
  }

  for (let i = 0; i < 24; i++) {
    setTimeout(createParticle, Math.random() * 1200);
  }
  return setInterval(createParticle, 280);
}

/**
 * GitHeroTutorialModal
 * Interactive welcome and tutorial modal for first-time players.
 * Can be launched on first login or reopened anytime from the Manual / Help area.
 */

export class GitHeroTutorialModal {
  constructor(options = {}) {
    this.currentStep = 0;
    this.onComplete = options.onComplete || (() => {});
    this.onClose = options.onClose || (() => {});
    this.storageKey = 'githero_tutorial_seen';

    this.steps = [
      {
        id: 'welcome',
        badge: 'ORIENTATION',
        title: 'WELCOME TO GITHERO',
        icon: 'terminal',
        content: `
          <div class="space-y-3 text-xs font-terminal-code leading-relaxed text-on-surface-variant">
            <p>
              <strong class="text-primary font-bold">GitHero</strong> is an interactive command-line puzzle adventure designed to build genuine Git version-control intuition through tactile 2D puzzle mechanics.
            </p>
            <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface space-y-1.5">
              <div class="font-bold text-secondary text-[11px] uppercase font-terminal-label">Mission Objective</div>
              <p class="text-[11px] text-on-surface-variant">
                Guide your hero operative through 250 repository sectors across 20 worlds. Manipulate commit payloads onto designated target nodes, resolve repository state conflicts, and record verified commits to advance.
              </p>
            </div>
            <p class="text-[11px]">
              Every level is a visual representation of a real Git repository state. Your terminal commands directly manipulate branches, staging areas, and working trees.
            </p>
          </div>
        `
      },
      {
        id: 'mechanics',
        badge: 'ARCHITECTURE',
        title: 'HOW THE GAME WORKS',
        icon: 'grid_view',
        content: `
          <div class="space-y-3 text-xs font-terminal-code leading-relaxed text-on-surface-variant">
            <p>
              Each level takes place on a 2D sector grid representing a Git repository working directory:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <div class="font-bold text-primary flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-[14px]">person</span>
                  <span>Hero Operative</span>
                </div>
                <p class="text-on-surface-variant text-[10px]">Your active HEAD pointer. Move freely across open floor tiles.</p>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <div class="font-bold text-secondary flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-[14px]">inventory_2</span>
                  <span>Repository Box</span>
                </div>
                <p class="text-on-surface-variant text-[10px]">Unstaged changes / payload. Must be pushed or pulled to goals.</p>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <div class="font-bold text-tertiary flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-[14px]">flag</span>
                  <span>Target Goal Node</span>
                </div>
                <p class="text-on-surface-variant text-[10px]">Designated staging area. Staging all boxes unlocks commit verification.</p>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <div class="font-bold text-on-surface flex items-center gap-1.5 mb-1">
                  <span class="material-symbols-outlined text-[14px]">block</span>
                  <span>Obstacles & Walls</span>
                </div>
                <p class="text-on-surface-variant text-[10px]">Impassable barriers. Plan your paths carefully to prevent deadlocks.</p>
              </div>
            </div>
            <p class="text-[11px]">
              When all repository boxes are aligned on target nodes, the sector transitions to <code class="text-primary font-bold">STAGED</code>, allowing you to commit and complete the sector.
            </p>
          </div>
        `
      },
      {
        id: 'controls',
        badge: 'NAVIGATION',
        title: 'CONTROLS & MOVEMENT',
        icon: 'sports_esports',
        content: `
          <div class="space-y-3 text-xs font-terminal-code leading-relaxed text-on-surface-variant">
            <p>
              You can control your player using either your keyboard or on-screen directional buttons:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div class="font-bold text-on-surface font-headline-sm text-xs flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[16px]">keyboard</span>
                  <span>Keyboard Controls</span>
                </div>
                <div class="space-y-1 text-[11px] text-on-surface">
                  <div class="flex items-center justify-between"><span class="font-bold text-primary">↑ (Up Arrow)</span> <span>Move Up</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-primary">↓ (Down Arrow)</span> <span>Move Down</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-primary">← (Left Arrow)</span> <span>Move Left</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-primary">→ (Right Arrow)</span> <span>Move Right</span></div>
                </div>
                <div class="text-[10px] text-on-surface-variant/70 pt-1">
                  *(Also supports standard W, A, S, D keys)*
                </div>
              </div>

              <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                <div class="font-bold text-on-surface font-headline-sm text-xs flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-secondary text-[16px]">touch_app</span>
                  <span>On-Screen Controls</span>
                </div>
                <div class="space-y-1 text-[11px] text-on-surface">
                  <div class="flex items-center justify-between"><span class="font-bold text-secondary font-mono">[ ↑ ]</span> <span>Move Up Button</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-secondary font-mono">[ ↓ ]</span> <span>Move Down Button</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-secondary font-mono">[ ← ]</span> <span>Move Left Button</span></div>
                  <div class="flex items-center justify-between"><span class="font-bold text-secondary font-mono">[ → ]</span> <span>Move Right Button</span></div>
                </div>
                <div class="text-[10px] text-on-surface-variant/70 pt-1">
                  *(Tap buttons located on the touch HUD)*
                </div>
              </div>
            </div>

            <div class="p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-[11px] text-on-surface flex items-start gap-2">
              <span class="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">info</span>
              <span>
                <strong>Important:</strong> Keyboard controls and on-screen controls perform the <strong>exact same movement actions</strong>. Choose whichever control method suits your preference.
              </span>
            </div>
          </div>
        `
      },
      {
        id: 'progression',
        badge: 'PROGRESSION',
        title: 'LEVEL PROGRESSION & REWARDS',
        icon: 'trending_up',
        content: `
          <div class="space-y-3 text-xs font-terminal-code leading-relaxed text-on-surface-variant">
            <p>
              GitHero features <strong class="text-on-surface">250 strictly numbered levels</strong> organized across 20 progressive worlds:
            </p>
            <div class="space-y-2 text-[11px]">
              <div class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <span class="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                <span><strong>Sequential Unlock Chain:</strong> Level 1 is unlocked initially; Levels 2–250 are locked until the preceding level is solved.</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <span class="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span><strong>XP & Star Rating:</strong> Earn up to 3 stars per level based on move efficiency and minimal command execution.</span>
              </div>
              <div class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20">
                <span class="w-2 h-2 rounded-full bg-tertiary shrink-0"></span>
                <span><strong>Permanent Persistence:</strong> All progress, scores, and unlocks save automatically to your player profile.</span>
              </div>
            </div>
            <p class="text-[11px] pt-1">
              You are now ready to begin your journey. Initialize your terminal and conquer Sector 01!
            </p>
          </div>
        `
      }
    ];
  }

  isFirstTimePlayer() {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(this.storageKey) !== 'true';
  }

  markTutorialSeen() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, 'true');
    }
  }

  renderModalHtml() {
    const step = this.steps[this.currentStep];
    const isFirst = this.currentStep === 0;
    const isLast = this.currentStep === this.steps.length - 1;

    return `
      <div id="githero-tutorial-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in font-terminal-code">
        <div class="glass-panel w-full max-w-lg rounded-2xl border border-outline-variant/40 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden bg-surface-container-high/95">
          <!-- Step indicator header -->
          <div class="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-xl">${step.icon}</span>
              <div>
                <span class="text-[10px] font-bold tracking-widest text-primary font-terminal-label uppercase">${step.badge} (${this.currentStep + 1}/${this.steps.length})</span>
                <h2 class="text-sm font-bold text-on-surface font-headline-sm uppercase tracking-wide">${step.title}</h2>
              </div>
            </div>
            <button id="tutorial-skip-btn" class="text-[11px] text-on-surface-variant/70 hover:text-on-surface uppercase font-terminal-label transition-colors cursor-pointer">
              Skip Tutorial ✕
            </button>
          </div>

          <!-- Body Content -->
          <div class="min-h-[220px]">
            ${step.content}
          </div>

          <!-- Progress dots & navigation buttons -->
          <div class="flex items-center justify-between pt-2 border-t border-outline-variant/30">
            <!-- Dots -->
            <div class="flex items-center gap-1.5">
              ${this.steps.map((_, idx) => `
                <span class="w-2 h-2 rounded-full transition-all ${idx === this.currentStep ? 'w-5 bg-primary' : 'bg-outline-variant/40'}"></span>
              `).join('')}
            </div>

            <!-- Buttons -->
            <div class="flex items-center gap-2">
              ${!isFirst ? `
                <button id="tutorial-prev-btn" class="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-bright text-on-surface text-xs font-terminal-label uppercase transition-colors cursor-pointer">
                  Back
                </button>
              ` : ''}

              ${!isLast ? `
                <button id="tutorial-next-btn" class="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold font-terminal-label uppercase transition-colors shadow-md hover:shadow-primary/30 cursor-pointer">
                  Next →
                </button>
              ` : `
                <button id="tutorial-start-btn" class="px-5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold font-terminal-label uppercase transition-colors shadow-lg hover:shadow-primary/30 cursor-pointer flex items-center gap-1.5">
                  <span>Start Level 1</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mount(container = document.body) {
    let overlay = document.getElementById('githero-tutorial-overlay');
    if (overlay) overlay.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.renderModalHtml();
    container.appendChild(wrapper.firstElementChild);
    this.bindEvents();
  }

  bindEvents() {
    const overlay = document.getElementById('githero-tutorial-overlay');
    if (!overlay) return;

    const skipBtn = overlay.querySelector('#tutorial-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.markTutorialSeen();
        overlay.remove();
        this.onClose();
      });
    }

    const prevBtn = overlay.querySelector('#tutorial-prev-btn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentStep > 0) {
          this.currentStep--;
          this.mount();
        }
      });
    }

    const nextBtn = overlay.querySelector('#tutorial-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++;
          this.mount();
        }
      });
    }

    const startBtn = overlay.querySelector('#tutorial-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.markTutorialSeen();
        overlay.remove();
        this.onComplete();
      });
    }
  }
}

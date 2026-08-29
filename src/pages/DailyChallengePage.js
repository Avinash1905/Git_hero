/**
 * DailyChallengePage
 * Connects to real daily challenge backend service.
 * Displays today's mission, countdown timer, modifiers, and start button.
 */

export function renderDailyChallengePage(challengeData = null) {
  const challenge = challengeData || {
    title: 'Memory Leak Substation',
    description: 'A severe memory leak has been detected in the core module. Navigate the fragmented memory grid to isolate and terminate the rogue processes before buffer exhaustion.',
    difficulty: 'HARD',
    reward_xp: 1000,
    grid_size: '8x8',
    is_completed: false
  };

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span>Daily Transmission</span>
        </div>
        <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
          Daily Protocol Challenge
        </h1>
        <p class="text-on-surface-variant text-sm font-terminal-code">
          Procedurally generated daily scenario featuring unique constraints and enhanced XP rewards
        </p>
      </div>

      <!-- Challenge Hero Card -->
      <div class="glass-panel p-6 md:p-8 rounded-2xl border border-tertiary/40 shadow-xl relative overflow-hidden space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-terminal-label text-tertiary uppercase font-bold tracking-wider">
              Today's Objective
            </span>
            <h2 class="text-2xl font-bold text-on-surface mt-1">${challenge.title}</h2>
          </div>

          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-lg bg-tertiary/20 text-tertiary font-terminal-label text-xs font-bold border border-tertiary/30">
              +${challenge.reward_xp} XP
            </span>
            <span class="px-3 py-1 rounded-lg bg-error/15 text-error font-terminal-label text-xs font-bold border border-error/30">
              ${challenge.difficulty}
            </span>
          </div>
        </div>

        <p class="text-sm text-on-surface-variant font-terminal-code leading-relaxed max-w-2xl">
          ${challenge.description}
        </p>

        <!-- Modifiers List -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-terminal-code text-xs">
          <div class="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <span class="text-on-surface-variant/70 text-[10px] uppercase block">Grid Dimensions</span>
            <span class="text-on-surface font-bold mt-0.5 block">${challenge.grid_size || '8x8 Arena'}</span>
          </div>
          <div class="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <span class="text-on-surface-variant/70 text-[10px] uppercase block">Move Constraint</span>
            <span class="text-primary font-bold mt-0.5 block">Max 35 Moves</span>
          </div>
          <div class="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
            <span class="text-on-surface-variant/70 text-[10px] uppercase block">Special Rule</span>
            <span class="text-secondary font-bold mt-0.5 block">Strict Commit Stash</span>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-4 flex items-center justify-between">
          <span class="text-xs text-on-surface-variant font-terminal-code">
            Expires in 11h 42m
          </span>

          <button 
            id="start-daily-btn"
            class="px-8 py-3 rounded-xl bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-terminal-label font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-tertiary/30 flex items-center gap-2 cursor-pointer"
          >
            <span>Launch Simulation</span>
            <span class="material-symbols-outlined text-lg">play_arrow</span>
          </button>
        </div>
      </div>
    </main>
  `;
}

/**
 * AchievementUnlockModal
 * Pop-up celebration dialog displayed when an achievement is unlocked during gameplay.
 */

export function renderAchievementUnlockModal(achievement) {
  return `
    <div id="achievement-unlock-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in font-terminal-code">
      <div class="glass-panel w-full max-w-sm rounded-2xl p-6 border border-tertiary/40 shadow-2xl relative text-center space-y-4 animate-scale-up">
        <div class="w-16 h-16 rounded-2xl bg-tertiary/20 text-tertiary border border-tertiary/40 flex items-center justify-center mx-auto shadow-lg shadow-tertiary/20">
          <span class="material-symbols-outlined text-3xl">${achievement.icon || 'military_tech'}</span>
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary text-[10px] font-terminal-label font-bold uppercase tracking-wider">
          <span>Badge Unlocked</span>
        </div>

        <div>
          <h3 class="text-lg font-bold text-on-surface font-headline-sm">${achievement.title}</h3>
          <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">${achievement.description}</p>
        </div>

        <div class="p-2.5 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20 flex items-center justify-between text-xs">
          <span class="text-on-surface-variant">Bounty Awarded</span>
          <span class="text-primary font-bold">+${achievement.xp_reward || 500} XP</span>
        </div>

        <button 
          id="achievement-ack-btn"
          class="w-full py-2.5 rounded-xl bg-tertiary hover:bg-tertiary/90 text-on-tertiary font-terminal-label text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Acknowledge
        </button>
      </div>
    </div>
  `;
}

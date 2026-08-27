/**
 * AchievementsPage
 * Connects achievement UI to real backend data.
 * Displays achievements categorized, locked/unlocked states, progress meters, and reward claiming.
 */

import { achievementStore } from '../state/LeaderboardStore.js';

export function renderAchievementsPage() {
  const { achievements, filterCategory, isLoading } = achievementStore.getState();

  const cardsHtml = achievements.map((ach) => {
    const isUnlocked = Boolean(ach.unlocked);
    const progress = ach.progress || 0;
    const max = ach.max_progress || 1;
    const pct = Math.min(100, Math.round((progress / max) * 100));

    return `
      <div class="glass-panel p-5 rounded-2xl border ${isUnlocked ? 'border-primary/40 shadow-lg shadow-primary/5' : 'border-outline-variant/20 opacity-60'} transition-all flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-surface-container-high text-on-surface-variant'}">
              <span class="material-symbols-outlined text-xl">${ach.icon || 'emoji_events'}</span>
            </div>

            <span class="text-[10px] font-terminal-label font-bold px-2 py-0.5 rounded ${isUnlocked ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}">
              ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </span>
          </div>

          <h3 class="text-headline-sm font-bold text-on-surface text-base group-hover:text-primary transition-colors">
            ${ach.title}
          </h3>
          <p class="text-xs text-on-surface-variant font-terminal-code mt-1 leading-relaxed">
            ${ach.description}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-surface-variant/30 font-terminal-code">
          <div class="flex justify-between items-center text-[10px] mb-1">
            <span class="text-on-surface-variant">${progress}/${max} Progress</span>
            <span class="text-primary font-bold">+${ach.xp_reward} XP</span>
          </div>
          <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
            <div class="bg-primary h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-6xl mx-auto space-y-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Repository Badges</span>
        </div>
        <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
          Mastery Achievements
        </h1>
        <p class="text-on-surface-variant text-sm font-terminal-code">
          Accomplish milestones across puzzle navigation, command precision, and speed
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${isLoading ? '<div class="col-span-full text-center py-12 text-primary font-terminal-code">Loading achievements...</div>' : cardsHtml}
      </div>
    </main>
  `;
}

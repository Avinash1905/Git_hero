/**
 * QuestWidget
 * Bento card widget displaying active daily and weekly objectives for the Dashboard.
 */

import { questManager } from './QuestManager.js';

export class QuestWidget {
  static renderHtml() {
    const quests = questManager.getActiveQuests();

    const itemsHtml = quests.map((q) => {
      const pct = Math.min(100, Math.round((q.progress / q.target) * 100));

      return `
        <div class="glass-panel p-3.5 rounded-xl border ${q.completed ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/20'} flex flex-col justify-between font-terminal-code text-xs">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg ${q.completed ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center">
                <span class="material-symbols-outlined text-[16px]">${q.icon}</span>
              </div>
              <div>
                <div class="font-bold text-on-surface">${q.title}</div>
                <div class="text-[10px] text-on-surface-variant line-clamp-1">${q.description}</div>
              </div>
            </div>

            <span class="text-[11px] font-bold text-primary shrink-0">+${q.rewardXp} XP</span>
          </div>

          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="flex-1">
              <div class="flex justify-between text-[10px] text-on-surface-variant mb-1">
                <span>${q.progress}/${q.target}</span>
                <span>${pct}%</span>
              </div>
              <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div class="bg-primary h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
              </div>
            </div>

            ${q.completed && !q.claimed ? `
              <button 
                data-claim-quest="${q.id}" 
                class="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-[10px] font-bold uppercase transition-all shadow cursor-pointer"
              >
                Claim
              </button>
            ` : q.claimed ? `
              <span class="text-[10px] font-terminal-label text-primary font-bold">CLAIMED</span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-on-surface font-terminal-code uppercase tracking-wider flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">military_tech</span>
            <span>Active Assignments & Bounties</span>
          </h3>
          <span class="text-[10px] font-terminal-label text-on-surface-variant">Resets in 14h</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${itemsHtml}
        </div>
      </div>
    `;
  }
}

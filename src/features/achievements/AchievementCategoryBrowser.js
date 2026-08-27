/**
 * AchievementCategoryBrowser
 * Interactive achievement gallery with category filtering, search, progress stats, and unlock animations.
 */

import { achievementRegistry } from './AchievementRegistry.js';

export class AchievementCategoryBrowser {
  constructor() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
  }

  /**
   * Filter achievements by category and search keyword
   */
  getFilteredAchievements(unlockedIds = [], category = 'all', query = '') {
    let list = achievementRegistry.getAll();

    if (category !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      const q = query.toLowerCase().trim();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
    }

    return list.map(a => ({
      ...a,
      isUnlocked: unlockedIds.includes(a.id)
    }));
  }

  /**
   * Render HTML browser markup
   */
  renderHtml(unlockedIds = [], options = {}) {
    const { onSelectCategory = 'handleSelectAchCategory', onSearch = 'handleSearchAch' } = options;
    const categories = ['all', ...achievementRegistry.getCategories()];
    const filtered = this.getFilteredAchievements(unlockedIds, this.selectedCategory, this.searchQuery);

    const totalCount = achievementRegistry.getAll().length;
    const unlockedCount = unlockedIds.length;
    const progressPct = Math.round((unlockedCount / totalCount) * 100);

    const categoryTabs = categories.map(cat => `
      <button 
        type="button" 
        onclick="${onSelectCategory}('${cat}')"
        class="px-3 py-1.5 rounded-xl font-mono text-xs capitalize transition-all cursor-pointer ${this.selectedCategory === cat ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
      >
        ${cat}
      </button>
    `).join('');

    const cards = filtered.map(a => `
      <div class="p-4 rounded-2xl border ${a.isUnlocked ? 'border-primary/40 bg-surface-container-low' : 'border-outline-variant/15 bg-surface-container-lowest/40 opacity-60'} space-y-2 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl ${a.isUnlocked ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface-container text-on-surface-variant border border-outline-variant/20'}">
              <span class="material-symbols-outlined text-2xl">${a.icon}</span>
            </div>
            <div>
              <div class="font-mono text-xs font-bold ${a.isUnlocked ? 'text-on-surface' : 'text-on-surface-variant'}">${a.name}</div>
              <div class="text-[10px] text-on-surface-variant uppercase font-mono">${a.category}</div>
            </div>
          </div>
          <span class="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isUnlocked ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container text-on-surface-variant'}">
            +${a.xp} XP
          </span>
        </div>
        <p class="text-xs text-on-surface-variant leading-relaxed">${a.desc}</p>
        <div class="text-[10px] font-mono ${a.isUnlocked ? 'text-primary font-bold' : 'text-on-surface-variant/60'} flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">${a.isUnlocked ? 'verified' : 'lock'}</span>
          <span>${a.isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-6">
        <!-- Progress Header -->
        <div class="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold font-mono text-on-surface uppercase tracking-wider">Operative Achievements</h2>
              <p class="text-xs text-on-surface-variant">Unlock milestones across 20 worlds and 250 tactical Git sectors</p>
            </div>
            <div class="text-right font-mono">
              <div class="text-2xl font-bold text-primary">${unlockedCount} / ${totalCount}</div>
              <div class="text-[10px] text-on-surface-variant uppercase font-bold">${progressPct}% Completed</div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2.5 rounded-full bg-surface-container-lowest overflow-hidden border border-outline-variant/20">
            <div class="h-full bg-primary rounded-full transition-all duration-500 shadow-sm shadow-primary" style="width: ${progressPct}%"></div>
          </div>

          <!-- Category Tabs -->
          <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/10">
            ${categoryTabs}
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const achievementCategoryBrowser = new AchievementCategoryBrowser();

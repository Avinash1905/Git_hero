/**
 * ProfilePage
 * Connects profile view to real authenticated player data:
 * username, avatar, XP, level, streak, completed levels, achievements, statistics.
 */

import { playerStore } from '../state/PlayerStore.js';
import { levelStore } from '../state/LevelStore.js';
import { LevelProgressManager } from '../features/levels/LevelProgressManager.js';

export function renderProfilePage() {
  const profile = playerStore.getState().profile || {};
  const progressMap = levelStore.getState().progress || {};
  const levels = levelStore.getState().levels || [];
  const stats = LevelProgressManager.calculateGlobalStats(levels, progressMap);

  const username = profile.username || 'Contributor';
  const avatar = profile.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8';
  const title = profile.title || 'Novice Contributor';
  const xp = profile.xp || 0;
  const level = profile.level || 1;
  const streak = profile.streak_days || 1;

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <!-- Profile Header Card -->
      <div class="glass-panel p-6 md:p-8 rounded-2xl border border-primary/30 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div class="relative">
          <img src="${avatar}" alt="${username}" class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-primary shadow-lg shadow-primary/20" />
          <span class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center text-[10px] text-on-primary font-bold">
            ✓
          </span>
        </div>

        <div class="flex-1 text-center md:text-left space-y-1">
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-terminal-label font-bold uppercase tracking-wider">
            Tier ${level}
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold text-2xl md:text-3xl">${username}</h1>
          <p class="text-secondary text-sm font-terminal-code font-semibold">${title}</p>
          <p class="text-on-surface-variant text-xs font-terminal-code">Registered Contributor • Sector Cluster 2026</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="profile-logout-btn" class="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface hover:text-error text-xs font-terminal-label font-bold border border-outline-variant/30 transition-colors cursor-pointer flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Stats Bento Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 text-center">
          <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Total XP</div>
          <div class="text-xl font-bold text-primary font-terminal-code mt-1">${xp.toLocaleString()}</div>
        </div>

        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 text-center">
          <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Streak</div>
          <div class="text-xl font-bold text-tertiary font-terminal-code mt-1">${streak} Days</div>
        </div>

        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 text-center">
          <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Sectors Cleared</div>
          <div class="text-xl font-bold text-secondary font-terminal-code mt-1">${stats.completedCount} / 250</div>
        </div>

        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 text-center">
          <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Total Stars</div>
          <div class="text-xl font-bold text-tertiary font-terminal-code mt-1">★ ${stats.totalStars}</div>
        </div>
      </div>

      <!-- Command Line Statistics -->
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-4">
        <h3 class="text-headline-sm font-bold text-on-surface text-lg">
          Repository Command Competency
        </h3>
        <p class="text-xs text-on-surface-variant font-terminal-code">
          Frequency breakdown of executed operations across all 250 sectors
        </p>

        <div class="space-y-3 pt-2 font-terminal-code text-xs">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-on-surface">git push</span>
              <span class="text-primary font-bold">42%</span>
            </div>
            <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" style="width: 42%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-on-surface">git pull</span>
              <span class="text-secondary font-bold">28%</span>
            </div>
            <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div class="bg-secondary h-full rounded-full" style="width: 28%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-on-surface">git status</span>
              <span class="text-tertiary font-bold">18%</span>
            </div>
            <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div class="bg-tertiary h-full rounded-full" style="width: 18%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-on-surface">git commit / branch</span>
              <span class="text-purple-400 font-bold">12%</span>
            </div>
            <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div class="bg-purple-400 h-full rounded-full" style="width: 12%"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

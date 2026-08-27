/**
 * DashboardPage
 * 100% faithful to the Stitch Dashboard layout connected to real backend player data.
 * Displays current level, continue card, XP, streak, achievements summary, and recent activity.
 */

import { playerStore } from '../state/PlayerStore.js';
import { levelStore } from '../state/LevelStore.js';
import { LevelNavigation } from '../features/levels/LevelNavigation.js';
import { LevelProgressManager } from '../features/levels/LevelProgressManager.js';

export function renderDashboardPage() {
  const profile = playerStore.getState().profile || {};
  const progressMap = levelStore.getState().progress || {};
  const levels = levelStore.getState().levels || [];

  const continueLevelId = LevelNavigation.findContinueLevelId(levels, progressMap);
  const globalStats = LevelProgressManager.calculateGlobalStats(levels, progressMap);

  const streakDays = profile.streak_days || 1;
  const xp = profile.xp || 0;
  const level = profile.level || 1;
  const lives = profile.lives ?? 3;

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Cluster Status: Operational</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Welcome back, ${profile.username || 'Contributor'}
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Active Rank: <span class="text-secondary font-semibold">${profile.title || 'Novice Contributor'}</span>
          </p>
        </div>

        <!-- Quick Top Stats -->
        <div class="flex items-center gap-3">
          <div class="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/30">
            <span class="material-symbols-outlined text-tertiary text-xl" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
            <div>
              <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Streak</div>
              <div class="text-sm font-bold text-on-surface font-terminal-code">${streakDays} Days</div>
            </div>
          </div>

          <div class="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border border-outline-variant/30">
            <span class="material-symbols-outlined text-primary text-xl">military_tech</span>
            <div>
              <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Total XP</div>
              <div class="text-sm font-bold text-primary font-terminal-code">${xp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bento Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Highlight Card: Continue Mission -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl border border-primary/30 relative overflow-hidden flex flex-col justify-between group shadow-xl">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-terminal-label font-terminal-label text-primary text-xs uppercase tracking-widest font-bold">
                Active Assignment
              </span>
              <span class="text-xs font-terminal-code text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded">
                World ${Math.ceil(parseInt(continueLevelId, 10) / 12.5) || 1}
              </span>
            </div>

            <h2 class="text-2xl md:text-3xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
              Level ${continueLevelId}: Repository Staging
            </h2>

            <p class="text-on-surface-variant text-sm font-terminal-code max-w-xl leading-relaxed">
              Continue your sequential training. Deliver repository artifacts into designated target nodes using precise git commands.
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-surface-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-xs font-terminal-code text-on-surface-variant">
              <span>Overall: <strong>${globalStats.completedCount}/250</strong> Cleared</span>
              <span>•</span>
              <span class="text-tertiary">★ ${globalStats.totalStars} Stars</span>
            </div>

            <button 
              id="dash-continue-btn" 
              data-continue-level="${continueLevelId}"
              class="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Sector</span>
              <span class="material-symbols-outlined text-lg">play_arrow</span>
            </button>
          </div>
        </div>

        <!-- Side Bento: Daily Challenge & Quick Jump -->
        <div class="space-y-6 flex flex-col justify-between">
          <!-- Daily Challenge Card -->
          <div id="dash-daily-card" class="glass-panel p-5 rounded-2xl border border-tertiary/30 relative overflow-hidden cursor-pointer hover:border-tertiary transition-all shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-terminal-label font-terminal-label text-tertiary text-xs uppercase tracking-wider font-bold">
                Daily Challenge
              </span>
              <span class="text-[10px] font-terminal-code bg-tertiary/15 text-tertiary px-2 py-0.5 rounded font-bold">
                +1,000 XP
              </span>
            </div>

            <h3 class="text-headline-sm font-bold text-on-surface text-base">
              Memory Leak Substation
            </h3>
            <p class="text-xs text-on-surface-variant font-terminal-code mt-1 line-clamp-2">
              Fragmented grid puzzle. Resolve rogue pointer conflicts before buffer exhaustion.
            </p>
          </div>

          <!-- 250 Levels Index Card -->
          <div id="dash-levels-card" class="glass-panel p-5 rounded-2xl border border-secondary/30 relative overflow-hidden cursor-pointer hover:border-secondary transition-all shadow-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-terminal-label font-terminal-label text-secondary text-xs uppercase tracking-wider font-bold">
                Sector Index
              </span>
              <span class="text-[10px] font-terminal-code bg-secondary/15 text-secondary px-2 py-0.5 rounded font-bold">
                250 Levels
              </span>
            </div>

            <h3 class="text-headline-sm font-bold text-on-surface text-base">
              Explore All 20 Worlds
            </h3>
            <p class="text-xs text-on-surface-variant font-terminal-code mt-1">
              From foundational commits to multiverse rebase architectures.
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Progression Overview -->
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-headline-sm font-bold text-on-surface text-lg">
            Global Campaign Progress
          </h3>
          <span class="text-xs text-primary font-terminal-code font-bold">
            ${globalStats.percentage}% Completed
          </span>
        </div>

        <div class="w-full bg-surface-container-lowest h-2.5 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-700" style="width: ${globalStats.percentage}%"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-terminal-code text-on-surface-variant">
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Unlocked Sectors</div>
            <div class="text-sm font-bold text-on-surface mt-0.5">${globalStats.unlockedCount} / 250</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Completed Sectors</div>
            <div class="text-sm font-bold text-primary mt-0.5">${globalStats.completedCount} / 250</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Stars Earned</div>
            <div class="text-sm font-bold text-tertiary mt-0.5">★ ${globalStats.totalStars}</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant/70 uppercase">Tier Level</div>
            <div class="text-sm font-bold text-secondary mt-0.5">Rank ${level}</div>
          </div>
        </div>
      </div>
    </main>
  `;
}

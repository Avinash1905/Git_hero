/**
 * LeaderboardPage
 * Connects leaderboard to real backend data.
 * Displays global and weekly rankings, player rank card, and empty states when no players exist.
 * No fake users.
 */

import { leaderboardStore } from '../state/LeaderboardStore.js';
import { playerStore } from '../state/PlayerStore.js';

export function renderLeaderboardPage() {
  const { activeTab, rankings, isLoading } = leaderboardStore.getState();
  const profile = playerStore.getState().profile || {};

  const hasRankings = Array.isArray(rankings) && rankings.length > 0;

  const rowsHtml = hasRankings ? rankings.map((r, index) => {
    const isMe = r.username === profile.username || r.user_id === profile.user_id;
    const rank = index + 1;

    let rankBadge = `<span class="font-bold text-on-surface-variant">#${rank}</span>`;
    if (rank === 1) rankBadge = `<span class="text-tertiary font-bold flex items-center gap-0.5">🥇 #1</span>`;
    if (rank === 2) rankBadge = `<span class="text-secondary font-bold flex items-center gap-0.5">🥈 #2</span>`;
    if (rank === 3) rankBadge = `<span class="text-primary font-bold flex items-center gap-0.5">🥉 #3</span>`;

    return `
      <div class="glass-panel p-4 rounded-xl flex items-center justify-between border ${isMe ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/20 hover:border-outline-variant/40'} transition-all font-terminal-code text-xs">
        <div class="flex items-center gap-4">
          <div class="w-12 text-center">${rankBadge}</div>
          <div class="flex items-center gap-3">
            <img src="${r.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8'}" alt="" class="w-8 h-8 rounded-full object-cover border border-outline-variant/40" />
            <div>
              <div class="font-bold text-on-surface flex items-center gap-1.5">
                <span>${r.username}</span>
                ${isMe ? `<span class="bg-primary/20 text-primary text-[9px] px-1.5 py-0.2 rounded font-terminal-label uppercase">YOU</span>` : ''}
              </div>
              <div class="text-[10px] text-on-surface-variant/80">${r.title || 'Contributor'} • Level ${r.level || 1}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6 text-right">
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase">Cleared</div>
            <div class="text-secondary font-bold">${r.completed_levels || 0}/250</div>
          </div>
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase">XP</div>
            <div class="text-primary font-bold">${(r.xp || 0).toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="glass-panel p-12 rounded-2xl border border-outline-variant/30 text-center space-y-3">
      <span class="material-symbols-outlined text-4xl text-on-surface-variant/60">leaderboard</span>
      <h3 class="text-headline-sm font-bold text-on-surface text-base">No Standings Recorded</h3>
      <p class="text-xs text-on-surface-variant font-terminal-code max-w-sm mx-auto">
        Complete repository sectors to record verified run times and place your name on the cluster leaderboard.
      </p>
    </div>
  `;

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Cluster Leaderboard</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Verified Contributor Standings
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Top ranked developers based on completed sectors, commit efficiency, and verified XP
          </p>
        </div>

        <!-- Tab Selector -->
        <div class="flex items-center gap-1 bg-surface-container-high/80 p-1 rounded-xl border border-outline-variant/30">
          <button 
            id="tab-global-btn" 
            class="px-4 py-1.5 rounded-lg text-xs font-terminal-label transition-colors cursor-pointer ${activeTab === 'global' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface'}"
          >
            Global
          </button>
          <button 
            id="tab-weekly-btn" 
            class="px-4 py-1.5 rounded-lg text-xs font-terminal-label transition-colors cursor-pointer ${activeTab === 'weekly' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface'}"
          >
            Weekly Sprint
          </button>
        </div>
      </div>

      <!-- Rankings List -->
      <div class="space-y-2">
        ${isLoading ? '<div class="text-center py-12 text-primary font-terminal-code">Loading cluster standings...</div>' : rowsHtml}
      </div>
    </main>
  `;
}

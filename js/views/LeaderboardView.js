// LeaderboardView - 100% faithful to Stitch Leaderboard Screen

import { MockBackend } from '../services/MockBackend.js';

export function renderLeaderboardView(activeTab = 'global', onTabChange) {
  const rankingData = MockBackend.getLeaderboard(activeTab);

  const rowsHtml = rankingData.map(item => {
    let rankBadge = '';
    if (item.rank === 1) {
      rankBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-hud-stat text-hud-stat glow-box border border-primary/50">1</span>`;
    } else if (item.rank === 2) {
      rankBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary font-hud-stat text-hud-stat">2</span>`;
    } else if (item.rank === 3) {
      rankBadge = `<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-tertiary/10 text-tertiary font-hud-stat text-hud-stat">3</span>`;
    } else {
      rankBadge = `<span class="font-terminal-code text-on-surface-variant font-bold">${item.rank}</span>`;
    }

    const isUser = item.isUser;

    return `
      <tr class="border-b border-outline-variant/20 ${isUser ? 'bg-primary/10 border-primary/30' : 'hover:bg-surface-bright/50'} transition-colors group">
        <td class="p-4 text-center">
          ${rankBadge}
        </td>
        <td class="p-4">
          <div class="flex items-center gap-3">
            <img alt="Avatar" class="w-10 h-10 rounded border ${isUser ? 'border-primary' : 'border-outline-variant'} object-cover" src="${item.avatar}">
            <div>
              <div class="font-bold ${isUser ? 'text-primary glow-text' : 'text-on-surface group-hover:text-secondary'} transition-colors">
                ${item.handle}
              </div>
              <div class="text-xs text-on-surface-variant font-terminal-code">${item.title}</div>
            </div>
          </div>
        </td>
        <td class="p-4 hidden sm:table-cell text-on-surface font-terminal-code">${item.xp}</td>
        <td class="p-4 hidden md:table-cell text-on-surface-variant font-terminal-code">${item.levels}</td>
        <td class="p-4 text-right font-hud-stat text-hud-stat ${isUser ? 'text-primary' : 'text-secondary'}">${item.score}</td>
      </tr>
    `;
  }).join('');

  return `
    <main class="flex-grow pt-24 pb-28 md:pb-12 px-4 md:px-hud-margin max-w-7xl mx-auto w-full min-h-screen">
      <!-- Header Section -->
      <div class="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-display-lg font-display-lg text-on-surface mb-2">Global Ranking</h1>
          <p class="text-terminal-code font-terminal-code text-on-surface-variant">Top performers across all repositories.</p>
        </div>
        
        <!-- Tabs -->
        <div class="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant/30">
          <button id="tab-global-btn" class="px-6 py-2 rounded-md ${activeTab === 'global' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Global
          </button>
          <button id="tab-friends-btn" class="px-6 py-2 rounded-md ${activeTab === 'friends' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Friends
          </button>
          <button id="tab-weekly-btn" class="px-6 py-2 rounded-md ${activeTab === 'weekly' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Weekly
          </button>
        </div>
      </div>

      <!-- Leaderboard Table Container (Glassmorphism) -->
      <div class="glass-panel rounded-xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest border-b border-outline-variant/50">
                <th class="p-4 text-terminal-label font-terminal-label text-on-surface-variant w-16 text-center">Rank</th>
                <th class="p-4 text-terminal-label font-terminal-label text-on-surface-variant">User</th>
                <th class="p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden sm:table-cell">XP</th>
                <th class="p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden md:table-cell">Levels</th>
                <th class="p-4 text-terminal-label font-terminal-label text-on-surface-variant text-right">Score</th>
              </tr>
            </thead>
            <tbody class="text-body-md font-body-md">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
}

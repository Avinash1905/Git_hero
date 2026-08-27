// LeaderboardView - Expanded with search, filter, sort, top-3 medals, and win/loss stats

import { MockBackend } from '../services/MockBackend.js';

export function renderLeaderboardView(activeTab = 'global', onTabChange) {
  const allData = MockBackend.getLeaderboard(activeTab);

  // ── Controls state (stored on window to survive re-renders) ──────────────
  const searchQuery  = window._lbSearch  || '';
  const filterMode   = window._lbFilter  || 'all';
  const sortKey      = window._lbSort    || 'rank';
  const sortDir      = window._lbSortDir || 'asc';

  // ── Filter ────────────────────────────────────────────────────────────────
  let filtered = [...allData];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.handle.toLowerCase().includes(q) ||
      (p.name && p.name.toLowerCase().includes(q))
    );
  }
  if (filterMode === 'top10')   filtered = filtered.slice(0, 10);
  if (filterMode === 'top20')   filtered = filtered.slice(0, 20);
  if (filterMode === 'winners') filtered = filtered.filter(p => p.wins > p.losses);

  // ── Sort ──────────────────────────────────────────────────────────────────
  const multiplier = sortDir === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    switch (sortKey) {
      case 'rank':          return (a.rank - b.rank) * multiplier;
      case 'score':         return (b.scoreRaw - a.scoreRaw) * multiplier;
      case 'wins':          return (b.wins - a.wins) * multiplier;
      case 'winPct':        return (b.winPercentage - a.winPercentage) * multiplier;
      case 'games':         return (b.games - a.games) * multiplier;
      default:              return 0;
    }
  });

  // ── Rank Badge ────────────────────────────────────────────────────────────
  function rankBadge(item) {
    if (item.rank === 1) return `<span class="rank-medal rank-gold">🥇</span>`;
    if (item.rank === 2) return `<span class="rank-medal rank-silver">🥈</span>`;
    if (item.rank === 3) return `<span class="rank-medal rank-bronze">🥉</span>`;
    return `<span class="font-terminal-code text-on-surface-variant font-bold text-sm">#${item.rank}</span>`;
  }

  // ── Table Rows ────────────────────────────────────────────────────────────
  const rowsHtml = filtered.length === 0
    ? `<tr><td colspan="8" class="p-8 text-center text-on-surface-variant font-terminal-code">No players match your search.</td></tr>`
    : filtered.map(item => {
        const isUser = item.isUser;
        const topRow = item.rank <= 3 ? 'lb-top-row' : '';
        const winPct = item.winPercentage !== undefined ? item.winPercentage.toFixed(1) + '%' : '—';
        const winColor = item.winPercentage >= 75 ? 'text-primary' : item.winPercentage >= 50 ? 'text-secondary' : 'text-tertiary';

        return `
          <tr class="border-b border-outline-variant/20 ${isUser ? 'bg-primary/10 border-primary/30' : `hover:bg-surface-bright/50 ${topRow}`} transition-colors group">
            <td class="p-3 md:p-4 text-center w-14">
              ${rankBadge(item)}
            </td>
            <td class="p-3 md:p-4">
              <div class="flex items-center gap-3">
                <img alt="Avatar" class="w-9 h-9 md:w-10 md:h-10 rounded border ${isUser ? 'border-primary' : 'border-outline-variant'} object-cover flex-shrink-0" src="${item.avatar}">
                <div class="min-w-0">
                  <div class="font-bold truncate ${isUser ? 'text-primary glow-text' : 'text-on-surface group-hover:text-secondary'} transition-colors text-sm md:text-base">
                    ${item.handle}
                  </div>
                  <div class="text-xs text-on-surface-variant font-terminal-code">${item.title}</div>
                </div>
              </div>
            </td>
            <td class="p-3 md:p-4 hidden sm:table-cell text-on-surface font-terminal-code text-sm">${item.xp}</td>
            <td class="p-3 md:p-4 hidden md:table-cell text-on-surface-variant font-terminal-code text-sm">${item.levels}</td>
            <td class="p-3 md:p-4 hidden lg:table-cell text-center text-on-surface-variant font-terminal-code text-sm">${item.games ?? '—'}</td>
            <td class="p-3 md:p-4 hidden lg:table-cell text-center text-primary font-terminal-code text-sm font-bold">${item.wins ?? '—'}</td>
            <td class="p-3 md:p-4 hidden xl:table-cell text-center text-error font-terminal-code text-sm">${item.losses ?? '—'}</td>
            <td class="p-3 md:p-4 hidden xl:table-cell text-center ${winColor} font-terminal-code text-sm font-bold">${winPct}</td>
            <td class="p-3 md:p-4 text-right font-hud-stat text-hud-stat ${isUser ? 'text-primary' : 'text-secondary'} whitespace-nowrap">${item.score}</td>
          </tr>
        `;
      }).join('');

  // ── Sort indicator helper ─────────────────────────────────────────────────
  function sortIcon(key) {
    if (sortKey !== key) return `<span class="text-outline opacity-40 ml-1">↕</span>`;
    return sortDir === 'asc'
      ? `<span class="text-primary ml-1">↑</span>`
      : `<span class="text-primary ml-1">↓</span>`;
  }

  return `
    <main class="flex-grow pt-24 pb-28 md:pb-12 px-4 md:px-hud-margin max-w-7xl mx-auto w-full min-h-screen">

      <!-- Header Section -->
      <div class="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-display-lg font-display-lg text-on-surface mb-2">Global Ranking</h1>
          <p class="text-terminal-code font-terminal-code text-on-surface-variant">Top performers across all repositories. ${allData.length} players ranked.</p>
        </div>

        <!-- Tabs -->
        <div class="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant/30 self-start md:self-auto">
          <button id="tab-global-btn" class="px-5 py-2 rounded-md ${activeTab === 'global' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Global
          </button>
          <button id="tab-friends-btn" class="px-5 py-2 rounded-md ${activeTab === 'friends' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Friends
          </button>
          <button id="tab-weekly-btn" class="px-5 py-2 rounded-md ${activeTab === 'weekly' ? 'bg-primary/15 text-primary font-terminal-label text-terminal-label border border-primary/30 glow-box' : 'text-on-surface-variant hover:text-on-surface font-terminal-label text-terminal-label'} transition-all">
            Weekly
          </button>
        </div>
      </div>

      <!-- Search + Filter + Sort Controls -->
      <div class="mb-md flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

        <!-- Search -->
        <div class="relative flex-grow max-w-sm">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">🔍</span>
          <input
            id="lb-search-input"
            type="text"
            placeholder="Search player..."
            value="${searchQuery.replace(/"/g, '&quot;')}"
            class="w-full pl-9 pr-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 placeholder-on-surface-variant/60 transition-colors"
          >
        </div>

        <!-- Filter -->
        <select id="lb-filter-select" class="px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary/60 cursor-pointer">
          <option value="all"     ${filterMode === 'all'     ? 'selected' : ''}>All Players</option>
          <option value="top10"   ${filterMode === 'top10'   ? 'selected' : ''}>Top 10</option>
          <option value="top20"   ${filterMode === 'top20'   ? 'selected' : ''}>Top 20</option>
          <option value="winners" ${filterMode === 'winners' ? 'selected' : ''}>Winners (W &gt; L)</option>
        </select>

        <!-- Sort -->
        <select id="lb-sort-select" class="px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface font-terminal-code text-sm focus:outline-none focus:border-primary/60 cursor-pointer">
          <option value="rank"    ${sortKey === 'rank'    ? 'selected' : ''}>Sort: Rank</option>
          <option value="score"   ${sortKey === 'score'   ? 'selected' : ''}>Sort: Score</option>
          <option value="wins"    ${sortKey === 'wins'    ? 'selected' : ''}>Sort: Wins</option>
          <option value="winPct"  ${sortKey === 'winPct'  ? 'selected' : ''}>Sort: Win %</option>
          <option value="games"   ${sortKey === 'games'   ? 'selected' : ''}>Sort: Games</option>
        </select>

        <!-- Sort Direction Toggle -->
        <button id="lb-sort-dir-btn" title="Toggle sort direction"
          class="px-4 py-2.5 bg-surface-container-high border border-outline-variant/40 rounded-lg text-on-surface font-terminal-code text-sm hover:border-primary/50 hover:text-primary transition-colors">
          ${sortDir === 'asc' ? '↑ ASC' : '↓ DESC'}
        </button>
      </div>

      <!-- Results count -->
      <p class="text-xs text-on-surface-variant font-terminal-code mb-sm">
        Showing ${filtered.length} of ${allData.length} players
        ${searchQuery ? `· Filtered by "<span class="text-secondary">${searchQuery}</span>"` : ''}
      </p>

      <!-- Leaderboard Table -->
      <div class="glass-panel rounded-xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-highest border-b border-outline-variant/50">
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant w-14 text-center cursor-pointer hover:text-primary transition-colors" data-sort="rank">
                  Rank ${sortIcon('rank')}
                </th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant">User</th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden sm:table-cell">XP</th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden md:table-cell">Levels</th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden lg:table-cell text-center cursor-pointer hover:text-primary transition-colors" data-sort="games">
                  Games ${sortIcon('games')}
                </th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden lg:table-cell text-center cursor-pointer hover:text-primary transition-colors" data-sort="wins">
                  Wins ${sortIcon('wins')}
                </th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden xl:table-cell text-center">Losses</th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant hidden xl:table-cell text-center cursor-pointer hover:text-primary transition-colors" data-sort="winPct">
                  Win % ${sortIcon('winPct')}
                </th>
                <th class="p-3 md:p-4 text-terminal-label font-terminal-label text-on-surface-variant text-right cursor-pointer hover:text-primary transition-colors" data-sort="score">
                  Score ${sortIcon('score')}
                </th>
              </tr>
            </thead>
            <tbody class="text-body-md font-body-md">
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legend for responsive columns -->
      <p class="mt-sm text-xs text-on-surface-variant font-terminal-code opacity-60">
        💡 Wins, Losses &amp; Win% columns visible on large screens (xl+). Games visible on lg+.
      </p>
    </main>

    <style>
      .rank-medal { font-size: 1.4rem; line-height: 1; }
      .lb-top-row { background: linear-gradient(90deg, rgba(78,222,163,0.04) 0%, transparent 100%); }
      #lb-search-input { color-scheme: dark; }
    </style>
  `;
}

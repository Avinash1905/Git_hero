/**
 * MultiScopeLeaderboard
 * Multi-scope competitive leaderboard aggregator supporting Global XP,
 * Speedrun, Fewest Commits, and Sector-Specific scoreboards.
 */

export class MultiScopeLeaderboard {
  constructor() {
    this.scopes = [
      { id: 'global_xp', label: 'Global XP', icon: 'military_tech' },
      { id: 'speedrun', label: 'Speedrun Time', icon: 'timer' },
      { id: 'fewest_moves', label: 'Fewest Moves', icon: 'filter_1' },
      { id: 'daily_challenge', label: 'Daily Challenge', icon: 'event' }
    ];
  }

  /**
   * Sort leaderboard entries according to scope criteria
   */
  rankEntries(entries = [], scope = 'global_xp') {
    const list = [...entries];

    switch (scope) {
      case 'speedrun':
        list.sort((a, b) => (a.time_seconds || 9999) - (b.time_seconds || 9999));
        break;
      case 'fewest_moves':
        list.sort((a, b) => (a.move_count || 9999) - (b.move_count || 9999));
        break;
      case 'daily_challenge':
        list.sort((a, b) => (b.challenge_score || 0) - (a.challenge_score || 0));
        break;
      case 'global_xp':
      default:
        list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        break;
    }

    return list.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  /**
   * Render HTML leaderboard scope switcher & table
   */
  renderHtml(rankedList = [], activeScope = 'global_xp', currentUsername = '', options = {}) {
    const { onSwitchScope = 'handleSwitchLeaderboardScope' } = options;

    const tabs = this.scopes.map(s => `
      <button 
        type="button" 
        onclick="${onSwitchScope}('${s.id}')"
        class="px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer ${activeScope === s.id ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
      >
        <span class="material-symbols-outlined text-[16px]">${s.icon}</span>
        <span>${s.label}</span>
      </button>
    `).join('');

    const rows = rankedList.map(entry => {
      const isSelf = entry.username === currentUsername;
      const rankBadge = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;

      return `
        <tr class="border-b border-outline-variant/10 hover:bg-white/5 transition-colors font-mono text-xs ${isSelf ? 'bg-primary/10 font-bold' : ''}">
          <td class="p-3 text-center w-14 text-on-surface">${rankBadge}</td>
          <td class="p-3 flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px]">
              ${(entry.username || 'A')[0].toUpperCase()}
            </span>
            <span class="${isSelf ? 'text-primary font-bold' : 'text-on-surface'}">${entry.username}</span>
            ${isSelf ? '<span class="text-[9px] bg-primary/20 text-primary px-1.5 py-0.2 rounded">YOU</span>' : ''}
          </td>
          <td class="p-3 text-right text-on-surface-variant">${entry.completed_levels || 0}</td>
          <td class="p-3 text-right text-amber-400 font-bold">${entry.stars || 0} ★</td>
          <td class="p-3 text-right text-primary font-bold">${(entry.xp || 0).toLocaleString()} XP</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="space-y-4">
        <!-- Scope Switcher -->
        <div class="flex flex-wrap gap-2">
          ${tabs}
        </div>

        <!-- Table -->
        <div class="rounded-2xl border border-outline-variant/20 bg-surface-container-low overflow-hidden shadow-xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-outline-variant/20 bg-surface-container-lowest font-mono text-[10px] uppercase text-on-surface-variant tracking-wider">
                <th class="p-3 text-center w-14">Rank</th>
                <th class="p-3">Operative</th>
                <th class="p-3 text-right">Sectors</th>
                <th class="p-3 text-right">Stars</th>
                <th class="p-3 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length > 0 ? rows : `
                <tr>
                  <td colspan="5" class="p-8 text-center text-xs text-on-surface-variant font-mono">
                    No leaderboard scores registered for this category yet.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

export const multiScopeLeaderboard = new MultiScopeLeaderboard();

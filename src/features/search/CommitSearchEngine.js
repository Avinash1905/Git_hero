/**
 * CommitSearchEngine
 * Advanced commit log query and Pickaxe (-S) search engine.
 */

export class CommitSearchEngine {
  constructor() {
    this.commits = [
      {
        sha: 'c101',
        author: 'Commander Alpha',
        message: 'feat: initialize grid matrix',
        diffLines: ['+const GRID_SIZE = 6;', '+let activePlayer = null;'],
        date: '2026-08-01'
      },
      {
        sha: 'c102',
        author: 'Operative Beta',
        message: 'fix: resolve boundary clipping',
        diffLines: ['-if (x > 6) return false;', '+if (x >= GRID_SIZE || x < 0) return false;'],
        date: '2026-08-05'
      },
      {
        sha: 'c103',
        author: 'Operative Gamma',
        message: 'feat: implement quantum teleporter',
        diffLines: ['+function teleportTo(targetSector) {', '+  executeWarp(targetSector);', '+}'],
        date: '2026-08-10'
      },
      {
        sha: 'c104',
        author: 'Commander Alpha',
        message: 'refactor: deprecate quantum teleporter',
        diffLines: ['-function teleportTo(targetSector) {', '-  executeWarp(targetSector);', '-}'],
        date: '2026-08-18'
      }
    ];
  }

  /**
   * Search commits using message pattern, author filter, or Pickaxe code search
   */
  search({ query = '', author = '', pickaxe = '' }) {
    const qLower = query.toLowerCase();
    const aLower = author.toLowerCase();

    return this.commits.filter((c) => {
      if (qLower && !c.message.toLowerCase().includes(qLower)) return false;
      if (aLower && !c.author.toLowerCase().includes(aLower)) return false;
      if (pickaxe) {
        // Pickaxe (-S): Matches commits whose patch introduces or removes the string
        const hasPickaxe = c.diffLines.some(line => line.includes(pickaxe));
        if (!hasPickaxe) return false;
      }
      return true;
    });
  }

  renderHtml(results = this.commits) {
    const rows = results.map((c) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold font-mono">${c.sha}</span>
            <span class="font-bold text-on-surface">${c.message}</span>
          </div>
          <span class="text-[10px] text-on-surface-variant">${c.date}</span>
        </div>

        <div class="flex items-center gap-3 text-[11px] text-on-surface-variant">
          <span>Author: <strong class="text-secondary">${c.author}</strong></span>
          <span>Diff delta: <strong>${c.diffLines.length} lines</strong></span>
        </div>

        <div class="p-2 rounded bg-surface-container-lowest font-mono text-[10px] text-on-surface-variant space-y-0.5 border border-outline-variant/20 overflow-x-auto">
          ${c.diffLines.map(l => `<div class="${l.startsWith('+') ? 'text-primary' : 'text-error'}">${l}</div>`).join('')}
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4 font-terminal-code text-xs">
        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="text-[10px] uppercase text-on-surface-variant font-terminal-label block mb-1">Message (--grep)</label>
            <input type="text" placeholder="teleporter, grid..." class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="text-[10px] uppercase text-on-surface-variant font-terminal-label block mb-1">Author (--author)</label>
            <input type="text" placeholder="Alpha, Beta..." class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label class="text-[10px] uppercase text-on-surface-variant font-terminal-label block mb-1">Pickaxe Code (-S)</label>
            <input type="text" placeholder="teleportTo, GRID_SIZE..." class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-1.5 text-xs text-on-surface focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div class="space-y-3">
          ${rows}
        </div>
      </div>
    `;
  }
}

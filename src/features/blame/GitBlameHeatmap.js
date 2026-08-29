/**
 * GitBlameHeatmap
 * Line-by-line commit authorship inspector with author color tags, commit timestamps, and blame age fading.
 */

export class GitBlameHeatmap {
  constructor() {
    this.authorColors = {
      'Linus': '#00ffcc',
      'Operative_Echo': '#38bdf8',
      'BranchViper': '#a855f7'
    };
  }

  getAuthorColor(author) {
    return this.authorColors[author] || '#f59e0b';
  }

  renderHtml(lines = [], filename = 'src/engine/GameEngine.js') {
    const defaultLines = [
      { lineNum: 1, sha: 'dac1658', author: 'Linus', date: '2026-08-27', code: 'export class AdvancedGameEngine {' },
      { lineNum: 2, sha: 'dac1658', author: 'Linus', date: '2026-08-27', code: '  constructor(options = {}) {' },
      { lineNum: 3, sha: 'a909ac5', author: 'Operative_Echo', date: '2026-08-27', code: '    this.eventBus = new EngineEventBus();' },
      { lineNum: 4, sha: '7d385cc', author: 'BranchViper', date: '2026-08-28', code: '    this.inputScheduler = new InputQueueScheduler();' },
      { lineNum: 5, sha: 'dac1658', author: 'Linus', date: '2026-08-27', code: '  }' }
    ];

    const displayLines = lines.length > 0 ? lines : defaultLines;

    const rows = displayLines.map(l => `
      <div class="flex items-center text-[11px] font-mono hover:bg-white/5 py-0.5 px-2">
        <span class="w-16 text-primary font-bold pr-2 select-none">${l.sha}</span>
        <span class="w-24 text-on-surface-variant truncate pr-2" style="color: ${this.getAuthorColor(l.author)}">${l.author}</span>
        <span class="w-20 text-on-surface-variant/60 pr-2 text-[10px] select-none">${l.date}</span>
        <span class="w-8 text-right pr-3 text-on-surface-variant/40 select-none">${l.lineNum}</span>
        <span class="text-on-surface flex-1 whitespace-pre">${l.code}</span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">fingerprint</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Git Blame: ${filename}</span>
          </div>
        </div>
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-2 overflow-x-auto">
          ${rows}
        </div>
      </div>
    `;
  }
}

export const gitBlameHeatmap = new GitBlameHeatmap();

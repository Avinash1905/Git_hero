/**
 * GitBlameInspector
 * Line-by-line provenance annotation visualizer for source code files.
 */

export class GitBlameInspector {
  constructor() {
    this.targetFile = 'src/engine/physics.js';
    this.lines = [
      { lineNumber: 1, author: 'Commander Alpha', sha: 'c101a', date: '2026-08-01', code: 'export function updatePhysics(delta) {' },
      { lineNumber: 2, author: 'Commander Alpha', sha: 'c101a', date: '2026-08-01', code: '  if (!isActive) return;' },
      { lineNumber: 3, author: 'Operative Beta',  sha: 'c204b', date: '2026-08-12', code: '  for (const box of boxes) {' },
      { lineNumber: 4, author: 'Operative Beta',  sha: 'c204b', date: '2026-08-12', code: '    box.x += box.vx * delta;' },
      { lineNumber: 5, author: 'Operative Gamma', sha: 'c309c', date: '2026-08-20', code: '    box.y += box.vy * delta;' },
      { lineNumber: 6, author: 'Commander Alpha', sha: 'c101a', date: '2026-08-01', code: '  }' },
      { lineNumber: 7, author: 'Commander Alpha', sha: 'c101a', date: '2026-08-01', code: '}' }
    ];
  }

  getAuthors() {
    const authors = new Set();
    this.lines.forEach(l => authors.add(l.author));
    return Array.from(authors);
  }

  renderHtml() {
    const lineRows = this.lines.map((l) => `
      <div class="flex items-center hover:bg-surface-container-high/60 transition-colors font-mono text-xs py-0.5 border-b border-surface-variant/10">
        <!-- Annotation Gutter (Author, SHA, Date) -->
        <div class="w-64 shrink-0 flex items-center gap-2 px-3 py-1 bg-surface-container-lowest/80 text-on-surface-variant text-[11px] border-r border-outline-variant/20 select-none">
          <span class="text-primary font-bold">${l.sha}</span>
          <span class="truncate w-24">${l.author}</span>
          <span class="text-[10px] text-on-surface-variant/70">${l.date}</span>
        </div>

        <!-- Line Number -->
        <div class="w-10 shrink-0 text-right pr-3 text-on-surface-variant/50 select-none text-[11px]">
          ${l.lineNumber}
        </div>

        <!-- Code Content -->
        <div class="flex-1 pl-2 text-on-surface font-mono overflow-x-auto whitespace-pre">
          ${l.code}
        </div>
      </div>
    `).join('');

    return `
      <div class="glass-panel rounded-2xl border border-outline-variant/30 overflow-hidden font-terminal-code shadow-2xl">
        <div class="p-4 bg-surface-container-low border-b border-surface-variant/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-tertiary">history_edu</span>
            <span class="font-bold text-on-surface text-xs font-mono">${this.targetFile}</span>
          </div>
          <div class="text-[11px] text-on-surface-variant">
            Contributors: <strong class="text-primary">${this.getAuthors().join(', ')}</strong>
          </div>
        </div>

        <div class="bg-surface-container-lowest/90 overflow-x-auto scrollbar-thin">
          ${lineRows}
        </div>
      </div>
    `;
  }
}

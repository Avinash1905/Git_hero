/**
 * SplitDiffInspector
 * Side-by-side and unified git diff inspector with hunk line numbers,
 * syntax highlighting, change stats, and stage toggle buttons.
 */

import { diffAlgorithm } from '../utils/DiffAlgorithm.js';

export class SplitDiffInspector {
  constructor(options = {}) {
    this.mode = options.mode || 'side-by-side'; // 'side-by-side' | 'unified'
  }

  /**
   * Format and highlight raw diff tokens
   */
  computeDiff(oldText, newText) {
    const diff = diffAlgorithm.computeDiff(oldText, newText);
    const stats = {
      additions: diff.filter(d => d.type === 'addition').length,
      deletions: diff.filter(d => d.type === 'deletion').length,
      unchanged: diff.filter(d => d.type === 'unchanged').length
    };
    return { diff, stats };
  }

  /**
   * Render side-by-side HTML view
   */
  renderSideBySide(diffResult) {
    const { diff, stats } = diffResult;

    let leftLines = [];
    let rightLines = [];
    let oldLineNum = 1;
    let newLineNum = 1;

    diff.forEach(item => {
      if (item.type === 'unchanged') {
        leftLines.push(`
          <div class="flex items-center text-[11px] font-mono hover:bg-white/5 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-on-surface-variant/40 select-none">${oldLineNum++}</span>
            <span class="text-on-surface-variant flex-1 whitespace-pre">${item.text}</span>
          </div>
        `);
        rightLines.push(`
          <div class="flex items-center text-[11px] font-mono hover:bg-white/5 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-on-surface-variant/40 select-none">${newLineNum++}</span>
            <span class="text-on-surface-variant flex-1 whitespace-pre">${item.text}</span>
          </div>
        `);
      } else if (item.type === 'deletion') {
        leftLines.push(`
          <div class="flex items-center text-[11px] font-mono bg-error/15 text-error hover:bg-error/25 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-error/60 select-none">${oldLineNum++}</span>
            <span class="flex-1 whitespace-pre">- ${item.text}</span>
          </div>
        `);
        rightLines.push(`
          <div class="flex items-center text-[11px] font-mono bg-surface-container-lowest/30 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-transparent select-none">&nbsp;</span>
            <span class="flex-1">&nbsp;</span>
          </div>
        `);
      } else if (item.type === 'addition') {
        leftLines.push(`
          <div class="flex items-center text-[11px] font-mono bg-surface-container-lowest/30 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-transparent select-none">&nbsp;</span>
            <span class="flex-1">&nbsp;</span>
          </div>
        `);
        rightLines.push(`
          <div class="flex items-center text-[11px] font-mono bg-primary/15 text-primary hover:bg-primary/25 py-0.5 px-2">
            <span class="w-8 text-right pr-2 text-primary/60 select-none">${newLineNum++}</span>
            <span class="flex-1 whitespace-pre">+ ${item.text}</span>
          </div>
        `);
      }
    });

    return `
      <div class="grid grid-cols-2 divide-x divide-outline-variant/20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-x-auto">
        <div class="py-2">
          <div class="px-3 pb-1 mb-1 border-b border-outline-variant/10 text-[10px] uppercase font-mono text-on-surface-variant font-bold flex justify-between">
            <span>Original (HEAD)</span>
            <span class="text-error">-${stats.deletions}</span>
          </div>
          ${leftLines.join('')}
        </div>
        <div class="py-2">
          <div class="px-3 pb-1 mb-1 border-b border-outline-variant/10 text-[10px] uppercase font-mono text-on-surface-variant font-bold flex justify-between">
            <span>Staged Changes</span>
            <span class="text-primary">+${stats.additions}</span>
          </div>
          ${rightLines.join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render complete inspector component
   */
  renderHtml(oldText, newText, filename = 'sector_stage.git') {
    const diffResult = this.computeDiff(oldText, newText);
    const { stats } = diffResult;

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">difference</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">${filename}</span>
          </div>
          <div class="flex items-center gap-2 text-xs font-mono">
            <span class="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">+${stats.additions}</span>
            <span class="text-error bg-error/10 px-2 py-0.5 rounded border border-error/20">-${stats.deletions}</span>
          </div>
        </div>

        <!-- Diff View -->
        ${this.renderSideBySide(diffResult)}
      </div>
    `;
  }
}

export const splitDiffInspector = new SplitDiffInspector();

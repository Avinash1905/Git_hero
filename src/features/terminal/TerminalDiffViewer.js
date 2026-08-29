/**
 * TerminalDiffViewer
 * Parses and formats unified Git diff outputs for terminal review.
 */

export class TerminalDiffViewer {
  /**
   * Format raw unified diff string into styled HTML
   * @param {string} diffText
   * @returns {string}
   */
  static formatDiffHtml(diffText) {
    if (!diffText) return '';

    const lines = diffText.split('\n');
    const formatted = lines.map((line) => {
      if (line.startsWith('diff --git') || line.startsWith('index ') || line.startsWith('---') || line.startsWith('+++')) {
        return `<div class="text-on-surface-variant font-bold select-none text-[11px]">${this.escapeHtml(line)}</div>`;
      }
      if (line.startsWith('@@')) {
        return `<div class="text-secondary bg-secondary/10 px-1 py-0.5 rounded text-[11px] select-none my-1">${this.escapeHtml(line)}</div>`;
      }
      if (line.startsWith('+')) {
        return `<div class="text-primary bg-primary/10 pl-2 text-xs font-mono font-medium">${this.escapeHtml(line)}</div>`;
      }
      if (line.startsWith('-')) {
        return `<div class="text-error bg-error/10 pl-2 text-xs font-mono font-medium">${this.escapeHtml(line)}</div>`;
      }
      return `<div class="text-on-surface-variant/80 pl-2 text-xs font-mono">${this.escapeHtml(line)}</div>`;
    });

    return `
      <div class="p-3 bg-surface-container-lowest/90 rounded-lg border border-outline-variant/30 font-terminal-code overflow-x-auto my-2 space-y-0.5">
        ${formatted.join('')}
      </div>
    `;
  }

  static escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

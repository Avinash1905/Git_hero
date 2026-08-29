/**
 * TerminalFormatter
 * Converts structured engine response logs into semantic HTML elements styled according
 * to the GitQuest JetBrains Mono / Geist cyberpunk design tokens.
 */

export class TerminalFormatter {
  /**
   * Format single log entry into HTML
   * @param {Object} log
   * @returns {string}
   */
  static formatLogHtml(log) {
    if (!log) return '';

    if (log.type === 'cmd') {
      return `
        <div class="flex items-center gap-2 font-terminal-code text-sm">
          <span class="text-primary font-bold select-none">$</span>
          <span class="text-on-surface font-medium">${this.escapeHtml(log.text)}</span>
        </div>
      `;
    }

    if (log.type === 'status') {
      const isReady = log.boxStatus?.includes('READY') || log.boxStatus?.includes('STAGED');
      return `
        <div class="text-on-surface-variant pl-4 border-l-2 border-surface-variant my-1.5 space-y-1 font-terminal-code">
          <div class="text-xs text-secondary font-bold">On branch ${this.escapeHtml(log.branch || 'main')}</div>
          <div class="text-on-surface text-sm font-medium">Objective: ${this.escapeHtml(log.objective || '')}</div>
          <div class="${isReady ? 'text-primary font-bold' : 'text-tertiary'} text-xs">Box Status: ${this.escapeHtml(log.boxStatus || '')}</div>
          <div class="text-on-surface-variant/80 text-xs">Progress: ${this.escapeHtml(log.progress || '')}</div>
        </div>
      `;
    }

    if (log.type === 'push' || log.type === 'pull') {
      return `
        <div class="text-on-surface-variant pl-4 border-l-2 border-secondary/40 my-1.5 space-y-0.5 font-terminal-code">
          <div class="text-on-surface-variant/70 text-xs">${this.escapeHtml(log.detail || '')}</div>
          <div class="text-primary text-sm font-bold">${this.escapeHtml(log.result || '')}</div>
        </div>
      `;
    }

    if (log.type === 'commit_success') {
      return `
        <div class="text-primary pl-4 border-l-2 border-primary my-2 space-y-1 font-terminal-code">
          <div class="font-bold text-sm">[${this.escapeHtml(log.branch || 'main')} ${this.escapeHtml(log.commitHash || 'a1b2c3d')}] ${this.escapeHtml(log.message || '')}</div>
          <div class="text-xs text-on-surface-variant font-mono">${this.escapeHtml(log.filesChanged || '1 file changed')}</div>
        </div>
      `;
    }

    if (log.type === 'error') {
      return `
        <div class="text-error pl-4 border-l-2 border-error/50 text-xs font-terminal-code my-1.5 leading-relaxed">
          ${this.escapeHtml(log.text || 'Command execution error').replace(/\n/g, '<br/>')}
        </div>
      `;
    }

    // Default output
    return `
      <div class="text-on-surface-variant text-xs pl-4 font-terminal-code my-1 leading-relaxed">
        ${this.escapeHtml(log.text || '').replace(/\n/g, '<br/>')}
      </div>
    `;
  }

  static escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

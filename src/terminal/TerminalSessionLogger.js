// GitHero Terminal Session Logger
// Maintains persistent command history, timestamped execution transcripts, and export capabilities.

export class TerminalSessionLogger {
  constructor(options = {}) {
    this.maxLogs = options.maxLogs || 500;
    this.sessionLogs = [];
  }

  /**
   * Log command entry and output
   * @param {string} command 
   * @param {string|Object} output 
   * @param {boolean} success 
   */
  logEntry(command, output, success = true) {
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      isoDate: new Date().toISOString(),
      command: command.trim(),
      output: typeof output === 'string' ? output : JSON.stringify(output),
      success
    };

    this.sessionLogs.push(entry);
    if (this.sessionLogs.length > this.maxLogs) {
      this.sessionLogs.shift();
    }
  }

  /**
   * Search command log history
   * @param {string} query 
   * @returns {Array}
   */
  searchHistory(query = '') {
    if (!query) return [...this.sessionLogs];
    const q = query.toLowerCase();
    return this.sessionLogs.filter(e => 
      e.command.toLowerCase().includes(q) || 
      e.output.toLowerCase().includes(q)
    );
  }

  /**
   * Clear active session logs
   */
  clear() {
    this.sessionLogs = [];
  }

  /**
   * Export logs as Markdown file
   * @returns {string} Markdown text
   */
  exportMarkdown() {
    let md = `# GitHero Terminal Session Log\nExported: ${new Date().toLocaleString()}\n\n`;
    for (const entry of this.sessionLogs) {
      md += `### \`$ ${entry.command}\` [${entry.success ? 'SUCCESS' : 'FAILED'}]\n`;
      md += `*Time: ${entry.isoDate}*\n\n`;
      md += `\`\`\`bash\n${entry.output}\n\`\`\`\n\n---\n\n`;
    }
    return md;
  }

  /**
   * Export logs as JSON string
   * @returns {string} JSON text
   */
  exportJSON() {
    return JSON.stringify(this.sessionLogs, null, 2);
  }
}

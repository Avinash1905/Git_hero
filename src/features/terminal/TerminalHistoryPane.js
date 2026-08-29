/**
 * GitQuest Frontend - Terminal History Pane
 * Command navigation buffer, execution timeline records, search filter,
 * session replay export, and command stats analyzer.
 */

export class TerminalHistoryPane {
  constructor(maxEntries = 200) {
    this.entries = [];
    this.maxEntries = maxEntries;
    this.cursorIndex = -1;
  }

  recordCommand(rawCommand, result = {}) {
    const entry = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      command: rawCommand,
      timestamp: Date.now(),
      success: result.success !== false,
      output: result.output || '',
      reason: result.reason || null
    };

    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }
    this.cursorIndex = this.entries.length;
    return entry;
  }

  getPrevious() {
    if (this.entries.length === 0) return '';
    if (this.cursorIndex > 0) {
      this.cursorIndex--;
    }
    return this.entries[this.cursorIndex]?.command || '';
  }

  getNext() {
    if (this.cursorIndex < this.entries.length - 1) {
      this.cursorIndex++;
      return this.entries[this.cursorIndex]?.command || '';
    }
    this.cursorIndex = this.entries.length;
    return '';
  }

  search(query) {
    if (!query) return [...this.entries];
    const q = query.toLowerCase();
    return this.entries.filter(e => e.command.toLowerCase().includes(q));
  }

  computeStats() {
    const total = this.entries.length;
    const successful = this.entries.filter(e => e.success).length;
    const failed = total - successful;

    const commandFrequencies = {};
    for (const e of this.entries) {
      const top = e.command.trim().split(/\s+/)[0];
      commandFrequencies[top] = (commandFrequencies[top] || 0) + 1;
    }

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? ((successful / total) * 100).toFixed(1) + '%' : '100%',
      frequencies: commandFrequencies
    };
  }

  exportJsonTranscript() {
    return JSON.stringify({
      sessionDate: new Date().toISOString(),
      stats: this.computeStats(),
      history: this.entries
    }, null, 2);
  }

  renderHistoryHtml() {
    return `
      <div class="terminal-history-container" style="padding:12px; font-family:monospace; font-size:12px; background:#0b0f19; color:#cbd5e1; border-radius:6px; max-height:280px; overflow-y:auto;">
        <div style="font-weight:bold; color:#38bdf8; margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:4px;">Command Execution History (${this.entries.length})</div>
        ${this.entries.map((e, idx) => `
          <div class="history-item" style="display:flex; justify-content:space-between; margin:4px 0; padding:2px 4px; border-radius:3px; background:${e.success ? 'transparent' : 'rgba(239,68,68,0.1)'};">
            <span style="color:${e.success ? '#34d399' : '#f87171'};">[${idx + 1}] $ ${e.command}</span>
            <span style="color:#64748b; font-size:10px;">${new Date(e.timestamp).toLocaleTimeString()}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

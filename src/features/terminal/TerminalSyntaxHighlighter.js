/**
 * GitQuest Frontend - Terminal Syntax Highlighter
 * Colorizes Git commands, subcommands, flags, branch names, commit hashes,
 * unified diffs, and ANSI escape sequence tokens.
 */

export class TerminalSyntaxHighlighter {
  constructor(theme = 'matrix-dark') {
    this.theme = theme;
    this.gitKeywords = new Set([
      'git', 'status', 'push', 'pull', 'commit', 'switch', 'checkout',
      'branch', 'merge', 'rebase', 'stash', 'pop', 'cherry-pick', 'diff',
      'log', 'tag', 'revert', 'submodule', 'worktree', 'bundle', 'blame',
      'reset', 'fetch', 'remote', 'bisect', 'sparse-checkout', 'rerere',
      'help', 'clear', 'undo', 'hint'
    ]);
  }

  highlightCommandInput(inputStr) {
    if (!inputStr) return '';

    const tokens = inputStr.split(/(\s+)/);
    return tokens.map(token => {
      if (/^\s+$/.test(token)) return token;

      const clean = token.toLowerCase();
      if (this.gitKeywords.has(clean)) {
        return `<span class="tok-git-keyword" style="color:#38bdf8; font-weight:600;">${this._escape(token)}</span>`;
      } else if (token.startsWith('-')) {
        return `<span class="tok-git-flag" style="color:#f59e0b;">${this._escape(token)}</span>`;
      } else if (/^[0-9a-f]{7,40}$/i.test(token)) {
        return `<span class="tok-git-hash" style="color:#e879f9; font-family:monospace;">${this._escape(token)}</span>`;
      } else if (token.startsWith('"') || token.startsWith("'")) {
        return `<span class="tok-git-string" style="color:#34d399;">${this._escape(token)}</span>`;
      } else {
        return `<span class="tok-git-arg" style="color:#e2e8f0;">${this._escape(token)}</span>`;
      }
    }).join('');
  }

  highlightDiffOutput(diffText) {
    if (!diffText) return '';

    return diffText.split('\n').map(line => {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        return `<div class="diff-line diff-add" style="color:#34d399; background:rgba(16,185,129,0.1); padding:1px 4px;">${this._escape(line)}</div>`;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        return `<div class="diff-line diff-del" style="color:#f87171; background:rgba(239,68,68,0.1); padding:1px 4px;">${this._escape(line)}</div>`;
      } else if (line.startsWith('@@')) {
        return `<div class="diff-line diff-hunk" style="color:#818cf8; font-weight:600; padding:1px 4px;">${this._escape(line)}</div>`;
      } else if (line.startsWith('diff --git') || line.startsWith('index ')) {
        return `<div class="diff-line diff-header" style="color:#94a3b8; font-weight:bold;">${this._escape(line)}</div>`;
      } else {
        return `<div class="diff-line diff-ctx" style="color:#cbd5e1; padding:1px 4px;">${this._escape(line)}</div>`;
      }
    }).join('');
  }

  highlightStatusOutput(statusObj) {
    return `
      <div class="status-summary-card" style="padding:8px 12px; background:#0f172a; border-left:3px solid #38bdf8; border-radius:4px; margin:4px 0;">
        <div style="color:#38bdf8; font-weight:bold;">On branch <span style="color:#fcd34d;">${this._escape(statusObj.branch || 'main')}</span></div>
        <div style="color:#94a3b8; margin:3px 0;">Mission: ${this._escape(statusObj.objective || 'N/A')}</div>
        <div style="color:${statusObj.boxStatus?.includes('ON GOAL') ? '#34d399' : '#f87171'}; font-weight:600;">Status: ${this._escape(statusObj.boxStatus || 'Pending')}</div>
        <div style="color:#a78bfa; font-size:11px;">Staging Progress: ${this._escape(statusObj.progress || '0%')}</div>
      </div>
    `;
  }

  _escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

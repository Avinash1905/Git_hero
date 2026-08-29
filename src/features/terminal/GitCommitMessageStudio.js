/**
 * GitQuest Frontend - Git Commit Message Studio
 * Interactive commit message builder, conventional commit type picker,
 * scope selector, breaking change toggle, and real-time linter preview.
 */

import { CommitTypes } from '../../../js/engine/git/GitCommitMessageLinter.js';

export class GitCommitMessageStudio {
  constructor(linter) {
    this.linter = linter;
    this.selectedType = 'feat';
    this.scope = '';
    this.description = '';
    this.body = '';
    this.isBreaking = false;
  }

  buildMessage() {
    let header = this.selectedType;
    if (this.scope.trim()) {
      header += `(${this.scope.trim().toLowerCase()})`;
    }
    if (this.isBreaking) {
      header += '!';
    }
    header += `: ${this.description.trim()}`;

    if (this.body.trim()) {
      return `${header}\n\n${this.body.trim()}`;
    }
    return header;
  }

  validateCurrent() {
    const msg = this.buildMessage();
    return this.linter.lint(msg);
  }

  renderStudioHtml() {
    const msg = this.buildMessage();
    const lintRes = this.linter.lint(msg);

    return `
      <div class="commit-msg-studio-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">✍️ Conventional Commit Message Studio</h4>
            <span style="font-size:11px; color:#94a3b8;">Standardized commit header generator</span>
          </div>
          <span style="font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; background:${lintRes.isValid ? '#065f46' : '#7f1d1d'}; color:${lintRes.isValid ? '#34d399' : '#fca5a5'};">
            ${lintRes.isValid ? '✓ CONVENTIONAL VALID' : 'LINT ERRORS'}
          </span>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
          ${CommitTypes.map(t => `
            <button class="btn-type-chip ${this.selectedType === t ? 'active' : ''}" data-type="${t}" style="background:${this.selectedType === t ? '#38bdf8' : '#0f172a'}; color:${this.selectedType === t ? '#000' : '#cbd5e1'}; border:1px solid #1e293b; padding:4px 8px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">
              ${t}
            </button>
          `).join('')}
        </div>

        <div style="background:#0f172a; padding:12px; border-radius:6px; border:1px solid #1e293b; font-family:monospace; font-size:12px; color:#fcd34d;">
          ${msg || '$ git commit -m "..."'}
        </div>
      </div>
    `;
  }
}

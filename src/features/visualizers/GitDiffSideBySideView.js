/**
 * GitQuest Frontend - Git Diff Side-by-Side View
 * Side-by-side split diff component rendering old vs new revisions
 * with intra-line character-level highlight tags and line numbers.
 */

export class GitDiffSideBySideView {
  constructor(tokenEngine) {
    this.tokenEngine = tokenEngine;
  }

  renderSideBySideHtml(filename = 'payload.js', oldLines = [], newLines = []) {
    const maxLines = Math.max(oldLines.length, newLines.length);
    const rows = [];

    for (let i = 0; i < maxLines; i++) {
      const o = oldLines[i] || '';
      const n = newLines[i] || '';

      const { oldTokens, newTokens } = this.tokenEngine.computeIntraLineDiff(o, n);

      const oldMarkup = oldTokens.map(t => {
        if (t.type === 'REMOVED') return `<span style="background:rgba(239,68,68,0.4); color:#fca5a5; font-weight:bold;">${this._escape(t.text)}</span>`;
        return `<span>${this._escape(t.text)}</span>`;
      }).join('');

      const newMarkup = newTokens.map(t => {
        if (t.type === 'ADDED') return `<span style="background:rgba(16,185,129,0.4); color:#6ee7b7; font-weight:bold;">${this._escape(t.text)}</span>`;
        return `<span>${this._escape(t.text)}</span>`;
      }).join('');

      rows.push(`
        <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
          <td style="width:30px; text-align:right; color:#64748b; padding:2px 6px; font-size:10px; user-select:none;">${o ? i + 1 : ''}</td>
          <td style="width:45%; font-family:monospace; font-size:11px; padding:2px 8px; color:#cbd5e1; background:${o !== n && o ? 'rgba(239,68,68,0.08)' : 'transparent'};">${oldMarkup}</td>
          <td style="width:30px; text-align:right; color:#64748b; padding:2px 6px; font-size:10px; user-select:none;">${n ? i + 1 : ''}</td>
          <td style="width:45%; font-family:monospace; font-size:11px; padding:2px 8px; color:#cbd5e1; background:${o !== n && n ? 'rgba(16,185,129,0.08)' : 'transparent'};">${newMarkup}</td>
        </tr>
      `);
    }

    return `
      <div class="diff-side-by-side-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:680px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h4 style="margin:0; color:#38bdf8; font-size:14px;">🔀 Split Diff: <code>${filename}</code></h4>
          <span style="font-size:10px; color:#94a3b8;">Side-by-side inspection</span>
        </div>
        <div style="max-height:280px; overflow-y:auto; border:1px solid #1e293b; border-radius:6px; background:#0f172a;">
          <table style="width:100%; border-collapse:collapse;">
            ${rows.join('')}
          </table>
        </div>
      </div>
    `;
  }

  _escape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

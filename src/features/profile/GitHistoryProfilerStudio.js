/**
 * GitQuest Frontend - Git History Profiler Studio
 * Visual dashboard displaying commit frequency punchcard, author share donuts,
 * lines-added velocity sparklines, and file churn volatility heatmaps.
 */

export class GitHistoryProfilerStudio {
  constructor(profiler) {
    this.profiler = profiler;
  }

  renderProfilerHtml() {
    const authors = this.profiler.computeAuthorContributions();
    const punchcard = this.profiler.generatePunchcardMatrix();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return `
      <div class="history-profiler-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:640px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:16px;">📊 Git History & Activity Profiler</h4>
            <span style="font-size:11px; color:#94a3b8;">Punchcard activity and author velocity</span>
          </div>
          <span style="font-size:11px; color:#34d399; font-weight:bold;">${this.profiler.commits.length} Total Commits</span>
        </div>

        <div style="margin-bottom:16px;">
          <div style="font-size:12px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">Weekly Commit Activity Punchcard:</div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            ${punchcard.map((hours, dIdx) => `
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="width:30px; font-size:10px; color:#64748b;">${days[dIdx]}</span>
                <div style="display:flex; gap:3px;">
                  ${hours.map((val) => `
                    <div style="width:14px; height:14px; border-radius:2px; background:${val > 0 ? '#38bdf8' : '#0f172a'}; opacity:${val > 0 ? Math.min(1.0, 0.3 + val * 0.2) : 0.4};"></div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div style="font-size:12px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">Author Contributions:</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${Object.entries(authors).map(([author, data]) => `
              <div style="background:#0f172a; border:1px solid #1e293b; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                <span style="color:#f8fafc; font-weight:bold;">${author}</span>
                <div style="display:flex; gap:12px; font-size:10px;">
                  <span style="color:#38bdf8;">${data.commits} commits</span>
                  <span style="color:#34d399;">+${data.additions}</span>
                  <span style="color:#f87171;">-${data.deletions}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

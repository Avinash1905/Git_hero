/**
 * GitQuest Frontend - Git Repo Health Dashboard
 * Visual audit dashboard showing health score gauge, packfile metrics,
 * optimization action recommendations, and disk efficiency telemetry.
 */

export class GitRepoHealthDashboard {
  constructor(auditor) {
    this.auditor = auditor;
  }

  renderDashboardHtml() {
    const report = this.auditor.auditHealth();
    const scoreColor = report.healthScore >= 85 ? '#34d399' : (report.healthScore >= 70 ? '#f59e0b' : '#ef4444');

    return `
      <div class="repo-health-dashboard" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:560px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; font-size:16px; color:#38bdf8;">🩺 Git Repository Health Dashboard</h3>
            <span style="font-size:11px; color:#94a3b8;">Automated performance and packfile audit</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:22px; font-weight:bold; color:${scoreColor};">${report.healthScore}/100</span>
            <div style="font-size:10px; color:#64748b;">${report.status}</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:16px;">
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b; text-align:center;">
            <div style="font-size:16px; font-weight:bold; color:#38bdf8;">${report.metrics.totalBranches}</div>
            <div style="font-size:10px; color:#64748b;">Branches</div>
          </div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b; text-align:center;">
            <div style="font-size:16px; font-weight:bold; color:#f59e0b;">${report.metrics.looseObjectsCount}</div>
            <div style="font-size:10px; color:#64748b;">Loose Objects</div>
          </div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b; text-align:center;">
            <div style="font-size:16px; font-weight:bold; color:#a78bfa;">${report.metrics.packfileCount}</div>
            <div style="font-size:10px; color:#64748b;">Packfiles</div>
          </div>
        </div>

        ${report.recommendations.length > 0 ? `
          <div style="background:#1e1b4b; border-left:3px solid #6366f1; padding:10px; border-radius:4px; font-size:11px;">
            <div style="font-weight:bold; color:#c7d2fe; margin-bottom:4px;">Recommended Optimizations:</div>
            ${report.recommendations.map(r => `<div style="color:#e0e7ff; margin:2px 0;">• ${r}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}

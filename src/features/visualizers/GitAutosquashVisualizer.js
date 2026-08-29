/**
 * GitQuest Frontend - Git Autosquash Visualizer
 * SVG graph and list visualizer illustrating before-and-after rebase todo lists
 * when `git rebase -i --autosquash` automatically binds fixup! and squash! commits.
 */

export class GitAutosquashVisualizer {
  renderVisualizerHtml(originalList = [], reorderedList = []) {
    return `
      <div class="autosquash-visualizer-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:640px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:16px;">🔄 Git Autosquash Reorder Visualizer</h4>
            <span style="font-size:11px; color:#94a3b8;">Automatic fixup! & squash! target clustering</span>
          </div>
          <span style="font-size:11px; color:#34d399; font-weight:bold;">--autosquash ENABLED</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <!-- Before Autosquash -->
          <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #1e293b;">
            <div style="font-size:11px; font-weight:bold; color:#f87171; margin-bottom:8px;">BEFORE (Chronological Order):</div>
            <div style="display:flex; flex-direction:column; gap:4px; font-family:monospace; font-size:10px;">
              ${originalList.map((item, i) => `
                <div style="padding:4px 6px; border-radius:3px; background:${item.subject.startsWith('fixup!') ? 'rgba(239,68,68,0.15)' : (item.subject.startsWith('squash!') ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)')};">
                  <span style="color:#64748b;">${i + 1}.</span>
                  <span style="color:#38bdf8;">${item.commitHash.substring(0, 7)}</span>
                  <span style="color:#e2e8f0;">${item.subject}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- After Autosquash -->
          <div style="background:#0f172a; padding:12px; border-radius:8px; border:1px solid #10b981;">
            <div style="font-size:11px; font-weight:bold; color:#34d399; margin-bottom:8px;">AFTER (--autosquash Reordered):</div>
            <div style="display:flex; flex-direction:column; gap:4px; font-family:monospace; font-size:10px;">
              ${reorderedList.map((item, i) => `
                <div style="padding:4px 6px; border-radius:3px; background:${item.action === 'fixup' ? 'rgba(52,211,153,0.15)' : (item.action === 'squash' ? 'rgba(245,158,11,0.15)' : 'rgba(56,189,248,0.1)')};">
                  <span style="color:${item.action === 'fixup' ? '#34d399' : (item.action === 'squash' ? '#f59e0b' : '#38bdf8')}; font-weight:bold;">${item.action || 'pick'}</span>
                  <span style="color:#38bdf8;">${item.commitHash.substring(0, 7)}</span>
                  <span style="color:#e2e8f0;">${item.subject}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

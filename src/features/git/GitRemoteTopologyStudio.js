/**
 * GitQuest Frontend - Git Remote Topology Studio
 * Visual interface for inspecting remotes, configuring upstream URLs,
 * and testing simulated network connectivity and push/fetch permissions.
 */

export class GitRemoteTopologyStudio {
  constructor(remoteEngine) {
    this.engine = remoteEngine;
  }

  renderStudioHtml() {
    const remotes = this.engine.listRemotes();

    return `
      <div class="remote-topology-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🌐 Remote Repositories & Refspecs</h4>
            <span style="font-size:11px; color:#94a3b8;">${remotes.length} configured upstream remotes</span>
          </div>
          <button class="btn-add-remote" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Add Remote</button>
        </div>

        <div class="remotes-list" style="display:flex; flex-direction:column; gap:8px;">
          ${remotes.map(r => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:10px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:bold; font-size:13px; color:#f8fafc;">${r.name}</span>
                  ${r.isDefault ? '<span style="font-size:9px; background:#065f46; color:#34d399; padding:2px 6px; border-radius:3px; font-weight:bold;">PRIMARY ORIGIN</span>' : ''}
                </div>
                <div style="font-family:monospace; font-size:10px; color:#64748b; margin-top:3px;">
                  Fetch: <span style="color:#38bdf8;">${r.fetchUrl}</span>
                </div>
                <div style="font-family:monospace; font-size:10px; color:#64748b;">
                  Push:  <span style="color:#38bdf8;">${r.pushUrl}</span>
                </div>
              </div>
              <div>
                ${!r.isDefault ? `<button class="btn-remove-remote" data-name="${r.name}" style="background:#ef4444; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Remove</button>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

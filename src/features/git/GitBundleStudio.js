/**
 * GitQuest Frontend - Git Bundle Studio
 * Visual interface for creating and verifying offline .bundle archives,
 * inspecting contained ref heads, and downloading repository snapshots.
 */

export class GitBundleStudio {
  constructor(packer) {
    this.packer = packer;
    this.bundles = [];
  }

  createBundleArchive(filename = 'repo_backup.bundle', refs = { 'refs/heads/main': 'e4a1b02' }) {
    const result = this.packer.createBundle(refs, [
      { type: 'commit', hash: 'e4a1b02', size: 180 },
      { type: 'tree', hash: '891f03a', size: 420 },
      { type: 'blob', hash: '3c891f0', size: 1250 }
    ]);

    if (result.success) {
      const entry = {
        filename,
        checksum: result.checksum,
        sizeBytes: result.sizeBytes,
        createdAt: Date.now()
      };
      this.bundles.push(entry);
      return entry;
    }
    return null;
  }

  renderStudioHtml() {
    return `
      <div class="bundle-studio-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">📦 Git Bundle Archives (Offline Sync)</h4>
            <span style="font-size:11px; color:#94a3b8;">Create portable packfile bundles</span>
          </div>
          <button class="btn-create-bundle" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Create Bundle</button>
        </div>

        <div class="bundles-list" style="display:flex; flex-direction:column; gap:8px;">
          ${this.bundles.length === 0 ? `
            <div style="text-align:center; padding:16px; color:#64748b; font-size:12px; border:1px dashed #1e293b; border-radius:6px;">
              No bundle archives created. Click '+ Create Bundle' to pack active repository state.
            </div>
          ` : this.bundles.map(b => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:10px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-family:monospace; font-weight:bold; font-size:12px; color:#f8fafc;">${b.filename}</div>
                <div style="font-size:10px; color:#64748b; margin-top:2px;">
                  Checksum: <span style="color:#a78bfa;">${b.checksum}</span> • Size: ${b.sizeBytes} B
                </div>
              </div>
              <button class="btn-verify-bundle" style="background:#059669; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Verify</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

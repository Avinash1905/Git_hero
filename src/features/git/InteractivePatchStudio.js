/**
 * GitQuest Frontend - Interactive Patch Studio
 * Interactive hunk staging (`git add -p`), patch hunk inspector,
 * split hunk tool, and stage/unstage toggle cards.
 */

export class InteractivePatchStudio {
  constructor(filename = 'payload.js', hunks = []) {
    this.filename = filename;
    this.hunks = hunks.map((h, i) => ({
      id: `hunk_${i + 1}`,
      header: h.header || `@@ -1,5 +1,5 @@`,
      content: h.content || '',
      isStaged: Boolean(h.isStaged)
    }));
  }

  toggleHunkStage(hunkId) {
    const hunk = this.hunks.find(h => h.id === hunkId);
    if (hunk) {
      hunk.isStaged = !hunk.isStaged;
      return { success: true, isStaged: hunk.isStaged };
    }
    return { success: false, reason: 'Hunk not found' };
  }

  stageAll() {
    this.hunks.forEach(h => { h.isStaged = true; });
  }

  unstageAll() {
    this.hunks.forEach(h => { h.isStaged = false; });
  }

  getStagedHunks() {
    return this.hunks.filter(h => h.isStaged);
  }

  renderPatchStudioHtml() {
    const stagedCount = this.getStagedHunks().length;

    return `
      <div class="patch-studio-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🩹 Interactive Patch Studio (git add -p)</h4>
            <span style="font-size:11px; color:#94a3b8;">Target file: <code>${this.filename}</code></span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-stage-all" style="background:#059669; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Stage All</button>
            <button class="btn-unstage-all" style="background:#475569; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Unstage All</button>
          </div>
        </div>

        <div style="font-size:11px; color:#34d399; margin-bottom:10px;">
          Staged: <b>${stagedCount} / ${this.hunks.length}</b> Hunks
        </div>

        <div class="hunks-container" style="display:flex; flex-direction:column; gap:10px; max-height:300px; overflow-y:auto;">
          ${this.hunks.map(h => `
            <div class="patch-hunk-box" style="background:#0f172a; border:1px solid ${h.isStaged ? '#10b981' : '#334155'}; border-radius:6px; padding:10px; font-family:monospace; font-size:11px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="color:#818cf8; font-weight:bold;">${h.header}</span>
                <button class="btn-toggle-stage" data-id="${h.id}" style="background:${h.isStaged ? '#10b981' : '#1e293b'}; color:${h.isStaged ? '#000' : '#cbd5e1'}; border:1px solid ${h.isStaged ? '#10b981' : '#475569'}; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:bold; cursor:pointer;">
                  ${h.isStaged ? '✓ STAGED' : 'STAGE HUNK'}
                </button>
              </div>
              <div style="white-space:pre-wrap; line-height:1.4; color:#cbd5e1;">${h.content}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

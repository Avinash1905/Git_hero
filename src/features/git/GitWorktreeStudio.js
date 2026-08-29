/**
 * GitQuest Frontend - Git Worktree Studio
 * Multi-workspace manager for checking out multiple branches simultaneously
 * into parallel working directory trees.
 */

export class WorktreeEntry {
  constructor(path, branch, headHash, isMain = false) {
    this.path = path;
    this.branch = branch;
    this.headHash = headHash;
    this.isMain = isMain;
    this.isLocked = false;
  }
}

export class GitWorktreeStudio {
  constructor(initialWorktrees = []) {
    this.worktrees = initialWorktrees.length > 0 ? initialWorktrees : [
      new WorktreeEntry('/workspace/gitquest', 'main', 'e4a1b02', true)
    ];
  }

  addWorktree(path, branch, headHash = 'e4a1b02') {
    if (this.worktrees.some(w => w.path === path)) {
      return { success: false, reason: `Worktree path '${path}' already exists.` };
    }
    if (this.worktrees.some(w => w.branch === branch)) {
      return { success: false, reason: `Branch '${branch}' is already checked out in another worktree.` };
    }

    const wt = new WorktreeEntry(path, branch, headHash, false);
    this.worktrees.push(wt);
    return { success: true, worktree: wt };
  }

  removeWorktree(path) {
    const idx = this.worktrees.findIndex(w => w.path === path);
    if (idx === -1) return { success: false, reason: 'Worktree not found' };
    if (this.worktrees[idx].isMain) {
      return { success: false, reason: 'Cannot remove primary main worktree.' };
    }

    const [removed] = this.worktrees.splice(idx, 1);
    return { success: true, removedWorktree: removed };
  }

  renderStudioHtml() {
    return `
      <div class="worktree-studio-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🌲 Git Worktree Studio (Parallel Workspaces)</h4>
            <span style="font-size:11px; color:#94a3b8;">${this.worktrees.length} active working trees</span>
          </div>
          <button class="btn-add-worktree" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Add Worktree</button>
        </div>

        <div class="worktrees-list" style="display:flex; flex-direction:column; gap:8px;">
          ${this.worktrees.map(wt => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:10px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-family:monospace; font-weight:bold; font-size:12px; color:#f8fafc;">${wt.path}</div>
                <div style="font-size:11px; color:#64748b; margin-top:2px;">
                  Branch: <span style="color:#fcd34d; font-family:monospace;">${wt.branch}</span> • HEAD: <span style="color:#a78bfa;">${wt.headHash.substring(0, 7)}</span>
                </div>
              </div>
              <div>
                ${wt.isMain
                  ? '<span style="font-size:10px; color:#34d399; font-weight:bold; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:3px;">PRIMARY ROOT</span>'
                  : `<button class="btn-remove-worktree" data-path="${wt.path}" style="background:#ef4444; color:#fff; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Remove</button>`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

/**
 * GitQuest Frontend - Git Branch Topology Explorer
 * Interactive visual branch navigator, remote tracking branch visualizer,
 * upstream sync status chips, and branch creation/checkout controls.
 */

export class BranchRecord {
  constructor(name, headCommitHash, isCurrent = false, upstream = null, commitsAhead = 0, commitsBehind = 0) {
    this.name = name;
    this.headCommitHash = headCommitHash;
    this.isCurrent = isCurrent;
    this.upstream = upstream; // e.g. 'origin/main'
    this.commitsAhead = commitsAhead;
    this.commitsBehind = commitsBehind;
    this.isProtected = name === 'main' || name === 'master';
  }
}

export class GitBranchTopologyExplorer {
  constructor(initialBranches = []) {
    this.branches = initialBranches;
    this.filterQuery = '';
    this.selectedBranch = null;
  }

  setBranches(branches) {
    this.branches = branches;
  }

  createBranch(name, startPointHash) {
    const cleanName = name.trim().replace(/\s+/g, '-');
    if (this.branches.some(b => b.name === cleanName)) {
      return { success: false, reason: `Branch '${cleanName}' already exists.` };
    }

    const newBranch = new BranchRecord(cleanName, startPointHash, false, `origin/${cleanName}`);
    this.branches.push(newBranch);
    return { success: true, branch: newBranch };
  }

  deleteBranch(name, force = false) {
    const idx = this.branches.findIndex(b => b.name === name);
    if (idx === -1) return { success: false, reason: 'Branch not found' };
    if (this.branches[idx].isCurrent) {
      return { success: false, reason: 'Cannot delete the currently active branch.' };
    }
    if (this.branches[idx].isProtected && !force) {
      return { success: false, reason: 'Cannot delete protected primary branch.' };
    }

    const [deleted] = this.branches.splice(idx, 1);
    return { success: true, deletedBranch: deleted };
  }

  renderExplorerHtml() {
    const current = this.branches.find(b => b.isCurrent);

    return `
      <div class="branch-topology-explorer" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:620px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="margin:0; font-size:16px; color:#38bdf8;">🌿 Branch Topology Explorer</h3>
            <span style="font-size:11px; color:#94a3b8;">Active HEAD: <b style="color:#fcd34d; font-family:monospace;">${current ? current.name : 'main'}</b></span>
          </div>
          <button class="btn-new-branch" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">+ New Branch</button>
        </div>

        <div class="branch-list" style="display:flex; flex-direction:column; gap:8px; max-height:280px; overflow-y:auto;">
          ${this.branches.map(b => `
            <div class="branch-card ${b.isCurrent ? 'active' : ''}" style="background:#0f172a; border:1px solid ${b.isCurrent ? '#38bdf8' : '#1e293b'}; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:16px;">${b.isCurrent ? '⭐' : '🌿'}</span>
                <div>
                  <div style="font-family:monospace; font-weight:bold; font-size:13px; color:${b.isCurrent ? '#38bdf8' : '#f8fafc'};">${b.name}</div>
                  <div style="font-size:11px; color:#64748b;">HEAD at <span style="color:#a78bfa;">${b.headCommitHash.substring(0, 7)}</span> ${b.upstream ? `• tracking ${b.upstream}` : ''}</div>
                </div>
              </div>

              <div style="display:flex; align-items:center; gap:8px;">
                ${b.commitsAhead > 0 ? `<span style="font-size:10px; color:#34d399; background:rgba(16,185,129,0.1); padding:2px 6px; border-radius:3px;">+${b.commitsAhead} ahead</span>` : ''}
                ${b.commitsBehind > 0 ? `<span style="font-size:10px; color:#f87171; background:rgba(239,68,68,0.1); padding:2px 6px; border-radius:3px;">-${b.commitsBehind} behind</span>` : ''}
                ${!b.isCurrent ? `<button class="btn-switch-branch" data-name="${b.name}" style="background:#1e293b; color:#cbd5e1; border:1px solid #475569; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Switch</button>` : '<span style="font-size:10px; color:#34d399; font-weight:bold;">CURRENT</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

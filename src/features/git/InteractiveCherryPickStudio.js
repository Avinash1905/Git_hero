/**
 * GitQuest Frontend - Interactive Cherry-Pick Studio
 * Interactive multi-commit picking queue, ancestor graph diffs,
 * commit cherry-pick playback, conflict previews, and cherry-pick log inspector.
 */

export class CherryPickQueueItem {
  constructor(commitHash, sourceBranch, subject, author, timestamp = Date.now()) {
    this.commitHash = commitHash;
    this.sourceBranch = sourceBranch;
    this.subject = subject;
    this.author = author;
    this.timestamp = timestamp;
    this.status = 'QUEUED'; // 'QUEUED', 'APPLIED', 'CONFLICT', 'SKIPPED'
  }
}

export class InteractiveCherryPickStudio {
  constructor() {
    this.queue = [];
    this.appliedHistory = [];
    this.targetBranch = 'main';
  }

  enqueueCommit(commitHash, sourceBranch, subject, author = 'Dev') {
    const item = new CherryPickQueueItem(commitHash, sourceBranch, subject, author);
    this.queue.push(item);
    return item;
  }

  removeCommit(commitHash) {
    const idx = this.queue.findIndex(c => c.commitHash === commitHash);
    if (idx !== -1) {
      return this.queue.splice(idx, 1)[0];
    }
    return null;
  }

  applyNext() {
    if (this.queue.length === 0) return { finished: true };

    const item = this.queue.shift();
    item.status = 'APPLIED';
    this.appliedHistory.push(item);

    return {
      success: true,
      applied: item,
      remainingInQueue: this.queue.length
    };
  }

  clearQueue() {
    this.queue = [];
  }

  renderStudioHtml() {
    return `
      <div class="cherry-pick-studio-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🍒 Cherry-Pick Staging Queue</h4>
            <span style="font-size:11px; color:#94a3b8;">Target Branch: <b style="color:#fcd34d;">${this.targetBranch}</b></span>
          </div>
          <button class="btn-apply-all-cp" style="background:#059669; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">Apply Next</button>
        </div>

        <div class="cp-queue-list" style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; font-family:monospace; font-size:11px;">
          ${this.queue.length === 0 ? `
            <div style="text-align:center; padding:16px; color:#64748b; font-size:12px; border:1px dashed #1e293b; border-radius:6px;">
              Cherry-pick queue is empty. Select commits to cherry-pick.
            </div>
          ` : this.queue.map(item => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:8px 10px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span style="color:#38bdf8; font-weight:bold;">${item.commitHash.substring(0, 7)}</span>
                <span style="color:#a78bfa; margin:0 6px;">[${item.sourceBranch}]</span>
                <span style="color:#e2e8f0;">${item.subject}</span>
              </div>
              <button class="btn-remove-cp" data-hash="${item.commitHash}" style="background:#ef4444; color:#fff; border:none; padding:2px 6px; border-radius:3px; font-size:10px; cursor:pointer;">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

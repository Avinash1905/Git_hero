/**
 * GitQuest Frontend - Git Stash Shelf Visualizer
 * Manages the Git stash stack (`stash@{0}`, `stash@{1}`), stash preview modals,
 * drop operations, branch creation from stash, and stash pop indicators.
 */

export class StashEntry {
  constructor(index, branch, description, payload = {}, timestamp = Date.now()) {
    this.index = index;
    this.selector = `stash@{${index}}`;
    this.branch = branch;
    this.description = description;
    this.payload = payload;
    this.timestamp = timestamp;
  }
}

export class GitStashShelf {
  constructor(maxEntries = 20) {
    this.stashes = [];
    this.maxEntries = maxEntries;
  }

  pushStash(branch, description = 'WIP on branch', payload = {}) {
    const newEntry = new StashEntry(0, branch, description, payload);
    this.stashes.unshift(newEntry);

    // Re-index
    this.stashes.forEach((s, idx) => {
      s.index = idx;
      s.selector = `stash@{${idx}}`;
    });

    if (this.stashes.length > this.maxEntries) {
      this.stashes.pop();
    }

    return newEntry;
  }

  popStash() {
    if (this.stashes.length === 0) return null;
    const popped = this.stashes.shift();

    this.stashes.forEach((s, idx) => {
      s.index = idx;
      s.selector = `stash@{${idx}}`;
    });

    return popped;
  }

  dropStash(index) {
    if (index >= 0 && index < this.stashes.length) {
      const [dropped] = this.stashes.splice(index, 1);
      this.stashes.forEach((s, idx) => {
        s.index = idx;
        s.selector = `stash@{${idx}}`;
      });
      return dropped;
    }
    return null;
  }

  clear() {
    this.stashes = [];
  }

  renderShelfHtml() {
    return `
      <div class="stash-shelf-panel" style="background:#090d16; color:#e2e8f0; padding:16px; border-radius:8px; border:1px solid rgba(56,189,248,0.25); max-width:400px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="margin:0; font-size:14px; color:#38bdf8;">📦 Git Stash Shelf (${this.stashes.length})</h4>
          <span style="font-size:10px; color:#64748b;">git stash pop / drop</span>
        </div>

        ${this.stashes.length === 0 ? `
          <div style="padding:16px; text-align:center; color:#64748b; font-size:12px; border:1px dashed #1e293b; border-radius:6px;">
            No stashed states on shelf.
          </div>
        ` : `
          <div class="stash-items-list" style="display:flex; flex-direction:column; gap:8px; max-height:220px; overflow-y:auto;">
            ${this.stashes.map(s => `
              <div class="stash-item-card" style="background:#0f172a; padding:8px 10px; border-radius:6px; border:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-family:monospace; font-weight:bold; font-size:11px; color:#fcd34d;">${s.selector}</div>
                  <div style="font-size:10px; color:#94a3b8;">${s.description} (${s.branch})</div>
                </div>
                <div style="display:flex; gap:4px;">
                  <button class="btn-pop-stash" data-idx="${s.index}" style="background:#10b981; color:#000; border:none; padding:2px 6px; border-radius:3px; font-size:10px; font-weight:bold; cursor:pointer;">Pop</button>
                  <button class="btn-drop-stash" data-idx="${s.index}" style="background:#ef4444; color:#fff; border:none; padding:2px 6px; border-radius:3px; font-size:10px; cursor:pointer;">Drop</button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }
}

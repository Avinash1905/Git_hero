/**
 * GitQuest Frontend - Conflict Resolution Workbench
 * Interactive 3-way conflict resolver UI, hunk selection (Accept Current,
 * Accept Incoming, Accept Both), conflict status inspector, and merge finalizer.
 */

export class ConflictHunk {
  constructor(id, currentText, incomingText, baseText = '', isResolved = false) {
    this.id = id;
    this.currentText = currentText;
    this.incomingText = incomingText;
    this.baseText = baseText;
    this.resolvedText = null;
    this.isResolved = isResolved;
    this.chosenOption = null; // 'CURRENT', 'INCOMING', 'BOTH'
  }

  resolveWith(option) {
    this.chosenOption = option;
    this.isResolved = true;

    if (option === 'CURRENT') {
      this.resolvedText = this.currentText;
    } else if (option === 'INCOMING') {
      this.resolvedText = this.incomingText;
    } else if (option === 'BOTH') {
      this.resolvedText = `${this.currentText}\n${this.incomingText}`;
    }
  }
}

export class ConflictResolutionWorkbench {
  constructor(filename = 'main.js', hunks = []) {
    this.filename = filename;
    this.hunks = hunks;
  }

  addConflictHunk(currentText, incomingText, baseText = '') {
    const id = `hunk_${this.hunks.length + 1}`;
    const hunk = new ConflictHunk(id, currentText, incomingText, baseText);
    this.hunks.push(hunk);
    return hunk;
  }

  resolveHunk(hunkId, option) {
    const hunk = this.hunks.find(h => h.id === hunkId);
    if (hunk) {
      hunk.resolveWith(option);
      return { success: true, allResolved: this.isAllResolved() };
    }
    return { success: false, reason: 'Hunk not found' };
  }

  isAllResolved() {
    return this.hunks.length > 0 && this.hunks.every(h => h.isResolved);
  }

  compileMergedResult() {
    if (!this.isAllResolved()) {
      return { success: false, reason: 'Unresolved conflict hunks remain.' };
    }
    const merged = this.hunks.map(h => h.resolvedText).join('\n\n');
    return { success: true, mergedContent: merged };
  }

  renderWorkbenchHtml() {
    const allDone = this.isAllResolved();

    return `
      <div class="conflict-workbench-modal" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:10px; border:1px solid #f87171; max-width:650px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="margin:0; color:#f87171; font-size:16px;">⚔️ Merge Conflict Workbench: ${this.filename}</h3>
            <p style="margin:2px 0 0 0; font-size:12px; color:#94a3b8;">Choose the intended hunk resolution for each conflict block.</p>
          </div>
          <span style="font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; background:${allDone ? '#065f46' : '#7f1d1d'}; color:${allDone ? '#34d399' : '#fca5a5'};">
            ${allDone ? '✓ CONFLICT RESOLVED' : 'UNRESOLVED'}
          </span>
        </div>

        <div class="hunks-list" style="display:flex; flex-direction:column; gap:12px;">
          ${this.hunks.map(hunk => `
            <div class="conflict-hunk-card" style="background:#0f172a; border:1px solid ${hunk.isResolved ? '#10b981' : '#ef4444'}; border-radius:6px; padding:10px; font-family:monospace; font-size:11px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px; color:#64748b;">
                <span>Conflict Block [${hunk.id}]</span>
                <span style="color:${hunk.isResolved ? '#34d399' : '#f87171'};">${hunk.isResolved ? `Resolved (${hunk.chosenOption})` : 'Action Required'}</span>
              </div>

              <!-- Current (HEAD) -->
              <div style="background:rgba(56,189,248,0.1); border-left:3px solid #38bdf8; padding:6px; margin-bottom:4px;">
                <div style="color:#38bdf8; font-weight:bold; font-size:10px;"><<<<<<< HEAD (Current Change)</div>
                <div style="color:#e2e8f0;">${hunk.currentText}</div>
              </div>

              <!-- Incoming -->
              <div style="background:rgba(52,211,153,0.1); border-left:3px solid #34d399; padding:6px; margin-bottom:8px;">
                <div style="color:#34d399; font-weight:bold; font-size:10px;">>>>>>>> Incoming Branch</div>
                <div style="color:#e2e8f0;">${hunk.incomingText}</div>
              </div>

              <!-- Action Buttons -->
              <div style="display:flex; gap:6px; justify-content:flex-end;">
                <button class="btn-resolve" data-hunk="${hunk.id}" data-opt="CURRENT" style="background:#0284c7; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Accept Current</button>
                <button class="btn-resolve" data-hunk="${hunk.id}" data-opt="INCOMING" style="background:#059669; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Accept Incoming</button>
                <button class="btn-resolve" data-hunk="${hunk.id}" data-opt="BOTH" style="background:#475569; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:10px; cursor:pointer;">Accept Both</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

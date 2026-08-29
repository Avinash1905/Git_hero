/**
 * GitQuest Frontend - Git Bisect Studio
 * Interactive bisect visualizer showing binary search tree, good/bad markers,
 * step counter, test runner triggers, and culprit report generation.
 */

export class GitBisectStudio {
  constructor(bisectEngine) {
    this.engine = bisectEngine;
    this.currentStepInfo = null;
  }

  startSession(badHash, goodHash) {
    this.currentStepInfo = this.engine.startBisect(badHash, goodHash);
    return this.currentStepInfo;
  }

  markGood() {
    if (!this.currentStepInfo || this.currentStepInfo.finished) return null;
    this.currentStepInfo = this.engine.markGood(this.currentStepInfo.lowIdx, this.currentStepInfo.highIdx);
    return this.currentStepInfo;
  }

  markBad() {
    if (!this.currentStepInfo || this.currentStepInfo.finished) return null;
    this.currentStepInfo = this.engine.markBad(this.currentStepInfo.lowIdx, this.currentStepInfo.highIdx);
    return this.currentStepInfo;
  }

  renderStudioHtml() {
    if (!this.engine.isActive && (!this.currentStepInfo || !this.currentStepInfo.finished)) {
      return `
        <div class="bisect-inactive-panel" style="background:#090d16; padding:16px; border-radius:8px; border:1px solid #1e293b; color:#94a3b8; font-size:12px;">
          No active git bisect session. Start with <code>git bisect start</code>.
        </div>
      `;
    }

    if (this.currentStepInfo?.finished) {
      const culprit = this.currentStepInfo.culpritCommit;
      return `
        <div class="bisect-result-panel" style="background:#090d16; border:1px solid #10b981; border-radius:10px; padding:18px; color:#e2e8f0; font-family:Inter, sans-serif;">
          <div style="color:#10b981; font-weight:bold; font-size:14px; margin-bottom:8px;">🎯 First Bad Commit Identified!</div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b; font-family:monospace; font-size:12px;">
            <div style="color:#38bdf8; font-weight:bold;">${culprit.hash}</div>
            <div style="color:#cbd5e1; margin-top:2px;">Author: ${culprit.author}</div>
            <div style="color:#fcd34d; margin-top:4px;">"${culprit.subject}"</div>
          </div>
        </div>
      `;
    }

    const cur = this.currentStepInfo?.currentCommit;

    return `
      <div class="bisect-active-panel" style="background:#090d16; border:1px solid #38bdf8; border-radius:10px; padding:18px; color:#e2e8f0; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="margin:0; color:#38bdf8; font-size:14px;">🔍 Git Bisect in Progress</h4>
          <span style="font-size:11px; color:#a78bfa;">Step ~${this.currentStepInfo.remainingSteps} remaining</span>
        </div>

        <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b; font-family:monospace; font-size:12px; margin-bottom:14px;">
          <div style="color:#64748b; font-size:10px;">TESTING REVISION:</div>
          <div style="color:#38bdf8; font-weight:bold;">${cur?.hash?.substring(0, 7)} — "${cur?.subject}"</div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn-bisect-good" style="flex:1; background:#059669; color:#fff; border:none; padding:8px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;">✓ Mark Good</button>
          <button class="btn-bisect-bad" style="flex:1; background:#dc2626; color:#fff; border:none; padding:8px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer;">✕ Mark Bad</button>
        </div>
      </div>
    `;
  }
}

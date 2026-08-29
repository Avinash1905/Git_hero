/**
 * GitQuest Frontend - Interactive Rebase Step Replayer
 * Step-by-step playback simulator for interactive rebase operations,
 * commit squashes, and linear timeline reconstruction animations.
 */

export class InteractiveRebaseReplayer {
  constructor(rebaseEngine) {
    this.rebaseEngine = rebaseEngine;
    this.currentStep = 0;
    this.isPlaying = false;
    this.playbackTimer = null;
  }

  stepForward() {
    if (this.currentStep < this.rebaseEngine.todoList.length) {
      this.currentStep++;
      return {
        step: this.currentStep,
        total: this.rebaseEngine.todoList.length,
        currentAction: this.rebaseEngine.todoList[this.currentStep - 1]
      };
    }
    return { finished: true };
  }

  stepBackward() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return {
        step: this.currentStep,
        total: this.rebaseEngine.todoList.length
      };
    }
    return { atStart: true };
  }

  reset() {
    this.currentStep = 0;
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearInterval(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  renderReplayerHtml() {
    const todos = this.rebaseEngine.todoList;

    return `
      <div class="rebase-replayer-panel" style="background:#090d16; color:#e2e8f0; padding:18px; border-radius:10px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🎬 Interactive Rebase Replayer</h4>
            <span style="font-size:11px; color:#94a3b8;">Step ${this.currentStep} of ${todos.length}</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn-step-prev" style="background:#1e293b; color:#fff; border:1px solid #475569; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">⏮ Prev</button>
            <button class="btn-step-next" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">Next ⏭</button>
          </div>
        </div>

        <div class="rebase-steps-list" style="display:flex; flex-direction:column; gap:6px; max-height:220px; overflow-y:auto; font-family:monospace; font-size:11px;">
          ${todos.map((item, idx) => {
            const isApplied = idx < this.currentStep;
            const isCurrent = idx === this.currentStep - 1;

            return `
              <div style="background:${isCurrent ? 'rgba(56,189,248,0.15)' : '#0f172a'}; border:1px solid ${isCurrent ? '#38bdf8' : (isApplied ? '#10b981' : '#1e293b')}; padding:6px 10px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <span style="color:#f59e0b; font-weight:bold;">${item.action.toUpperCase()}</span>
                  <span style="color:#38bdf8; margin:0 6px;">${item.commitHash.substring(0, 7)}</span>
                  <span style="color:#e2e8f0;">${item.subject}</span>
                </div>
                <span style="font-size:10px; color:${isApplied ? '#34d399' : '#64748b'};">${isApplied ? '✓ Applied' : 'Pending'}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

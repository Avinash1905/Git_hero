/**
 * GitQuest Frontend - Git Rebase Conflict Sandbox
 * Practice environment for stepping through interactive rebase conflicts,
 * using `git rebase --continue`, `git rebase --skip`, and `git rebase --abort`.
 */

export class GitRebaseConflictSandbox {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.isConflictActive = true;
    this.conflictFile = 'config.js';
  }

  resolveAndContinue() {
    this.isConflictActive = false;
    this.currentStep++;

    if (this.currentStep > this.totalSteps) {
      return {
        finished: true,
        message: 'Successfully rebased and updated refs/heads/feature.'
      };
    }

    return {
      finished: false,
      currentStep: this.currentStep,
      message: `Applying commit [${this.currentStep}/${this.totalSteps}]...`
    };
  }

  abortRebase() {
    this.currentStep = 1;
    this.isConflictActive = false;
    return {
      aborted: true,
      message: 'Rebase aborted. Restored original branch HEAD state.'
    };
  }

  renderSandboxHtml() {
    return `
      <div class="rebase-sandbox-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid #f87171; max-width:600px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h4 style="margin:0; color:#f87171; font-size:15px;">⚔️ Interactive Rebase Conflict Sandbox</h4>
            <span style="font-size:11px; color:#94a3b8;">Resolving step ${this.currentStep} of ${this.totalSteps}</span>
          </div>
          <span style="font-size:10px; background:#7f1d1d; color:#fca5a5; padding:2px 6px; border-radius:3px; font-weight:bold;">REBASE IN PROGRESS</span>
        </div>

        <div style="background:#0f172a; border:1px solid #1e293b; padding:12px; border-radius:6px; font-family:monospace; font-size:11px; margin-bottom:14px;">
          <div style="color:#fcd34d;">CONFLICT (content): Merge conflict in ${this.conflictFile}</div>
          <div style="color:#94a3b8; margin-top:4px;">Resolve conflicts and run "git add ${this.conflictFile}" then "git rebase --continue".</div>
        </div>

        <div style="display:flex; gap:8px;">
          <button class="btn-rebase-continue" style="flex:1; background:#059669; color:#fff; border:none; padding:8px; border-radius:6px; font-weight:bold; font-size:11px; cursor:pointer;">git rebase --continue</button>
          <button class="btn-rebase-skip" style="background:#1e293b; color:#cbd5e1; border:1px solid #475569; padding:8px 12px; border-radius:6px; font-size:11px; cursor:pointer;">--skip</button>
          <button class="btn-rebase-abort" style="background:#dc2626; color:#fff; border:none; padding:8px 12px; border-radius:6px; font-size:11px; cursor:pointer;">--abort</button>
        </div>
      </div>
    `;
  }
}

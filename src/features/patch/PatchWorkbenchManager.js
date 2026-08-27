/**
 * PatchWorkbenchManager
 * Visual mailbox manager for .patch files (git format-patch, git am, git apply)
 * with hunk reject markers and 3-way merge conflict resolution.
 */

export class PatchWorkbenchManager {
  constructor() {
    this.patches = [
      { id: 'patch_001', subject: 'feat(core): optimize laser node collision matrix', author: 'BranchViper <viper@githero.dev>', date: '2026-08-27', status: 'pending', hunks: 3 },
      { id: 'patch_002', subject: 'fix(engine): resolve corner deadlock in World 04', author: 'Operative_Echo <echo@githero.dev>', date: '2026-08-26', status: 'applied', hunks: 1 }
    ];
  }

  applyPatch(patchId) {
    const p = this.patches.find(x => x.id === patchId);
    if (!p) return { success: false, reason: 'Patch not found' };
    p.status = 'applied';
    return { success: true, patch: p };
  }

  rejectPatch(patchId) {
    const p = this.patches.find(x => x.id === patchId);
    if (!p) return { success: false, reason: 'Patch not found' };
    p.status = 'rejected';
    return { success: true, patch: p };
  }

  renderHtml(options = {}) {
    const { onApply = 'handleApplyPatch', onReject = 'handleRejectPatch' } = options;

    const cards = this.patches.map(p => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-surface-container text-amber-400 border border-outline-variant/20">
            <span class="material-symbols-outlined text-[18px]">mark_email_unread</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-surface">${p.subject}</span>
              <span class="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${p.status === 'applied' ? 'bg-primary/20 text-primary' : p.status === 'rejected' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'}">
                ${p.status}
              </span>
            </div>
            <div class="text-[10px] text-on-surface-variant">${p.author} • ${p.hunks} Hunks • ${p.date}</div>
          </div>
        </div>

        ${p.status === 'pending' ? `
          <div class="flex items-center gap-1.5">
            <button onclick="${onApply}('${p.id}')" class="px-2.5 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-[10px] font-bold uppercase cursor-pointer">
              Apply (git am)
            </button>
            <button onclick="${onReject}('${p.id}')" class="px-2.5 py-1 bg-surface-container hover:bg-error/20 text-on-surface-variant hover:text-error rounded-lg text-[10px] font-bold uppercase cursor-pointer">
              Reject
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">mail</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Patch Mailbox (git format-patch / git am)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.patches.length} Email Patches</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const patchWorkbenchManager = new PatchWorkbenchManager();

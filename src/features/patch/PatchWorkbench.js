/**
 * PatchWorkbench
 * Mailbox-driven distributed patch generator (format-patch) and applicator (git am).
 */

export class PatchWorkbench {
  constructor() {
    this.patches = [
      {
        id: 'patch-0001',
        title: '[PATCH 1/2] arena: calibrate quantum laser reflect factor',
        author: 'operative_beta <beta@gitquest.internal>',
        date: 'Sun, 24 Aug 2026 14:22:10 +0000',
        content: `From a1b2c3d4e5f6 Mon Sep 17 00:00:00 2001
From: operative_beta <beta@gitquest.internal>
Date: Sun, 24 Aug 2026 14:22:10 +0000
Subject: [PATCH 1/2] arena: calibrate quantum laser reflect factor

Refines reflection coefficients for diagonal prism mirrors to prevent infinite laser loops.
---
 src/engine/laser.js | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

diff --git a/src/engine/laser.js b/src/engine/laser.js
index 1029384..5647382 100644
--- a/src/engine/laser.js
+++ b/src/engine/laser.js
@@ -24,8 +24,8 @@ export function reflectBeam(angle) {
-  return angle + 90;
+  return (angle + 90) % 360;
 }
--
2.45.1
`,
        status: 'PENDING'
      }
    ];
  }

  applyPatch(patchId) {
    const patch = this.patches.find(p => p.id === patchId);
    if (!patch) return false;
    patch.status = 'APPLIED';
    return true;
  }

  rejectPatch(patchId) {
    const patch = this.patches.find(p => p.id === patchId);
    if (!patch) return false;
    patch.status = 'REJECTED';
    return true;
  }

  renderHtml() {
    const patchCards = this.patches.map((p) => {
      const isApplied = p.status === 'APPLIED';
      const isRejected = p.status === 'REJECTED';

      return `
        <div class="glass-panel p-5 rounded-2xl border ${isApplied ? 'border-primary/40 bg-primary/5' : isRejected ? 'border-error/30 opacity-40' : 'border-outline-variant/30'} space-y-4 font-terminal-code text-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-variant/30 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-primary font-bold font-mono">${p.id}</span>
                <span class="font-bold text-on-surface text-sm">${p.title}</span>
              </div>
              <div class="text-[11px] text-on-surface-variant mt-0.5">From: ${p.author} • ${p.date}</div>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase px-2 py-0.5 rounded font-bold font-terminal-label ${isApplied ? 'bg-primary/20 text-primary' : isRejected ? 'bg-error/20 text-error' : 'bg-tertiary/20 text-tertiary'}">
                ${p.status}
              </span>

              ${p.status === 'PENDING' ? `
                <button data-apply-patch="${p.id}" class="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-[10px] font-bold uppercase transition-colors cursor-pointer">
                  git am
                </button>
                <button data-reject-patch="${p.id}" class="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface hover:text-error font-terminal-label text-[10px] uppercase transition-colors cursor-pointer">
                  Reject
                </button>
              ` : ''}
            </div>
          </div>

          <pre class="p-3.5 rounded-xl bg-surface-container-lowest text-on-surface-variant font-mono text-[11px] overflow-x-auto border border-outline-variant/20 leading-relaxed">${p.content}</pre>
        </div>
      `;
    }).join('');

    return `
      <div class="space-y-4">
        ${patchCards}
      </div>
    `;
  }
}

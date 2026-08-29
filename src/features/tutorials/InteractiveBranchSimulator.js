/**
 * InteractiveBranchSimulator
 * Step-by-step branch merge conflict simulator and interactive conflict resolve assistant
 * with visual 3-way conflict markers (<<<<<<< HEAD, =======, >>>>>>> feature).
 */

export class InteractiveBranchSimulator {
  constructor() {
    this.conflictHunks = [
      {
        id: 'hunk_01',
        filename: 'src/puzzles/LaserGrid.js',
        ours: 'const laserColor = "#00ffcc"; // Cyber cyan mode',
        theirs: 'const laserColor = "#f43f5e"; // Crimson combat mode',
        resolved: null
      }
    ];
  }

  resolveHunk(hunkId, choice) {
    const hunk = this.conflictHunks.find(h => h.id === hunkId);
    if (!hunk) return false;
    hunk.resolved = choice === 'ours' ? hunk.ours : hunk.theirs;
    return true;
  }

  isFullyResolved() {
    return this.conflictHunks.every(h => h.resolved !== null);
  }

  renderHtml(options = {}) {
    const { onResolve = 'handleResolveConflict' } = options;

    const cards = this.conflictHunks.map(h => `
      <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3 font-mono text-xs">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <span class="text-amber-400 font-bold">${h.filename}</span>
          <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded ${h.resolved ? 'bg-primary/20 text-primary' : 'bg-error/20 text-error'}">
            ${h.resolved ? 'RESOLVED' : 'CONFLICT'}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
            <div class="text-[10px] text-primary uppercase font-bold flex items-center justify-between">
              <span>HEAD (Current Branch)</span>
              <button onclick="${onResolve}('${h.id}', 'ours')" class="px-2 py-0.5 rounded bg-primary text-black font-bold cursor-pointer">Accept Ours</button>
            </div>
            <div class="text-[11px] text-on-surface whitespace-pre">${h.ours}</div>
          </div>

          <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 space-y-2">
            <div class="text-[10px] text-purple-400 uppercase font-bold flex items-center justify-between">
              <span>Incoming Branch</span>
              <button onclick="${onResolve}('${h.id}', 'theirs')" class="px-2 py-0.5 rounded bg-purple-500 text-white font-bold cursor-pointer">Accept Theirs</button>
            </div>
            <div class="text-[11px] text-on-surface whitespace-pre">${h.theirs}</div>
          </div>
        </div>

        ${h.resolved ? `
          <div class="p-2.5 rounded-lg bg-surface-container text-primary text-xs font-bold border border-outline-variant/20">
            Selected Resolution: ${h.resolved}
          </div>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">call_merge</span>
            <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">3-Way Merge Conflict Resolver</h3>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.isFullyResolved() ? 'All Conflicts Resolved' : 'Conflicts Pending'}</span>
        </div>
        <div class="space-y-3">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const interactiveBranchSimulator = new InteractiveBranchSimulator();

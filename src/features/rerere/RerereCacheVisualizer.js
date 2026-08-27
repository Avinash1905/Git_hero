/**
 * RerereCacheVisualizer
 * Pre-image and post-image resolution memory visualizer for git rerere cache.
 */

export class RerereCacheVisualizer {
  constructor() {
    this.recordedResolutions = [
      { id: 'hunk_laser_01', path: 'src/puzzles/LaserGrid.js', conflictPattern: '<<<<<<< HEAD: 12 =======: 18 >>>>>>>', resolvedSnippet: 'const laserPower = 18;', timestamp: '10 mins ago' },
      { id: 'hunk_branch_ref_02', path: 'src/puzzles/BranchGate.js', conflictPattern: '<<<<<<< HEAD: ref/a =======: ref/b >>>>>>>', resolvedSnippet: 'const targetRef = "ref/b";', timestamp: '1 hour ago' }
    ];
  }

  renderHtml() {
    const items = this.recordedResolutions.map(r => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2 font-mono text-xs shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-pink-400 font-bold">${r.path}</span>
          <span class="text-[10px] text-on-surface-variant">${r.timestamp}</span>
        </div>
        <div class="p-2 rounded bg-black/40 text-on-surface-variant text-[10px] border border-white/5 overflow-x-auto">
          Conflict: ${r.conflictPattern}
        </div>
        <div class="p-2 rounded bg-primary/10 text-primary text-[10px] border border-primary/20">
          Auto-Resolution: ${r.resolvedSnippet}
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-pink-400">replay</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Recorded Resolutions (git rerere)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.recordedResolutions.length} Auto-Replay Patterns</span>
        </div>
        <div class="space-y-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const rerereCacheVisualizer = new RerereCacheVisualizer();

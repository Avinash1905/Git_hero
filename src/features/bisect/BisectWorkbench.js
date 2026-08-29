/**
 * BisectWorkbench
 * Binary search regression isolate engine simulating git bisect.
 * Mathematically isolates defect-introducing commits in O(log N) steps.
 */

export class BisectWorkbench {
  constructor() {
    this.isActive = true;
    this.commits = [
      { sha: 'c101', message: 'chore: initial grid scaffold', status: 'GOOD' },
      { sha: 'c102', message: 'feat: add push mechanic', status: 'GOOD' },
      { sha: 'c103', message: 'feat: add pull mechanic', status: 'UNKNOWN' },
      { sha: 'c104', message: 'perf: optimize lerp loop', status: 'UNKNOWN' },
      { sha: 'c105', message: 'refactor: decouple collision checks', status: 'UNKNOWN' }, // The actual regression!
      { sha: 'c106', message: 'style: format HUD typography', status: 'UNKNOWN' },
      { sha: 'c107', message: 'docs: update sector hints', status: 'UNKNOWN' },
      { sha: 'c108', message: 'feat: add laser traps (BROKEN)', status: 'BAD' }
    ];

    this.badSha = 'c108';
    this.goodSha = 'c101';
    this.currentMidpoint = 'c104';
  }

  calculateRemainingSteps() {
    const unknownCount = this.commits.filter(c => c.status === 'UNKNOWN').length;
    if (unknownCount <= 1) return 1;
    return Math.ceil(Math.log2(unknownCount + 1));
  }

  markRevision(sha, status) {
    const target = this.commits.find(c => c.sha === sha);
    if (!target) return false;
    target.status = status; // 'GOOD' | 'BAD'

    // Update midpoint
    const unknowns = this.commits.filter(c => c.status === 'UNKNOWN');
    if (unknowns.length > 0) {
      const midIdx = Math.floor(unknowns.length / 2);
      this.currentMidpoint = unknowns[midIdx].sha;
    } else {
      this.currentMidpoint = null;
      this.isActive = false;
    }

    return true;
  }

  renderHtml() {
    const stepsLeft = this.calculateRemainingSteps();

    const commitStrip = this.commits.map((c) => {
      const isMid = c.sha === this.currentMidpoint;
      const isBad = c.status === 'BAD';
      const isGood = c.status === 'GOOD';

      return `
        <div class="glass-panel p-3.5 rounded-xl border ${isMid ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' : isBad ? 'border-error/40 bg-error/5' : isGood ? 'border-secondary/40 bg-secondary/5' : 'border-outline-variant/30'} flex items-center justify-between gap-3 font-terminal-code text-xs">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full ${isBad ? 'bg-error' : isGood ? 'bg-secondary' : isMid ? 'bg-primary animate-pulse' : 'bg-outline-variant'}"></span>
            <span class="font-mono text-primary font-bold">${c.sha}</span>
            <span class="text-on-surface truncate">${c.message}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-terminal-label uppercase px-2 py-0.5 rounded font-bold ${isBad ? 'bg-error/20 text-error' : isGood ? 'bg-secondary/20 text-secondary' : isMid ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}">
              ${isMid ? 'TESTING (MIDPOINT)' : c.status}
            </span>

            ${isMid ? `
              <button data-bisect-good="${c.sha}" class="px-2.5 py-1 rounded bg-secondary hover:bg-secondary/90 text-on-secondary font-terminal-label text-[10px] font-bold uppercase transition-colors cursor-pointer">
                git bisect good
              </button>
              <button data-bisect-bad="${c.sha}" class="px-2.5 py-1 rounded bg-error hover:bg-error/90 text-on-error font-terminal-label text-[10px] font-bold uppercase transition-colors cursor-pointer">
                git bisect bad
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 font-terminal-code space-y-6 shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-variant/30 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-tertiary/20 text-tertiary text-[10px] font-terminal-label uppercase font-bold border border-tertiary/30">
                O(log N) REGRESSION SEARCH
              </span>
              <span class="text-xs text-on-surface font-bold">Bisecting range ${this.goodSha}..${this.badSha}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">Binary search will isolate the culprit commit in approximately ${stepsLeft} step${stepsLeft > 1 ? 's' : ''}</p>
          </div>

          <div class="text-right">
            <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Remaining Steps</div>
            <div class="text-base font-bold text-primary">~${stepsLeft} steps</div>
          </div>
        </div>

        <div class="space-y-2">
          ${commitStrip}
        </div>
      </div>
    `;
  }
}

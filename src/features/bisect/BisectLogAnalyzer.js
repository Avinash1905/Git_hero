/**
 * BisectLogAnalyzer
 * Binary search commit debugger calculating logarithmic steps O(log N) and identifying regression culprits.
 */

export class BisectLogAnalyzer {
  constructor() {
    this.commits = [
      { sha: 'v2.0.0', state: 'bad', message: 'Release v2.0.0' },
      { sha: 'e8d1c0a', state: 'untested', message: 'Refactor physics loop' },
      { sha: 'c5b4a39', state: 'untested', message: 'Update laser node coordinates' },
      { sha: 'a1f2b3c', state: 'untested', message: 'Optimize spatial hash grid' },
      { sha: 'v1.9.0', state: 'good', message: 'Release v1.9.0' }
    ];
  }

  getUntestedCount() {
    return this.commits.filter(c => c.state === 'untested').length;
  }

  getEstimatedSteps() {
    const count = this.getUntestedCount();
    return count > 0 ? Math.ceil(Math.log2(count)) : 0;
  }

  markState(sha, state) {
    const c = this.commits.find(x => x.sha === sha);
    if (!c) return false;
    c.state = state;
    return true;
  }

  renderHtml(options = {}) {
    const { onMark = 'handleMarkBisect' } = options;
    const stepsRemaining = this.getEstimatedSteps();

    const items = this.commits.map(c => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold ${c.state === 'good' ? 'text-emerald-400' : c.state === 'bad' ? 'text-rose-400' : 'text-on-surface'}">${c.sha}</span>
            <span class="text-on-surface-variant">${c.message}</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button onclick="${onMark}('${c.sha}', 'good')" class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase cursor-pointer">Good</button>
          <button onclick="${onMark}('${c.sha}', 'bad')" class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase cursor-pointer">Bad</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-indigo-400">search_insights</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Git Bisect Binary Search</span>
          </div>
          <span class="text-xs font-mono text-indigo-400 font-bold">~${stepsRemaining} Steps Remaining</span>
        </div>
        <div class="space-y-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const bisectLogAnalyzer = new BisectLogAnalyzer();

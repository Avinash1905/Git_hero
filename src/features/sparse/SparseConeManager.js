/**
 * SparseConeManager
 * Manages git sparse-checkout cone mode patterns, file inclusion trees,
 * and estimated disk savings calculations.
 */

export class SparseConeManager {
  constructor() {
    this.directories = [
      { path: 'src/features', included: true, sizeMb: 24.5 },
      { path: 'src/adapters', included: true, sizeMb: 8.2 },
      { path: 'assets/high-res-textures', included: false, sizeMb: 450.0 },
      { path: 'docs/historical-archives', included: false, sizeMb: 120.0 },
      { path: 'tests/benchmarks', included: false, sizeMb: 65.0 }
    ];
  }

  toggleDirectory(path) {
    const dir = this.directories.find(d => d.path === path);
    if (!dir) return false;
    dir.included = !dir.included;
    return true;
  }

  calculateDiskSavings() {
    const total = this.directories.reduce((acc, d) => acc + d.sizeMb, 0);
    const checkedOut = this.directories.filter(d => d.included).reduce((acc, d) => acc + d.sizeMb, 0);
    const saved = total - checkedOut;
    return {
      totalMb: Math.round(total * 10) / 10,
      checkedOutMb: Math.round(checkedOut * 10) / 10,
      savedMb: Math.round(saved * 10) / 10,
      savingsPct: Math.round((saved / total) * 100)
    };
  }

  renderHtml(options = {}) {
    const { onToggle = 'handleToggleSparseDir' } = options;
    const savings = this.calculateDiskSavings();

    const items = this.directories.map(d => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs">
        <div class="flex items-center gap-3">
          <input 
            type="checkbox" 
            ${d.included ? 'checked' : ''} 
            onchange="${onToggle}('${d.path}')"
            class="w-4 h-4 rounded text-fuchsia-500 focus:ring-fuchsia-500/30 cursor-pointer"
          />
          <div>
            <div class="font-bold text-on-surface">${d.path}</div>
            <div class="text-[10px] text-on-surface-variant">${d.sizeMb} MB</div>
          </div>
        </div>
        <span class="text-[10px] uppercase px-2 py-0.5 rounded ${d.included ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-surface-container text-on-surface-variant'}">
          ${d.included ? 'CHECKED OUT' : 'SPARSE EXCLUDED'}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-fuchsia-400">content_cut</span>
            <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Sparse Checkout Cone Manager</h3>
          </div>
          <span class="text-xs font-mono text-fuchsia-400 font-bold">${savings.savedMb} MB Saved (${savings.savingsPct}%)</span>
        </div>

        <div class="space-y-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const sparseConeManager = new SparseConeManager();

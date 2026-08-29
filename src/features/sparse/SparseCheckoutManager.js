/**
 * SparseCheckoutManager
 * Monorepo sparse checkout cone mode pattern compiler and working tree disk footprint optimizer.
 */

export class SparseCheckoutManager {
  constructor() {
    this.coneMode = true;
    this.monorepoDirectories = [
      { path: 'src/adapters', sizeMb: 1.2, checkedOut: true },
      { path: 'src/auth', sizeMb: 0.8, checkedOut: true },
      { path: 'src/features', sizeMb: 8.5, checkedOut: true },
      { path: 'src/pages', sizeMb: 4.2, checkedOut: true },
      { path: 'assets/highres-textures', sizeMb: 350.0, checkedOut: false },
      { path: 'docs/historical-archives', sizeMb: 120.0, checkedOut: false }
    ];
  }

  toggleDirectory(path) {
    const dir = this.monorepoDirectories.find(d => d.path === path);
    if (!dir) return false;
    dir.checkedOut = !dir.checkedOut;
    return true;
  }

  compileSparsePatterns() {
    if (this.coneMode) {
      return this.monorepoDirectories
        .filter(d => d.checkedOut)
        .map(d => `/${d.path}/`);
    }
    return ['/*'];
  }

  calculateDiskSavings() {
    const omittedSize = this.monorepoDirectories
      .filter(d => !d.checkedOut)
      .reduce((sum, d) => sum + d.sizeMb, 0);
    return omittedSize.toFixed(1);
  }

  renderHtml() {
    const rows = this.monorepoDirectories.map((d) => `
      <div class="glass-panel p-3.5 rounded-xl border ${d.checkedOut ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/20 opacity-60'} flex items-center justify-between gap-3 font-terminal-code text-xs">
        <div class="flex items-center gap-3">
          <input 
            type="checkbox" 
            data-sparse-toggle="${d.path}" 
            ${d.checkedOut ? 'checked' : ''} 
            class="w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer" 
          />
          <span class="material-symbols-outlined text-[18px] ${d.checkedOut ? 'text-primary' : 'text-on-surface-variant'}">folder</span>
          <span class="font-bold text-on-surface font-mono">${d.path}</span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-[11px] text-on-surface-variant">${d.sizeMb} MB</span>
          <span class="text-[10px] px-2 py-0.5 rounded font-terminal-label uppercase font-bold ${d.checkedOut ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'}">
            ${d.checkedOut ? 'CHECKED OUT' : 'SPARSE EXCLUDED'}
          </span>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-6 font-terminal-code text-xs">
        <!-- Stats Card -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-panel p-4 rounded-xl border border-outline-variant/30">
            <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Disk Storage Saved</div>
            <div class="text-xl font-bold text-primary mt-1">${this.calculateDiskSavings()} MB</div>
          </div>
          <div class="glass-panel p-4 rounded-xl border border-outline-variant/30">
            <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Checkout Mode</div>
            <div class="text-xl font-bold text-secondary mt-1">Cone Mode (Fast)</div>
          </div>
          <div class="glass-panel p-4 rounded-xl border border-outline-variant/30">
            <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Included Patterns</div>
            <div class="text-xl font-bold text-tertiary mt-1">${this.compileSparsePatterns().length} Directories</div>
          </div>
        </div>

        <!-- Directory Checkboxes -->
        <div class="space-y-2">
          ${rows}
        </div>
      </div>
    `;
  }
}

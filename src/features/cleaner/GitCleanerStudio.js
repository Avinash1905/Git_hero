/**
 * GitCleanerStudio
 * Interactive repository scrub engine simulating git filter-repo and git gc.
 * Detects oversized binary blobs and redacts credentials from commit history.
 */

export class GitCleanerStudio {
  constructor() {
    this.detectedBlobs = [
      { path: 'assets/recordings/demo-sector-100.mp4', sizeMb: 48.2, commitSha: 'blob-c401', status: 'DIRTY' },
      { path: 'dist/bundle.map', sizeMb: 14.5, commitSha: 'blob-c402', status: 'DIRTY' },
      { path: 'config/master-key.pem', sizeMb: 0.01, commitSha: 'blob-c403', status: 'LEAKED_CREDENTIAL' }
    ];
  }

  purgeBlob(path) {
    const item = this.detectedBlobs.find(b => b.path === path);
    if (!item) return false;
    item.status = 'PURGED';
    return true;
  }

  calculateReclaimedSpace() {
    return this.detectedBlobs
      .filter(b => b.status === 'PURGED')
      .reduce((sum, b) => sum + b.sizeMb, 0)
      .toFixed(1);
  }

  renderHtml() {
    const rows = this.detectedBlobs.map((b) => {
      const isPurged = b.status === 'PURGED';
      const isSecret = b.status === 'LEAKED_CREDENTIAL';

      return `
        <div class="glass-panel p-4 rounded-xl border ${isPurged ? 'border-outline-variant/20 opacity-40' : isSecret ? 'border-error/50 bg-error/5' : 'border-tertiary/40'} flex items-center justify-between gap-4 font-terminal-code text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] ${isSecret ? 'text-error' : 'text-tertiary'}">${isSecret ? 'lock_open' : 'attachment'}</span>
              <span class="font-bold text-on-surface">${b.path}</span>
            </div>
            <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
              <span>Size: <strong class="text-on-surface">${b.sizeMb} MB</strong></span>
              <span>Origin SHA: <strong class="text-primary font-mono">${b.commitSha}</strong></span>
            </div>
          </div>

          <div>
            ${isPurged ? `
              <span class="text-[10px] font-terminal-label uppercase px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                PURGED FROM DAG
              </span>
            ` : `
              <button data-purge-path="${b.path}" class="px-3 py-1.5 rounded-lg bg-error hover:bg-error/90 text-on-error font-terminal-label text-[11px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">delete</span>
                <span>Scrub History</span>
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="space-y-4 font-terminal-code text-xs">
        <div class="p-4 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20 flex items-center justify-between">
          <div>
            <div class="text-[10px] text-on-surface-variant uppercase font-terminal-label">Reclaimed Repository Storage</div>
            <div class="text-xl font-bold text-primary mt-0.5">${this.calculateReclaimedSpace()} MB / 62.7 MB</div>
          </div>
          <button id="btn-run-gc" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label font-bold text-xs uppercase cursor-pointer">
            Run git gc --prune
          </button>
        </div>

        <div class="space-y-3">
          ${rows}
        </div>
      </div>
    `;
  }
}

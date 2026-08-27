/**
 * GitBundleManager
 * Airgapped binary bundle packager and offline integrity verifier.
 */

export class GitBundleManager {
  constructor() {
    this.bundles = [
      {
        filename: 'gitquest-world-1-10.bundle',
        includedRefs: ['refs/heads/main', 'refs/tags/v1.0'],
        commitCount: 420,
        sizeMb: 8.4,
        status: 'VERIFIED'
      },
      {
        filename: 'feature-teleport-cluster.bundle',
        includedRefs: ['refs/heads/feature/teleport'],
        commitCount: 28,
        sizeMb: 1.2,
        status: 'VERIFIED'
      }
    ];
  }

  createBundle(filename, ref) {
    const existing = this.bundles.find(b => b.filename === filename);
    if (existing) return { success: false, reason: 'Bundle already exists' };

    const bundle = {
      filename,
      includedRefs: [ref || 'refs/heads/main'],
      commitCount: 15,
      sizeMb: 0.8,
      status: 'VERIFIED'
    };
    this.bundles.push(bundle);
    return { success: true, bundle };
  }

  verifyBundle(filename) {
    const bundle = this.bundles.find(b => b.filename === filename);
    if (!bundle) return { valid: false, reason: 'Bundle file not found' };
    return { valid: true, message: `The bundle is valid and contains ${bundle.commitCount} prerequisite objects.` };
  }

  renderHtml() {
    const bundleCards = this.bundles.map((b) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4 font-terminal-code text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
            <span class="font-bold text-on-surface text-sm">${b.filename}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold uppercase">
              ${b.status}
            </span>
          </div>
          <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
            <span>Refs: <strong class="text-secondary">${b.includedRefs.join(', ')}</strong></span>
            <span>Commits: <strong class="text-primary">${b.commitCount}</strong></span>
            <span>Size: <strong class="text-on-surface">${b.sizeMb} MB</strong></span>
          </div>
        </div>

        <button data-verify-bundle="${b.filename}" class="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-terminal-label text-[11px] uppercase transition-colors cursor-pointer">
          Verify
        </button>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${bundleCards}
      </div>
    `;
  }
}

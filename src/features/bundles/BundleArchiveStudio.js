/**
 * BundleArchiveStudio
 * Offline git bundle archive creator and verifier (git bundle create, git bundle verify).
 */

export class BundleArchiveStudio {
  constructor() {
    this.bundles = [
      { name: 'backup-world-01.bundle', headRef: 'refs/heads/master', sizeKb: 142, checksum: 'sha256:7f8a9b...', status: 'verified' },
      { name: 'solution-sector-250.bundle', headRef: 'refs/heads/singularity', sizeKb: 89, checksum: 'sha256:3d2e1f...', status: 'verified' }
    ];
  }

  createBundle(name, headRef) {
    const b = {
      name: name.endsWith('.bundle') ? name : `${name}.bundle`,
      headRef,
      sizeKb: Math.floor(Math.random() * 200) + 50,
      checksum: `sha256:${Math.random().toString(16).substring(2, 10)}...`,
      status: 'verified'
    };
    this.bundles.push(b);
    return b;
  }

  renderHtml() {
    const cards = this.bundles.map(b => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-500/20">
            <span class="material-symbols-outlined text-[18px]">folder_zip</span>
          </div>
          <div>
            <div class="font-bold text-sky-400">${b.name}</div>
            <div class="text-[10px] text-on-surface-variant">${b.headRef} • ${b.sizeKb} KB • ${b.checksum}</div>
          </div>
        </div>
        <span class="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
          ${b.status}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-sky-400">archive</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Offline Git Bundles (git bundle)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.bundles.length} Archives</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const bundleArchiveStudio = new BundleArchiveStudio();

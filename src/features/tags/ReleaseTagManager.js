/**
 * ReleaseTagManager
 * Manages annotated, lightweight, and GPG-signed release tags (git tag -a, git tag -s).
 */

export class ReleaseTagManager {
  constructor() {
    this.tags = [
      { name: 'v1.0.0', type: 'annotated', targetSha: 'aa0e609', message: 'Initial GitHero Alpha Launch', author: 'Linus', date: '2026-08-25' },
      { name: 'v1.5.0', type: 'annotated', targetSha: 'dac1658', message: 'Phase 2: 250 Handcrafted Sectors', author: 'Operative_Echo', date: '2026-08-27' },
      { name: 'v2.0.0-rc1', type: 'lightweight', targetSha: 'a909ac5', message: 'Release Candidate for Multiverse', author: 'BranchViper', date: '2026-08-28' }
    ];
  }

  createTag(name, targetSha, message = '') {
    const newTag = {
      name,
      type: message ? 'annotated' : 'lightweight',
      targetSha,
      message: message || 'Release milestone',
      author: 'Operative',
      date: new Date().toISOString().split('T')[0]
    };
    this.tags.unshift(newTag);
    return newTag;
  }

  renderHtml() {
    const cards = this.tags.map(t => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-surface-container text-amber-400 border border-outline-variant/20">
            <span class="material-symbols-outlined text-[18px]">sell</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-surface">${t.name}</span>
              <span class="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                ${t.type}
              </span>
            </div>
            <div class="text-[10px] text-on-surface-variant">${t.targetSha.substring(0, 7)} • ${t.message} • ${t.date}</div>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-amber-400">label</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Release Tags (git tag)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.tags.length} Release Tags</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const releaseTagManager = new ReleaseTagManager();

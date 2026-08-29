/**
 * TagManager
 * Manages annotated and lightweight SemVer release tags and GPG verification.
 */

export class TagManager {
  constructor() {
    this.tags = [
      {
        name: 'v1.0.0-tactical',
        commit: 'tag-c100',
        type: 'annotated',
        tagger: 'Commander Alpha',
        date: '2026-08-01',
        message: 'Milestone Release: Sector 50 Core Cleared',
        signed: true
      },
      {
        name: 'v0.9.0-beta',
        commit: 'tag-c090',
        type: 'lightweight',
        tagger: 'System',
        date: '2026-07-15',
        message: '',
        signed: false
      }
    ];
  }

  createTag(name, commit, message = '', isAnnotated = true) {
    const existing = this.tags.find(t => t.name === name);
    if (existing) {
      return { success: false, reason: `Tag '${name}' already exists` };
    }

    const tag = {
      name,
      commit: commit || 'HEAD',
      type: isAnnotated ? 'annotated' : 'lightweight',
      tagger: 'Operative',
      date: new Date().toISOString().split('T')[0],
      message,
      signed: isAnnotated
    };
    this.tags.unshift(tag);
    return { success: true, tag };
  }

  deleteTag(name) {
    const initialLen = this.tags.length;
    this.tags = this.tags.filter(t => t.name !== name);
    return this.tags.length < initialLen;
  }

  renderHtml() {
    const rows = this.tags.map((t) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4 font-terminal-code text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-tertiary">label</span>
            <span class="font-bold text-on-surface text-sm">${t.name}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant uppercase font-terminal-label font-bold">
              ${t.type}
            </span>
            ${t.signed ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30 font-terminal-label uppercase">GPG SIGNED</span>` : ''}
          </div>
          <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
            <span>Commit: <strong class="text-primary font-mono">${t.commit}</strong></span>
            <span>Date: ${t.date}</span>
            ${t.message ? `<span class="text-on-surface">"${t.message}"</span>` : ''}
          </div>
        </div>

        <button data-delete-tag="${t.name}" class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-error/20 text-on-surface hover:text-error font-terminal-label text-[11px] uppercase transition-colors cursor-pointer">
          Delete
        </button>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${rows}
      </div>
    `;
  }
}

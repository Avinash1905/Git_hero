/**
 * SubmoduleManager
 * Manages nested Git repository tracking, gitlink pointers, and recursive updates.
 */

export class SubmoduleManager {
  constructor() {
    this.submodules = [
      {
        path: 'vendor/tactical-core',
        url: 'https://github.com/gitquest/tactical-core.git',
        branch: 'main',
        commit: 'sub-a101',
        status: 'UP_TO_DATE'
      },
      {
        path: 'lib/render-gl',
        url: 'https://github.com/gitquest/render-gl.git',
        branch: 'release/v2.4',
        commit: 'sub-b202',
        status: 'MODIFIED'
      }
    ];
  }

  addSubmodule(path, url, branch = 'main') {
    const existing = this.submodules.find(s => s.path === path);
    if (existing) {
      return { success: false, reason: `Submodule at ${path} already exists` };
    }

    const sub = {
      path,
      url,
      branch,
      commit: `sub-${Math.random().toString(36).substr(2, 6)}`,
      status: 'INITIALIZED'
    };
    this.submodules.push(sub);
    return { success: true, submodule: sub };
  }

  updateSubmodule(path) {
    const sub = this.submodules.find(s => s.path === path);
    if (!sub) return false;
    sub.commit = `sub-${Math.random().toString(36).substr(2, 6)}`;
    sub.status = 'UP_TO_DATE';
    return true;
  }

  renderHtml() {
    const rows = this.submodules.map((s) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-4 font-terminal-code text-xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-secondary">folder_zip</span>
            <span class="font-bold text-on-surface">${s.path}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-mono">mode 160000</span>
          </div>
          <div class="text-[11px] text-on-surface-variant flex items-center gap-3">
            <span>Remote: <strong class="text-on-surface">${s.url}</strong></span>
            <span>Ref: <strong class="text-primary">${s.commit}</strong></span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[10px] font-terminal-label uppercase px-2 py-0.5 rounded font-bold ${s.status === 'UP_TO_DATE' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-tertiary/20 text-tertiary border border-tertiary/30'}">
            ${s.status}
          </span>
          <button data-update-sub="${s.path}" class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-terminal-label text-[11px] uppercase transition-colors cursor-pointer">
            Sync
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${rows}
      </div>
    `;
  }
}

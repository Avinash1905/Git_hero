/**
 * SubmoduleNavigator
 * Visual interactive submodule tree browser with nested depth inspection,
 * detached commit hash pointers, and .gitmodules editor.
 */

export class SubmoduleNavigator {
  constructor() {
    this.submodules = [
      { path: 'libs/quantum-physics', url: 'https://github.com/githero/quantum-engine.git', branch: 'main', commitSha: '7f9a2b1', status: 'synchronized' },
      { path: 'modules/laser-grid', url: 'https://github.com/githero/laser-grid.git', branch: 'v2.1', commitSha: '3c8e4d0', status: 'dirty' },
      { path: 'vendor/synthesizer', url: 'https://github.com/githero/audio-synth.git', branch: 'master', commitSha: '9e1f5a8', status: 'synchronized' }
    ];
  }

  /**
   * Add new submodule definition
   */
  addSubmodule(path, url, branch = 'main') {
    if (this.submodules.some(s => s.path === path)) {
      return { success: false, reason: `Submodule already registered at path: ${path}` };
    }
    const newSub = {
      path,
      url,
      branch,
      commitSha: Math.random().toString(16).substring(2, 9),
      status: 'synchronized'
    };
    this.submodules.push(newSub);
    return { success: true, submodule: newSub };
  }

  /**
   * Render .gitmodules configuration file
   */
  generateGitmodulesConfig() {
    return this.submodules.map(s => `[submodule "${s.path}"]\n\tpath = ${s.path}\n\turl = ${s.url}\n\tbranch = ${s.branch}\n`).join('\n');
  }

  /**
   * Render HTML submodule navigator
   */
  renderHtml(options = {}) {
    const { onAdd = 'handleAddSubmodule', onSync = 'handleSyncSubmodule' } = options;

    const cards = this.submodules.map((s, idx) => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-emerald-500/40 transition-all flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
            <span class="material-symbols-outlined text-[18px]">folder_special</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-emerald-400">${s.path}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full ${s.status === 'synchronized' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-warning/10 text-warning'} border border-white/5">
                ${s.status.toUpperCase()}
              </span>
            </div>
            <div class="text-[10px] text-on-surface-variant">Commit SHA: <strong class="text-on-surface">${s.commitSha}</strong> (${s.branch})</div>
          </div>
        </div>

        <button 
          type="button" 
          onclick="${onSync}(${idx})"
          class="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg border border-outline-variant/20 text-[10px] uppercase font-bold transition-all cursor-pointer"
        >
          Update Ref
        </button>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-4">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-emerald-400">account_tree</span>
            <h3 class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Submodule Navigator (git submodule)</h3>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.submodules.length} Nested Repositories</span>
        </div>

        <div class="space-y-2">
          ${cards}
        </div>

        <div>
          <span class="text-[10px] uppercase font-mono text-on-surface-variant font-bold mb-1 block">.gitmodules Config Preview</span>
          <pre class="p-3 rounded-xl bg-surface-container-lowest text-emerald-300 font-mono text-[11px] overflow-x-auto border border-outline-variant/20">${this.generateGitmodulesConfig()}</pre>
        </div>
      </div>
    `;
  }
}

export const submoduleNavigator = new SubmoduleNavigator();

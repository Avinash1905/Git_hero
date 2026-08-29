/**
 * GitConfigManager
 * Manages configuration cascades: System -> Global -> Local repository settings,
 * including user identities, custom tactical aliases, and core pager preferences.
 */

export class GitConfigManager {
  constructor() {
    this.scopes = {
      global: {
        'user.name': 'Commander Alpha',
        'user.email': 'alpha@gitquest.internal',
        'core.autocrlf': 'input',
        'core.editor': 'nano',
        'pull.rebase': 'true',
        'init.defaultBranch': 'main'
      },
      local: {
        'remote.origin.url': 'https://github.com/gitquest/simulation-sector.git',
        'branch.main.remote': 'origin',
        'branch.main.merge': 'refs/heads/main'
      }
    };

    this.aliases = [
      { alias: 'st', expansion: 'status -sb', description: 'Short branch status' },
      { alias: 'lg', expansion: 'log --graph --oneline --decorate --all', description: 'Visual topological commit DAG' },
      { alias: 'unstage', expansion: 'restore --staged', description: 'Unstage index files' },
      { alias: 'amend', expansion: 'commit --amend --no-edit', description: 'Amend staged changes to current commit' },
      { alias: 'save', expansion: 'stash push -m "WIP quicksave"', description: 'Emergency quicksave to stash' }
    ];
  }

  get(key, scope = 'local') {
    if (scope === 'local' && key in this.scopes.local) {
      return this.scopes.local[key];
    }
    return this.scopes.global[key] || null;
  }

  set(key, value, scope = 'global') {
    if (!this.scopes[scope]) this.scopes[scope] = {};
    this.scopes[scope][key] = value;
    return true;
  }

  addAlias(alias, expansion, description = '') {
    const existing = this.aliases.find(a => a.alias === alias);
    if (existing) {
      existing.expansion = expansion;
      existing.description = description;
      return true;
    }
    this.aliases.push({ alias, expansion, description });
    return true;
  }

  removeAlias(alias) {
    const initLen = this.aliases.length;
    this.aliases = this.aliases.filter(a => a.alias !== alias);
    return this.aliases.length < initLen;
  }

  renderHtml() {
    const aliasRows = this.aliases.map((a) => `
      <div class="glass-panel p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between gap-3 font-terminal-code text-xs">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold font-mono">git ${a.alias}</span>
            <span class="text-on-surface-variant font-mono">→</span>
            <span class="text-on-surface font-mono">${a.expansion}</span>
          </div>
          <div class="text-[10px] text-on-surface-variant">${a.description}</div>
        </div>

        <button data-remove-alias="${a.alias}" class="text-[10px] text-on-surface-variant hover:text-error font-terminal-label uppercase cursor-pointer">
          Delete
        </button>
      </div>
    `).join('');

    return `
      <div class="space-y-6 font-terminal-code text-xs">
        <!-- Identity Config -->
        <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-4">
          <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">Operative Identity (.gitconfig)</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] text-on-surface-variant uppercase font-terminal-label block mb-1">user.name</label>
              <input type="text" value="${this.get('user.name', 'global')}" class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label class="text-[10px] text-on-surface-variant uppercase font-terminal-label block mb-1">user.email</label>
              <input type="text" value="${this.get('user.email', 'global')}" class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <!-- Custom Aliases -->
        <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-4">
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
            <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">Tactical Command Aliases</h4>
            <span class="text-[10px] text-primary">${this.aliases.length} registered</span>
          </div>
          <div class="space-y-2">
            ${aliasRows}
          </div>
        </div>
      </div>
    `;
  }
}

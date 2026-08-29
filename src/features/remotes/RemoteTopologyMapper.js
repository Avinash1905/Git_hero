/**
 * RemoteTopologyMapper
 * Multi-remote distributed topology visualizer and refspec mapper.
 */

export class RemoteTopologyMapper {
  constructor() {
    this.remotes = [
      {
        name: 'origin',
        fetchUrl: 'https://github.com/gitquest/tactical-core.git',
        pushUrl: 'https://github.com/gitquest/tactical-core.git',
        fetchRefspec: '+refs/heads/*:refs/remotes/origin/*',
        pushRefspec: 'refs/heads/*:refs/heads/*',
        branches: ['main', 'dev', 'release/v1.0'],
        isMirror: false
      },
      {
        name: 'upstream',
        fetchUrl: 'https://github.com/headquarters/tactical-core.git',
        pushUrl: 'https://github.com/headquarters/tactical-core.git',
        fetchRefspec: '+refs/heads/*:refs/remotes/upstream/*',
        pushRefspec: '',
        branches: ['main'],
        isMirror: false
      },
      {
        name: 'mirror-backup',
        fetchUrl: 'git@backup.internal:gitquest.git',
        pushUrl: 'git@backup.internal:gitquest.git',
        fetchRefspec: '+refs/*:refs/*',
        pushRefspec: '+refs/*:refs/*',
        branches: ['*'],
        isMirror: true
      }
    ];
  }

  addRemote(name, url, isMirror = false) {
    const existing = this.remotes.find(r => r.name === name);
    if (existing) return { success: false, reason: `Remote '${name}' already exists` };

    const remote = {
      name,
      fetchUrl: url,
      pushUrl: url,
      fetchRefspec: isMirror ? '+refs/*:refs/*' : `+refs/heads/*:refs/remotes/${name}/*`,
      pushRefspec: isMirror ? '+refs/*:refs/*' : '',
      branches: ['main'],
      isMirror
    };
    this.remotes.push(remote);
    return { success: true, remote };
  }

  removeRemote(name) {
    const initLen = this.remotes.length;
    this.remotes = this.remotes.filter(r => r.name !== name);
    return this.remotes.length < initLen;
  }

  renderHtml() {
    const cards = this.remotes.map((r) => `
      <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 font-terminal-code text-xs space-y-3 shadow-md">
        <div class="flex items-center justify-between border-b border-surface-variant/30 pb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-secondary">cloud_sync</span>
            <span class="font-bold text-on-surface text-sm font-mono">${r.name}</span>
            ${r.isMirror ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-tertiary/20 text-tertiary font-bold font-terminal-label uppercase">MIRROR</span>` : ''}
          </div>

          ${r.name !== 'origin' ? `
            <button data-remove-remote="${r.name}" class="text-[10px] text-on-surface-variant hover:text-error uppercase font-terminal-label cursor-pointer">
              Remove
            </button>
          ` : ''}
        </div>

        <div class="space-y-1 text-[11px] text-on-surface-variant">
          <div>Fetch URL: <strong class="text-on-surface font-mono">${r.fetchUrl}</strong></div>
          <div>Fetch Refspec: <strong class="text-primary font-mono">${r.fetchRefspec}</strong></div>
          <div>Tracking Branches: <strong class="text-secondary font-mono">${r.branches.join(', ')}</strong></div>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${cards}
      </div>
    `;
  }
}

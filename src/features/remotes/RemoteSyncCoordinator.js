/**
 * RemoteSyncCoordinator
 * Multi-remote sync coordinator managing fetch, push, prune, upstream tracking branches, and refspecs.
 */

export class RemoteSyncCoordinator {
  constructor() {
    this.remotes = [
      { name: 'origin', url: 'https://github.com/Avinash1905/Git_hero.git', fetchRefspec: '+refs/heads/*:refs/remotes/origin/*', status: 'synced', latencyMs: 34 },
      { name: 'upstream', url: 'https://github.com/githero/engine-core.git', fetchRefspec: '+refs/heads/*:refs/remotes/upstream/*', status: 'synced', latencyMs: 52 }
    ];
  }

  addRemote(name, url) {
    if (this.remotes.some(r => r.name === name)) {
      return { success: false, reason: 'Remote name already exists' };
    }
    const r = {
      name,
      url,
      fetchRefspec: `+refs/heads/*:refs/remotes/${name}/*`,
      status: 'synced',
      latencyMs: Math.floor(Math.random() * 50) + 20
    };
    this.remotes.push(r);
    return { success: true, remote: r };
  }

  renderHtml(options = {}) {
    const { onAdd = 'handleAddRemote' } = options;

    const cards = this.remotes.map(r => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-sky-950/40 text-sky-400 border border-sky-500/20">
            <span class="material-symbols-outlined text-[18px]">cloud_sync</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-sky-400">${r.name}</span>
              <span class="text-[10px] text-on-surface-variant">${r.latencyMs}ms ping</span>
            </div>
            <div class="text-[10px] text-on-surface-variant">${r.url}</div>
          </div>
        </div>
        <span class="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
          ${r.status}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-sky-400">cloud</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Remote Topologies (git remote)</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.remotes.length} Configured Remotes</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const remoteSyncCoordinator = new RemoteSyncCoordinator();

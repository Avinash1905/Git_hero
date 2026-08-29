/**
 * ActiveSessionsView
 * Renders active authenticated devices, IP origins, last activity timestamps,
 * and remote session invalidation controls.
 */

export class ActiveSessionsView {
  constructor() {
    this.sessions = [
      { id: 'sess_curr', device: 'Current Session (Web Browser)', ip: '127.0.0.1', location: 'Localhost', lastActive: 'Active Now', isCurrent: true },
      { id: 'sess_mobile', device: 'Mobile Tactical Terminal (iOS)', ip: '192.168.1.45', location: 'Local Subnet', lastActive: '2 hours ago', isCurrent: false },
      { id: 'sess_cli', device: 'GitHero CLI Companion (Linux)', ip: '10.0.0.12', location: 'Dev Environment', lastActive: 'Yesterday', isCurrent: false }
    ];
  }

  revokeSession(sessionId) {
    if (sessionId === 'sess_curr') return false;
    this.sessions = this.sessions.filter(s => s.id !== sessionId);
    return true;
  }

  renderHtml(options = {}) {
    const { onRevoke = 'handleRevokeSession' } = options;

    const cards = this.sessions.map(s => `
      <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-surface-container text-primary border border-outline-variant/20">
            <span class="material-symbols-outlined text-[18px]">${s.isCurrent ? 'computer' : 'smartphone'}</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-surface">${s.device}</span>
              ${s.isCurrent ? '<span class="text-[9px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-bold">THIS DEVICE</span>' : ''}
            </div>
            <div class="text-[10px] text-on-surface-variant">${s.ip} (${s.location}) • Last active: ${s.lastActive}</div>
          </div>
        </div>

        ${!s.isCurrent ? `
          <button 
            type="button" 
            onclick="${onRevoke}('${s.id}')"
            class="px-2.5 py-1 bg-surface-container hover:bg-error/20 text-on-surface-variant hover:text-error rounded-lg border border-outline-variant/20 text-[10px] uppercase font-bold transition-all cursor-pointer"
          >
            Revoke
          </button>
        ` : ''}
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">devices</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Active Device Sessions</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.sessions.length} Active Devices</span>
        </div>
        <div class="space-y-2">
          ${cards}
        </div>
      </div>
    `;
  }
}

export const activeSessionsView = new ActiveSessionsView();

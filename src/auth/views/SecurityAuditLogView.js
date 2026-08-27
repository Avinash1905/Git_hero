/**
 * SecurityAuditLogView
 * Timeline viewing login history, password change events, failed auth attempts, and MFA security challenges.
 */

export class SecurityAuditLogView {
  constructor() {
    this.events = [
      { id: 'ev_1', type: 'LOGIN_SUCCESS', desc: 'Successful login from web client', ip: '127.0.0.1', timestamp: '10 minutes ago', severity: 'info' },
      { id: 'ev_2', type: 'MFA_CHALLENGE', desc: 'Two-factor TOTP verified successfully', ip: '127.0.0.1', timestamp: '10 minutes ago', severity: 'info' },
      { id: 'ev_3', type: 'PASSWORD_HASH_UPGRADE', desc: 'Upgraded cryptographic password hash to scrypt', ip: '127.0.0.1', timestamp: '1 hour ago', severity: 'info' },
      { id: 'ev_4', type: 'SESSION_RESTORED', desc: 'Restored active JWT session from local storage', ip: '127.0.0.1', timestamp: '2 hours ago', severity: 'info' }
    ];
  }

  renderHtml() {
    const items = this.events.map(e => `
      <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between font-mono text-xs shadow-sm">
        <div class="flex items-center gap-3">
          <span class="w-2 h-2 rounded-full ${e.severity === 'info' ? 'bg-primary' : 'bg-warning'}"></span>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-on-surface">${e.type}</span>
              <span class="text-[10px] text-on-surface-variant">• ${e.desc}</span>
            </div>
            <div class="text-[10px] text-on-surface-variant">${e.ip} • ${e.timestamp}</div>
          </div>
        </div>
        <span class="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-surface-container border border-outline-variant/20 text-on-surface-variant">
          ${e.severity}
        </span>
      </div>
    `).join('');

    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">security_update_good</span>
            <span class="text-xs font-mono font-bold text-on-surface uppercase tracking-wider">Account Security Audit Log</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant">${this.events.length} Events Recorded</span>
        </div>
        <div class="space-y-2">
          ${items}
        </div>
      </div>
    `;
  }
}

export const securityAuditLogView = new SecurityAuditLogView();

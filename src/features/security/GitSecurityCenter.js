/**
 * GitSecurityCenter
 * Cryptographic security hub managing GPG commit signing keys and SSH transport keys.
 */

export class GitSecurityCenter {
  constructor() {
    this.gpgKeys = [
      {
        id: '4A1B2C3D4E5F6789',
        type: 'ed25519',
        email: 'alpha@gitquest.internal',
        fingerprint: '3AA5 4C91 2F8B E310 D002 9B1C 4A1B 2C3D 4E5F 6789',
        created: '2026-01-10',
        expires: '2028-01-10',
        isDefault: true
      }
    ];

    this.sshKeys = [
      {
        title: 'Tactical Cyberdeck Key',
        type: 'ssh-ed25519',
        fingerprint: 'SHA256:xK7vM8+q2N5z8W0kL3j9R1sP4tU7vX2yZ5aB8cE1dF4',
        lastUsed: 'Today'
      }
    ];
  }

  verifyCommitSignature(commit) {
    if (!commit.signed) {
      return { status: 'UNVERIFIED', label: 'Unverified', badgeClass: 'bg-surface-container-high text-on-surface-variant' };
    }
    const matchingKey = this.gpgKeys.find(k => k.email === commit.authorEmail || k.id === commit.keyId);
    if (matchingKey) {
      return { status: 'VERIFIED', label: 'Verified (GPG)', badgeClass: 'bg-primary/20 text-primary border border-primary/30' };
    }
    return { status: 'UNKNOWN_KEY', label: 'Unknown Key', badgeClass: 'bg-tertiary/20 text-tertiary border border-tertiary/30' };
  }

  addGpgKey(keyData) {
    this.gpgKeys.push(keyData);
    return true;
  }

  renderHtml() {
    const gpgList = this.gpgKeys.map((k) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">key</span>
            <span class="font-bold text-on-surface font-mono">${k.id}</span>
            ${k.isDefault ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-primary/20 text-primary font-bold font-terminal-label uppercase">DEFAULT SIGNING KEY</span>` : ''}
          </div>
          <span class="text-[10px] text-on-surface-variant">${k.type}</span>
        </div>

        <div class="text-[11px] text-on-surface-variant">
          <div>Associated Email: <strong class="text-on-surface">${k.email}</strong></div>
          <div class="font-mono text-[10px] text-primary/80 mt-1">${k.fingerprint}</div>
        </div>
      </div>
    `).join('');

    const sshList = this.sshKeys.map((k) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs flex items-center justify-between gap-3">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-secondary">vpn_key</span>
            <span class="font-bold text-on-surface">${k.title}</span>
          </div>
          <div class="font-mono text-[10px] text-on-surface-variant">${k.fingerprint}</div>
        </div>
        <span class="text-[10px] text-on-surface-variant font-terminal-label">Last used: ${k.lastUsed}</span>
      </div>
    `).join('');

    return `
      <div class="space-y-6 font-terminal-code text-xs">
        <!-- GPG Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">GPG Commit Signing Keys</h4>
            <span class="text-[10px] text-primary">git config commit.gpgSign true</span>
          </div>
          ${gpgList}
        </div>

        <!-- SSH Section -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">SSH Authentication Keys</h4>
            <span class="text-[10px] text-secondary">~/.ssh/id_ed25519</span>
          </div>
          ${sshList}
        </div>
      </div>
    `;
  }
}

/**
 * GitQuest Frontend - Git Keyring Studio
 * Cryptographic key manager UI, signature status badges (Verified, Unverified, Untrusted),
 * public key import modals, and commit signing preferences.
 */

export class GitKeyringStudio {
  constructor(keyringSigner) {
    this.signer = keyringSigner;
  }

  renderStudioHtml() {
    const keys = Array.from(this.signer.keys.values());

    return `
      <div class="keyring-studio-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.25); max-width:580px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h4 style="margin:0; color:#38bdf8; font-size:15px;">🔐 GPG & SSH Signing Keyring</h4>
            <span style="font-size:11px; color:#94a3b8;">Cryptographic commit signing & verification</span>
          </div>
          <button class="btn-import-key" style="background:#0284c7; color:#fff; border:none; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer;">+ Import Key</button>
        </div>

        <div class="keys-list" style="display:flex; flex-direction:column; gap:8px;">
          ${keys.map(k => `
            <div style="background:#0f172a; border:1px solid #1e293b; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:bold; font-size:13px; color:#f8fafc;">${k.name}</span>
                  <span style="font-size:10px; color:#38bdf8; background:rgba(56,189,248,0.1); padding:2px 6px; border-radius:3px;">${k.keyType}</span>
                </div>
                <div style="font-family:monospace; font-size:10px; color:#64748b; margin-top:3px;">
                  Fingerprint: <span style="color:#a78bfa;">${k.fingerprint}</span>
                </div>
              </div>
              <div>
                ${k.isTrusted
                  ? '<span style="font-size:10px; color:#34d399; font-weight:bold; background:rgba(16,185,129,0.1); padding:2px 8px; border-radius:4px;">✓ TRUSTED</span>'
                  : '<span style="font-size:10px; color:#f59e0b; background:rgba(245,158,11,0.1); padding:2px 8px; border-radius:4px;">UNTRUSTED</span>'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

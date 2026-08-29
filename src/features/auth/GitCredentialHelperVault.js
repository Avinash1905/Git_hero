/**
 * GitQuest Frontend - Git Credential Helper Vault
 * Simulates git-credential-helper backends (cache, store, wincred, osxkeychain),
 * secure in-memory ephemeral caching, host matching, and token expiry rotation.
 */

export class CredentialRecord {
  constructor(protocol, host, username, token = '', expiresAt = null) {
    this.protocol = protocol || 'https';
    this.host = host;
    this.username = username;
    this.token = token;
    this.expiresAt = expiresAt || (Date.now() + 3600000); // 1 hour default
  }

  isExpired() {
    return this.expiresAt ? Date.now() > this.expiresAt : false;
  }
}

export class GitCredentialHelperVault {
  constructor(helperMode = 'cache') {
    this.helperMode = helperMode; // 'cache', 'store', 'wincred'
    this.credentials = new Map(); // `${protocol}://${host}` -> CredentialRecord
  }

  storeCredential(protocol, host, username, token, ttlSec = 3600) {
    const key = `${protocol || 'https'}://${host}`;
    const expiresAt = Date.now() + (ttlSec * 1000);
    const rec = new CredentialRecord(protocol, host, username, token, expiresAt);
    this.credentials.set(key, rec);
    return { success: true, host, username };
  }

  getCredential(protocol, host) {
    const key = `${protocol || 'https'}://${host}`;
    const rec = this.credentials.get(key);

    if (!rec) return null;
    if (rec.isExpired()) {
      this.credentials.delete(key);
      return null;
    }

    return {
      protocol: rec.protocol,
      host: rec.host,
      username: rec.username,
      token: rec.token
    };
  }

  eraseCredential(protocol, host) {
    const key = `${protocol || 'https'}://${host}`;
    const existed = this.credentials.delete(key);
    return { success: existed, host };
  }

  listActiveHosts() {
    return Array.from(this.credentials.values())
      .filter(c => !c.isExpired())
      .map(c => ({ host: c.host, username: c.username, protocol: c.protocol }));
  }
}

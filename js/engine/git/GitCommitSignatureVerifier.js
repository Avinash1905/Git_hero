/**
 * GitQuest Engine - Git Commit Signature Verifier
 * Cryptographic GPG/SSH public key signature generator, armored ASCII signature format, and multi-sig verifier.
 */

import { EngineUtils } from '../core/Utils.js';

export class GPGKey {
  constructor(keyId, owner, fingerprint = null) {
    this.keyId = keyId || EngineUtils.generateUUID().substring(0, 16).toUpperCase();
    this.owner = owner;
    this.fingerprint = fingerprint || EngineUtils.generateGitHash(this.keyId).toUpperCase();
    this.isTrusted = true;
  }
}

export class GitCommitSignatureVerifier {
  constructor() {
    this.keyring = new Map(); // keyId -> GPGKey
  }

  importKey(key) {
    this.keyring.set(key.keyId, key);
    return key;
  }

  signCommit(commitHash, keyId) {
    const key = this.keyring.get(keyId);
    if (!key) {
      throw new Error(`fatal: GPG secret key '${keyId}' not found on keyring`);
    }

    const sigData = EngineUtils.generateGitHash(`${commitHash}_${keyId}`);
    return `-----BEGIN PGP SIGNATURE-----\nVersion: GitQuest GnuPG v2.4\nKey-ID: ${key.keyId}\n\n${sigData}\n-----END PGP SIGNATURE-----`;
  }

  verifyCommitSignature(commitHash, signatureText) {
    if (!signatureText || !signatureText.includes('BEGIN PGP SIGNATURE')) {
      return { verified: false, reason: 'unsigned_commit' };
    }

    const keyMatch = signatureText.match(/Key-ID:\s*([A-Za-z0-9_\-]+)/);
    if (!keyMatch) {
      return { verified: false, reason: 'malformed_signature' };
    }

    const keyId = keyMatch[1];
    const key = this.keyring.get(keyId);
    if (!key) {
      return { verified: false, reason: 'unknown_public_key', keyId };
    }

    return {
      verified: true,
      keyId: key.keyId,
      owner: key.owner,
      fingerprint: key.fingerprint,
      isTrusted: key.isTrusted
    };
  }
}

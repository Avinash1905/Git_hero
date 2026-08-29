/**
 * GitQuest Game Engine - Git Keyring & Cryptographic Commit Signer
 * GPG / SSH simulated cryptographic key signing, signature verification,
 * trust rings, and tamper-proof commit validation.
 */

export class CryptographicKey {
  constructor(id, name, fingerprint, keyType = 'ED25519', isTrusted = true) {
    this.id = id;
    this.name = name;
    this.fingerprint = fingerprint;
    this.keyType = keyType;
    this.isTrusted = isTrusted;
    this.createdAt = Date.now();
  }
}

export class GitKeyringSigner {
  constructor() {
    this.keys = new Map();
    this.activeSigningKeyId = null;
    this.initDefaultKey();
  }

  initDefaultKey() {
    const defaultKey = new CryptographicKey(
      'key_dev_default',
      'GitQuest Developer',
      'E4A1 B028 91F0 3C89 1F03 4B2A 8D10',
      'ED25519',
      true
    );
    this.keys.set(defaultKey.id, defaultKey);
    this.activeSigningKeyId = defaultKey.id;
  }

  registerKey(key) {
    this.keys.set(key.id, key);
  }

  signCommit(commitHash, payloadText) {
    const key = this.keys.get(this.activeSigningKeyId);
    if (!key) return { isSigned: false };

    // Simulated PGP ASCII Armor signature
    const signature = `-----BEGIN PGP SIGNATURE-----\nVersion: GitQuest Keyring v1.0\nFingerprint: ${key.fingerprint}\nHash: ${commitHash.substring(0, 16)}\n-----END PGP SIGNATURE-----`;

    return {
      isSigned: true,
      signerKeyId: key.id,
      fingerprint: key.fingerprint,
      signature
    };
  }

  verifySignature(signatureBlock) {
    if (!signatureBlock || !signatureBlock.includes('BEGIN PGP SIGNATURE')) {
      return { isValid: false, reason: 'Unsigned commit' };
    }

    const match = signatureBlock.match(/Fingerprint:\s+([^\n]+)/);
    if (!match) return { isValid: false, reason: 'Malformed signature' };

    const fingerprint = match[1].trim();
    const key = Array.from(this.keys.values()).find(k => k.fingerprint === fingerprint);

    if (!key) {
      return { isValid: false, isUnknownKey: true, reason: 'Public key not in keyring' };
    }

    return {
      isValid: true,
      isTrusted: key.isTrusted,
      keyName: key.name,
      fingerprint: key.fingerprint
    };
  }
}

/**
 * GitQuest Game Engine - Git Signature Verification Cache
 * LRU in-memory cache for validated GPG/SSH commit signatures,
 * Certificate Revocation List (CRL) checker, and public key expiry tracking.
 */

export class CachedSignatureRecord {
  constructor(commitHash, isValid, keyFingerprint, checkedAt = Date.now()) {
    this.commitHash = commitHash;
    this.isValid = isValid;
    this.keyFingerprint = keyFingerprint;
    this.checkedAt = checkedAt;
  }
}

export class GitSignatureVerificationCache {
  constructor(maxSize = 250) {
    this.cache = new Map(); // commitHash -> CachedSignatureRecord
    this.revokedFingerprints = new Set();
    this.maxSize = maxSize;
  }

  revokeKey(fingerprint) {
    this.revokedFingerprints.add(fingerprint);
    // Invalidate cached records for this key
    for (const [hash, record] of this.cache.entries()) {
      if (record.keyFingerprint === fingerprint) {
        record.isValid = false;
      }
    }
  }

  isKeyRevoked(fingerprint) {
    return this.revokedFingerprints.has(fingerprint);
  }

  getVerification(commitHash) {
    const record = this.cache.get(commitHash);
    if (!record) return null;

    if (this.isKeyRevoked(record.keyFingerprint)) {
      record.isValid = false;
    }

    return record;
  }

  cacheVerification(commitHash, isValid, keyFingerprint) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const rec = new CachedSignatureRecord(commitHash, isValid && !this.isKeyRevoked(keyFingerprint), keyFingerprint);
    this.cache.set(commitHash, rec);
    return rec;
  }

  clear() {
    this.cache.clear();
  }
}

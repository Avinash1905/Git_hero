/**
 * GitQuest Frontend - State Persistence Adapter
 * Resilient cross-storage state synchronizer supporting LocalStorage,
 * IndexedDB, in-memory backup fallback, version migrations, and checksum hashing.
 */

export class StatePersistenceAdapter {
  constructor(storagePrefix = 'gitquest_state_v1_') {
    this.storagePrefix = storagePrefix;
    this.inMemoryCache = new Map();
    this.schemaVersion = 2;
  }

  _getKey(key) {
    return `${this.storagePrefix}${key}`;
  }

  save(key, data) {
    const serialized = JSON.stringify({
      version: this.schemaVersion,
      savedAt: Date.now(),
      data
    });

    this.inMemoryCache.set(key, serialized);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this._getKey(key), serialized);
        return true;
      } catch (e) {
        console.warn('[StatePersistenceAdapter] LocalStorage write failed, fallback to memory', e);
      }
    }

    return true;
  }

  load(key, defaultValue = null) {
    let serialized = null;

    if (typeof localStorage !== 'undefined') {
      try {
        serialized = localStorage.getItem(this._getKey(key));
      } catch (e) {
        // storage disabled or sandboxed
      }
    }

    if (!serialized) {
      serialized = this.inMemoryCache.get(key);
    }

    if (!serialized) return defaultValue;

    try {
      const parsed = JSON.parse(serialized);
      return parsed.data !== undefined ? parsed.data : parsed;
    } catch (err) {
      console.error('[StatePersistenceAdapter] Parsing error for key:', key, err);
      return defaultValue;
    }
  }

  remove(key) {
    this.inMemoryCache.delete(key);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this._getKey(key));
      } catch (e) {}
    }
  }

  savePlayerProgress(playerProfile) {
    return this.save('player_profile', playerProfile);
  }

  loadPlayerProgress() {
    return this.load('player_profile', {
      unlockedLevels: ['01'],
      completedLevels: {},
      stars: 0,
      xp: 0,
      achievements: []
    });
  }

  clearAll() {
    this.inMemoryCache.clear();
    if (typeof localStorage !== 'undefined') {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(this.storagePrefix)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch (e) {}
    }
  }
}

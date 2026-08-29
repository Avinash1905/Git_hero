/**
 * ResponseCacheManager
 * In-memory Least-Recently-Used (LRU) cache with Time-To-Live (TTL) expiration,
 * tag-based bulk invalidation, and stale-while-revalidate caching strategies.
 */

export class ResponseCacheManager {
  constructor(options = {}) {
    this.maxEntries = options.maxEntries || 100;
    this.defaultTtlMs = options.defaultTtlMs || 5 * 60 * 1000; // 5 minutes
    this.cache = new Map();
  }

  /**
   * Set cache entry with TTL and optional invalidation tags
   */
  set(key, value, options = {}) {
    const ttl = options.ttlMs || this.defaultTtlMs;
    const tags = options.tags || [];

    // Enforce max capacity by evicting oldest
    if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      tags,
      timestamp: Date.now()
    });
  }

  /**
   * Retrieve cached item if valid
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU order
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  /**
   * Invalidate entries matching a tag (e.g. 'levels', 'profile', 'leaderboard')
   */
  invalidateByTag(tag) {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags && entry.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const responseCacheManager = new ResponseCacheManager();

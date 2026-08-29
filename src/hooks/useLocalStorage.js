/**
 * useLocalStorage
 * Typed, resilient LocalStorage access utility with fallback in-memory dictionary.
 */

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
  clear() {
    this.map.clear();
  }
}

const memoryFallback = new MemoryStorage();

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch {
      return memoryFallback;
    }
  }
  return memoryFallback;
}

export const safeStorage = {
  get(key, defaultValue = null) {
    try {
      const val = getStorage().getItem(key);
      if (val === null) return defaultValue;
      return JSON.parse(val);
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      getStorage().setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[safeStorage] Failed setting key "${key}":`, e);
      return false;
    }
  },

  remove(key) {
    try {
      getStorage().removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

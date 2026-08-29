/**
 * GitQuest Game Engine - Reflog Timeline Engine
 * Maintains circular history buffer of HEAD ref transitions, branch checkouts,
 * commit creations, cherry-picks, and provides time-travel rewind mechanics.
 */

import { EngineUtils } from '../core/Utils.js';

export class ReflogEntry {
  constructor(index, oldHash, newHash, action, message, timestamp = Date.now()) {
    this.index = index;
    this.selector = `HEAD@{${index}}`;
    this.oldHash = oldHash;
    this.newHash = newHash;
    this.action = action; // 'commit', 'checkout', 'reset', 'rebase', 'merge', 'cherry-pick'
    this.message = message;
    this.timestamp = timestamp;
  }

  toString() {
    return `${this.newHash.substring(0, 7)} ${this.selector}: ${this.action}: ${this.message}`;
  }
}

export class ReflogTimelineEngine {
  constructor(maxEntries = 100) {
    this.entries = [];
    this.maxEntries = maxEntries;
    this.currentHeadHash = '0000000000000000000000000000000000000000';
  }

  recordTransition(action, message, targetHash = null) {
    const newHash = targetHash || EngineUtils.generateGitHash(message + Date.now());
    const oldHash = this.currentHeadHash;
    this.currentHeadHash = newHash;

    const entry = new ReflogEntry(
      this.entries.length,
      oldHash,
      newHash,
      action,
      message,
      Date.now()
    );

    this.entries.unshift(entry); // Newest at index 0

    // Re-index selectors
    this.entries.forEach((e, idx) => {
      e.index = idx;
      e.selector = `HEAD@{${idx}}`;
    });

    if (this.entries.length > this.maxEntries) {
      this.entries.pop();
    }

    return entry;
  }

  getBySelector(selector) {
    const match = selector.match(/HEAD@\{(\d+)\}/);
    if (!match) return null;
    const idx = parseInt(match[1], 10);
    return this.entries[idx] || null;
  }

  getByHash(hash) {
    const clean = hash.trim().toLowerCase();
    return this.entries.find(e => e.newHash.toLowerCase().startsWith(clean)) || null;
  }

  getRecent(limit = 10) {
    return this.entries.slice(0, limit);
  }

  formatReflogOutput(limit = 10) {
    return this.getRecent(limit).map(e => e.toString()).join('\n');
  }

  clear() {
    this.entries = [];
    this.currentHeadHash = '0000000000000000000000000000000000000000';
  }
}

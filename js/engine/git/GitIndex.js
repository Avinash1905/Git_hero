/**
 * GitQuest Engine - Git Index & Myers Diff Algorithm
 * Staging area management, stage slots (0: Normal, 1: Base, 2: Ours, 3: Theirs), and line diff computation.
 */

import { EngineUtils } from '../core/Utils.js';

export class GitIndexEntry {
  constructor(path, blobHash, stage = 0, mode = '100644') {
    this.path = path;
    this.blobHash = blobHash;
    this.stage = stage; // 0 = normal staged, 1 = ancestor, 2 = HEAD, 3 = merge target
    this.mode = mode;
    this.mtime = Date.now();
  }
}

export class GitIndex {
  constructor() {
    this.entries = new Map(); // "path:stage" -> GitIndexEntry
  }

  _key(path, stage = 0) {
    return `${path}:${stage}`;
  }

  add(path, blobHash, stage = 0, mode = '100644') {
    const entry = new GitIndexEntry(path, blobHash, stage, mode);
    this.entries.set(this._key(path, stage), entry);
    return entry;
  }

  remove(path, stage = 0) {
    return this.entries.delete(this._key(path, stage));
  }

  get(path, stage = 0) {
    return this.entries.get(this._key(path, stage)) || null;
  }

  hasConflicts() {
    for (const entry of this.entries.values()) {
      if (entry.stage > 0) return true;
    }
    return false;
  }

  getConflicts() {
    const conflicts = new Map(); // path -> { base, ours, theirs }
    for (const entry of this.entries.values()) {
      if (entry.stage > 0) {
        if (!conflicts.has(entry.path)) {
          conflicts.set(entry.path, {});
        }
        const obj = conflicts.get(entry.path);
        if (entry.stage === 1) obj.base = entry;
        if (entry.stage === 2) obj.ours = entry;
        if (entry.stage === 3) obj.theirs = entry;
      }
    }
    return conflicts;
  }

  clear() {
    this.entries.clear();
  }

  getAll() {
    return Array.from(this.entries.values());
  }
}

export class GitDiffEngine {
  /**
   * Myers Diff Algorithm: Finds the shortest edit script (SES) between two line arrays
   */
  static diffLines(textA, textB) {
    const a = (textA || '').split('\n');
    const b = (textB || '').split('\n');
    const n = a.length;
    const m = b.length;
    const max = n + m;

    const v = new Map();
    v.set(1, 0);
    const trace = [];

    for (let d = 0; d <= max; d++) {
      const vCopy = new Map(v);
      trace.push(vCopy);

      for (let k = -d; k <= d; k += 2) {
        let x;
        if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
          x = v.get(k + 1) ?? 0;
        } else {
          x = (v.get(k - 1) ?? 0) + 1;
        }

        let y = x - k;

        while (x < n && y < m && a[x] === b[y]) {
          x++;
          y++;
        }

        v.set(k, x);

        if (x >= n && y >= m) {
          return GitDiffEngine._backtrack(trace, a, b, n, m);
        }
      }
    }

    return [];
  }

  static _backtrack(trace, a, b, n, m) {
    const edits = [];
    let x = n;
    let y = m;

    for (let d = trace.length - 1; d >= 0; d--) {
      const v = trace[d];
      const k = x - y;

      let prevK;
      if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }

      const prevX = v.get(prevK) ?? 0;
      const prevY = prevX - prevK;

      while (x > prevX && y > prevY) {
        x--;
        y--;
        edits.unshift({ type: 'equal', line: a[x], lineA: x + 1, lineB: y + 1 });
      }

      if (d > 0) {
        if (x === prevX) {
          y--;
          edits.unshift({ type: 'insert', line: b[y], lineB: y + 1 });
        } else if (y === prevY) {
          x--;
          edits.unshift({ type: 'delete', line: a[x], lineA: x + 1 });
        }
      }
    }

    return edits;
  }

  /**
   * Generates formatted unified diff string
   */
  static formatUnifiedDiff(filename, textA, textB) {
    const edits = GitDiffEngine.diffLines(textA, textB);
    const header = `diff --git a/${filename} b/${filename}\n--- a/${filename}\n+++ b/${filename}\n@@ -1,${textA.split('\n').length} +1,${textB.split('\n').length} @@`;

    const body = edits.map(e => {
      if (e.type === 'insert') return `+${e.line}`;
      if (e.type === 'delete') return `-${e.line}`;
      return ` ${e.line}`;
    }).join('\n');

    return `${header}\n${body}`;
  }

  /**
   * Generates 3-way conflict markers
   */
  static generateConflictFile(oursContent, theirsContent, baseContent = '') {
    return `<<<<<<< HEAD\n${oursContent}\n=======\n${theirsContent}\n>>>>>>> branch`;
  }
}

/**
 * GitQuest Game Engine - Patch Formatter Engine
 * Unified Myers diff computation, hunk formatting, patch generation,
 * 3-way merge conflict hunk formatting, and patch dry-run application.
 */

export class PatchHunk {
  constructor(oldStart, oldLines, newStart, newLines, lines = []) {
    this.oldStart = oldStart;
    this.oldLines = oldLines;
    this.newStart = newStart;
    this.newLines = newLines;
    this.lines = lines; // e.g. ['+added', '-removed', ' unchanged']
  }

  toString() {
    const header = `@@ -${this.oldStart},${this.oldLines} +${this.newStart},${this.newLines} @@`;
    return [header, ...this.lines].join('\n');
  }
}

export class PatchFormatterEngine {
  constructor() {
    this.hunks = [];
  }

  computeUnifiedDiff(originalContent, modifiedContent, filename = 'payload.js') {
    const origLines = (originalContent || '').split('\n');
    const modLines = (modifiedContent || '').split('\n');

    const diffLines = [];
    let added = 0;
    let deleted = 0;

    const maxLen = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLen; i++) {
      const o = origLines[i];
      const m = modLines[i];

      if (o === undefined) {
        diffLines.push(`+${m}`);
        added++;
      } else if (m === undefined) {
        diffLines.push(`-${o}`);
        deleted++;
      } else if (o !== m) {
        diffLines.push(`-${o}`);
        diffLines.push(`+${m}`);
        deleted++;
        added++;
      } else {
        diffLines.push(` ${o}`);
      }
    }

    const hunk = new PatchHunk(1, origLines.length, 1, modLines.length, diffLines);
    const header = [
      `diff --git a/${filename} b/${filename}`,
      `index ${this._pseudoHash(originalContent)}..${this._pseudoHash(modifiedContent)} 100644`,
      `--- a/${filename}`,
      `+++ b/${filename}`,
      hunk.toString()
    ].join('\n');

    return {
      diffText: header,
      added,
      deleted,
      filesChanged: 1
    };
  }

  format3WayConflict(base, current, incoming, filename = 'main.js') {
    return [
      `CONFLICT (content): Merge conflict in ${filename}`,
      `<<<<<<< HEAD (Current Branch)`,
      current,
      `||||||| BASE (Shared Ancestor)`,
      base,
      `=======`,
      incoming,
      `>>>>>>> incoming-feature-branch`
    ].join('\n');
  }

  applyPatch(originalContent, patchDiffText) {
    // Simple line replacement patch application
    const lines = patchDiffText.split('\n');
    const newContentLines = [];

    for (const l of lines) {
      if (l.startsWith('+') && !l.startsWith('+++')) {
        newContentLines.push(l.substring(1));
      } else if (l.startsWith(' ') || (!l.startsWith('-') && !l.startsWith('@') && !l.startsWith('diff') && !l.startsWith('index') && !l.startsWith('---'))) {
        if (l.startsWith(' ')) {
          newContentLines.push(l.substring(1));
        }
      }
    }

    return newContentLines.join('\n');
  }

  _pseudoHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(7, '0').substring(0, 7);
  }
}

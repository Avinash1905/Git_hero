/**
 * GitQuest Game Engine - Git Interactive Patch Splitter
 * Splits large unified diff hunks into smaller sub-hunks (`git add -p [s]`),
 * recalculates hunk line count offsets, and reconstructs patch streams.
 */

export class SubHunk {
  constructor(startLineOld, countOld, startLineNew, countNew, lines = []) {
    this.startLineOld = startLineOld;
    this.countOld = countOld;
    this.startLineNew = startLineNew;
    this.countNew = countNew;
    this.lines = lines;
  }

  toPatchString() {
    const header = `@@ -${this.startLineOld},${this.countOld} +${this.startLineNew},${this.countNew} @@`;
    return [header, ...this.lines].join('\n');
  }
}

export class GitInteractivePatchSplitter {
  splitHunk(hunkText) {
    const rawLines = hunkText.split('\n');
    const headerLine = rawLines.find(l => l.startsWith('@@'));
    const contentLines = rawLines.filter(l => !l.startsWith('@@'));

    if (contentLines.length <= 2) {
      return { canSplit: false, subHunks: [hunkText] };
    }

    // Split on context lines (' ')
    const subHunks = [];
    let currentLines = [];
    let oldLineOffset = 1;
    let newLineOffset = 1;

    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i];
      currentLines.push(line);

      // Split if we hit a context line after some changes
      const hasChanges = currentLines.some(l => l.startsWith('+') || l.startsWith('-'));
      if (hasChanges && line.startsWith(' ') && currentLines.length >= 3) {
        const sub = this._createSubHunk(currentLines, oldLineOffset, newLineOffset);
        subHunks.push(sub.toPatchString());
        oldLineOffset += sub.countOld;
        newLineOffset += sub.countNew;
        currentLines = [];
      }
    }

    if (currentLines.length > 0) {
      const sub = this._createSubHunk(currentLines, oldLineOffset, newLineOffset);
      subHunks.push(sub.toPatchString());
    }

    return {
      canSplit: subHunks.length > 1,
      subHunks
    };
  }

  _createSubHunk(lines, startOld, startNew) {
    let oldCount = 0;
    let newCount = 0;

    for (const l of lines) {
      if (l.startsWith('+')) newCount++;
      else if (l.startsWith('-')) oldCount++;
      else {
        oldCount++;
        newCount++;
      }
    }

    return new SubHunk(startOld, oldCount, startNew, newCount, lines);
  }
}

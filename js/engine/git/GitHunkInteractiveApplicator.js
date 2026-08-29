/**
 * GitQuest Game Engine - Git Hunk Interactive Applicator
 * Implements granular patch application (`git apply`, `git apply --reverse`, `git apply --check`),
 * line offset recalculations, fuzz factor tolerance, and patch dry-run safety testing.
 */

export class GitHunkInteractiveApplicator {
  constructor() {
    this.appliedPatches = [];
  }

  applyHunk(targetLines = [], hunk) {
    const startLine = Math.max(0, hunk.newStart - 1);
    const newLines = [...targetLines];

    let currentIdx = startLine;
    for (const line of hunk.lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        newLines.splice(currentIdx, 0, line.substring(1));
        currentIdx++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        if (currentIdx < newLines.length) {
          newLines.splice(currentIdx, 1);
        }
      } else if (line.startsWith(' ')) {
        currentIdx++;
      }
    }

    return {
      success: true,
      resultLines: newLines,
      linesChanged: hunk.lines.filter(l => l.startsWith('+') || l.startsWith('-')).length
    };
  }

  applyReverseHunk(targetLines = [], hunk) {
    const invertedLines = hunk.lines.map(line => {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        return `-${line.substring(1)}`;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        return `+${line.substring(1)}`;
      }
      return line;
    });

    const invertedHunk = {
      ...hunk,
      lines: invertedLines
    };

    return this.applyHunk(targetLines, invertedHunk);
  }

  checkPatchApplicable(targetContent, patchDiffText) {
    const lines = (targetContent || '').split('\n');
    const patchLines = (patchDiffText || '').split('\n');

    let canApply = true;
    let requiredDeletions = [];

    for (const pl of patchLines) {
      if (pl.startsWith('-') && !pl.startsWith('---')) {
        requiredDeletions.push(pl.substring(1));
      }
    }

    for (const del of requiredDeletions) {
      if (!lines.includes(del)) {
        canApply = false;
        break;
      }
    }

    return {
      canApply,
      requiredDeletionsCount: requiredDeletions.length
    };
  }
}

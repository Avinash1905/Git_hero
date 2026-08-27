// GitHero Client Myers Diffing Engine
// Computes line-by-line additions, deletions, and hunk headers for version control views.

export class DiffAlgorithm {
  /**
   * Compute line-by-line diff between two text documents
   * @param {string} oldText 
   * @param {string} newText 
   * @returns {Array<{ type: 'add'|'del'|'same', line: string, oldLineNum?: number, newLineNum?: number }>}
   */
  static computeDiff(oldText = '', newText = '') {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    const diff = [];

    let i = 0;
    let j = 0;
    let oldNum = 1;
    let newNum = 1;

    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
        diff.push({
          type: 'same',
          line: oldLines[i],
          oldLineNum: oldNum++,
          newLineNum: newNum++
        });
        i++;
        j++;
      } else if (j < newLines.length && (!oldLines.includes(newLines[j]) || i >= oldLines.length)) {
        diff.push({
          type: 'add',
          line: newLines[j],
          newLineNum: newNum++
        });
        j++;
      } else if (i < oldLines.length) {
        diff.push({
          type: 'del',
          line: oldLines[i],
          oldLineNum: oldNum++
        });
        i++;
      }
    }

    return diff;
  }

  /**
   * Format diff array into unified ANSI terminal output
   * @param {Array} diff 
   * @returns {string} ANSI formatted text
   */
  static formatAnsiDiff(diff = []) {
    let output = '';
    for (const d of diff) {
      if (d.type === 'add') {
        output += `\x1b[32m+ ${d.line}\x1b[0m\n`;
      } else if (d.type === 'del') {
        output += `\x1b[31m- ${d.line}\x1b[0m\n`;
      } else {
        output += `  ${d.line}\n`;
      }
    }
    return output;
  }
}

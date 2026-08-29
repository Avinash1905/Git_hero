/**
 * TerminalGraphRenderer
 * Generates ASCII and Unicode DAG graph representations matching `git log --graph --all`.
 */

export class TerminalGraphRenderer {
  /**
   * Render textual Git graph from commit records
   * @param {Array<{hash: string, message: string, branch: string, isHead: boolean, parents: string[]}>} commits
   * @returns {string}
   */
  static renderAsciiGraph(commits = []) {
    if (!commits || commits.length === 0) {
      return '(empty history)';
    }

    const lines = [];

    for (let i = 0; i < commits.length; i++) {
      const c = commits[i];
      const star = c.isHead ? '●' : '○';
      const branchTag = c.isHead ? `\x1b[33m(HEAD -> ${c.branch})\x1b[0m` : `\x1b[36m(${c.branch})\x1b[0m`;
      const hashShort = c.hash.substring(0, 7);

      lines.push(`${star}  \x1b[32m${hashShort}\x1b[0m - ${branchTag} ${c.message}`);
      if (i < commits.length - 1) {
        lines.push('│');
      }
    }

    return lines.join('\n');
  }

  /**
   * Render HTML version with styling tokens for the terminal output body
   * @param {Array<Object>} commits
   * @returns {string}
   */
  static renderHtmlGraph(commits = []) {
    if (!commits || commits.length === 0) {
      return '<div class="text-on-surface-variant text-xs">No commits on branch</div>';
    }

    return commits.map((c, i) => {
      const isHead = c.isHead;
      const dotClass = isHead ? 'text-tertiary font-bold animate-pulse' : 'text-primary';
      const isLast = i === commits.length - 1;

      return `
        <div class="flex items-start gap-2 font-terminal-code text-xs leading-relaxed">
          <div class="flex flex-col items-center select-none w-4">
            <span class="${dotClass}">●</span>
            ${!isLast ? `<span class="w-0.5 h-4 bg-outline-variant/30 my-0.5"></span>` : ''}
          </div>
          <div class="flex-1">
            <span class="text-primary font-bold mr-1.5">${c.hash.substring(0, 7)}</span>
            <span class="text-xs px-1.5 py-0.2 rounded ${isHead ? 'bg-tertiary/20 text-tertiary' : 'bg-secondary/20 text-secondary'} font-semibold mr-1.5">
              ${isHead ? `HEAD -> ${c.branch}` : c.branch}
            </span>
            <span class="text-on-surface">${c.message}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

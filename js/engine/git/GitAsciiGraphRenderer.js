/**
 * GitQuest Game Engine - Git ASCII Graph Log Renderer
 * Renders terminal-style branch DAG graphs (`git log --graph --oneline --decorate --all`)
 * using Unicode and ASCII box-drawing characters (* | / \).
 */

export class GitAsciiGraphRenderer {
  renderAsciiGraph(commits = [], activeHeadHash = 'e4a1b02') {
    const lines = [];

    commits.forEach((c, idx) => {
      const isHead = c.hash.startsWith(activeHeadHash);
      const headDeco = isHead ? ' (HEAD -> main, origin/main)' : '';
      const symbol = isHead ? '*' : '*';

      if (c.parents && c.parents.length > 1) {
        // Merge commit node
        lines.push(`${symbol}\\  ${c.hash.substring(0, 7)}${headDeco} ${c.subject}`);
        lines.push('| \\');
      } else if (idx === 1) {
        // Feature branch join
        lines.push(`| ${symbol} ${c.hash.substring(0, 7)} [feature] ${c.subject}`);
        lines.push('|/');
      } else {
        // Normal linear commit
        lines.push(`${symbol} ${c.hash.substring(0, 7)}${headDeco} ${c.subject}`);
        if (idx < commits.length - 1) {
          lines.push('|');
        }
      }
    });

    return lines.join('\n');
  }
}

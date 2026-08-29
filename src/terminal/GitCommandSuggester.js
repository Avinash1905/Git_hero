// GitHero Git Command Suggester & Fuzzy Matcher
// Provides "Did you mean?" suggestions and contextual command help.

export class GitCommandSuggester {
  static KNOWN_COMMANDS = [
    'git status',
    'git push',
    'git pull',
    'git pull left',
    'git pull right',
    'git pull up',
    'git pull down',
    'git commit',
    'git commit -m "solution"',
    'git switch',
    'git branch',
    'git checkout',
    'git log',
    'git diff',
    'git merge',
    'git rebase',
    'git stash',
    'git stash pop',
    'git cherry-pick',
    'git bisect',
    'git reset --hard',
    'git up',
    'git down',
    'git left',
    'git right',
    'clear',
    'help',
    'reset'
  ];

  /**
   * Calculate Levenshtein distance between two strings
   * @param {string} a 
   * @param {string} b 
   * @returns {number}
   */
  static levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Find closest command suggestions for unrecognized input
   * @param {string} input 
   * @param {number} maxDistance 
   * @returns {Array<{ command: string, distance: number }>}
   */
  static getSuggestions(input = '', maxDistance = 3) {
    const cleanInput = input.trim().toLowerCase();
    if (!cleanInput) return [];

    const matches = [];
    for (const cmd of this.KNOWN_COMMANDS) {
      if (cmd === cleanInput) continue;
      const distance = this.levenshteinDistance(cleanInput, cmd);
      if (distance <= maxDistance) {
        matches.push({ command: cmd, distance });
      }
    }

    return matches.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Format suggestion message for terminal display
   * @param {string} input 
   * @returns {string|null}
   */
  static formatSuggestionMessage(input) {
    const suggestions = this.getSuggestions(input);
    if (suggestions.length === 0) return null;

    const top = suggestions.slice(0, 3).map(s => `\x1b[36m${s.command}\x1b[0m`).join(', ');
    return `githero: command not found: "${input}". Did you mean: ${top}?`;
  }
}

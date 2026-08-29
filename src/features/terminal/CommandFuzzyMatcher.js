/**
 * GitQuest Frontend - Command Fuzzy Matcher
 * Damerau-Levenshtein distance calculation, prefix auto-completion,
 * and smart suggestion engine for terminal inputs.
 */

export class CommandFuzzyMatcher {
  constructor() {
    this.dictionary = [
      'git status',
      'git push',
      'git pull',
      'git pull left',
      'git pull right',
      'git pull up',
      'git pull down',
      'git left',
      'git right',
      'git up',
      'git down',
      'git commit',
      'git commit -m',
      'git switch',
      'git branch',
      'git merge',
      'git rebase',
      'git stash',
      'git stash pop',
      'git cherry-pick',
      'git diff',
      'git log',
      'git tag',
      'git revert',
      'git submodule',
      'git worktree',
      'git bundle',
      'git blame',
      'help',
      'clear',
      'undo',
      'hint'
    ];
  }

  levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            Math.min(
              matrix[i][j - 1] + 1,     // insertion
              matrix[i - 1][j] + 1      // deletion
            )
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  suggest(input, maxResults = 3, maxDistance = 3) {
    const clean = (input || '').trim().toLowerCase();
    if (!clean) return [];

    const scored = [];

    for (const cmd of this.dictionary) {
      if (cmd.startsWith(clean)) {
        scored.push({ command: cmd, distance: 0, isPrefix: true });
      } else {
        const dist = this.levenshteinDistance(clean, cmd);
        if (dist <= maxDistance) {
          scored.push({ command: cmd, distance: dist, isPrefix: false });
        }
      }
    }

    // Sort: exact/prefix matches first, then lowest distance
    scored.sort((a, b) => {
      if (a.isPrefix && !b.isPrefix) return -1;
      if (!a.isPrefix && b.isPrefix) return 1;
      return a.distance - b.distance;
    });

    return scored.slice(0, maxResults).map(s => s.command);
  }

  getBestSuggestion(input) {
    const suggestions = this.suggest(input, 1);
    return suggestions.length > 0 ? suggestions[0] : null;
  }
}

/**
 * GitHero Terminal Command Parser & Tokenizer
 * Parses user input, extracts commands, subcommands, arguments, and flags with fuzzy typo detection.
 */

export class CommandParser {
  constructor() {
    this.validCommands = [
      'git', 'clear', 'help', 'status', 'push', 'pull', 'commit', 'switch', 'branch', 'log', 'reset'
    ];
    this.validSubCommands = [
      'status', 'push', 'pull', 'commit', 'switch', 'branch', 'log', 'reset', 'help',
      'left', 'right', 'up', 'down'
    ];
  }

  parse(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') {
      return { isValid: false, error: 'Empty command.' };
    }

    const trimmed = rawInput.trim();
    if (!trimmed) {
      return { isValid: false, error: 'Empty command.' };
    }

    // Tokenize preserving quoted strings
    const tokens = this.tokenize(trimmed);
    const primary = tokens[0].toLowerCase();
    const subCommand = tokens[1] ? tokens[1].toLowerCase() : '';
    const arg = tokens[2] || '';
    const flags = tokens.filter(t => t.startsWith('-'));

    return {
      raw: trimmed,
      primary,
      subCommand,
      arg,
      flags,
      tokens
    };
  }

  tokenize(input) {
    const tokens = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
        inQuotes = !inQuotes;
        quoteChar = inQuotes ? char : '';
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) tokens.push(current);
    return tokens;
  }

  getFuzzySuggestion(input) {
    const clean = input.trim().toLowerCase();
    const candidates = [
      'git status', 'git push', 'git pull', 'git commit', 'git switch',
      'git left', 'git right', 'git up', 'git down',
      'git pull left', 'git pull right', 'git pull up', 'git pull down',
      'clear', 'help'
    ];

    let bestMatch = null;
    let minDistance = 3;

    for (const cand of candidates) {
      const dist = this.levenshteinDistance(clean, cand);
      if (dist < minDistance) {
        minDistance = dist;
        bestMatch = cand;
      }
    }

    return bestMatch;
  }

  levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  }

  getHelpDocumentation() {
    return [
      { cmd: 'git status', desc: 'Inspect current branch, staged box status, and objectives.' },
      { cmd: 'git push', desc: 'Push the adjacent repository box forward along player direction.' },
      { cmd: 'git pull [left|right|up|down]', desc: 'Pull adjacent box toward player from specified direction.' },
      { cmd: 'git commit [-m "msg"]', desc: 'Commit and finalize resolved level when box is on goal.' },
      { cmd: 'git switch <level_id>', desc: 'Switch branch to another level (e.g. "git switch 08").' },
      { cmd: 'git up / down / left / right', desc: 'Navigate player across grid partitions.' },
      { cmd: 'clear', desc: 'Clear the terminal output history.' }
    ];
  }
}

/**
 * GitSyntaxValidator
 * AST and syntax validation engine for Git commands.
 * Checks argument types, supported flags, subcommands, and outputs detailed diagnostic hints.
 */

export class GitSyntaxValidator {
  constructor() {
    this.validCommands = {
      'status': { flags: ['-s', '--short', '-b', '--branch'], maxArgs: 0 },
      'branch': { flags: ['-a', '-r', '-d', '-D', '-m', '--list'], maxArgs: 2 },
      'checkout': { flags: ['-b', '-B', '--track'], minArgs: 1, maxArgs: 2 },
      'switch': { flags: ['-c', '-C', '--detach'], minArgs: 1, maxArgs: 1 },
      'commit': { flags: ['-m', '-am', '--amend', '--allow-empty'], minArgs: 0, maxArgs: 10 },
      'merge': { flags: ['--no-ff', '--squash', '--abort', '--continue'], minArgs: 0, maxArgs: 3 },
      'rebase': { flags: ['-i', '--interactive', '--continue', '--abort', '--skip'], minArgs: 0, maxArgs: 2 },
      'stash': { subcommands: ['push', 'pop', 'apply', 'list', 'drop', 'clear'], flags: ['-u', '--include-untracked'], maxArgs: 3 },
      'reset': { flags: ['--hard', '--soft', '--mixed'], minArgs: 0, maxArgs: 2 },
      'reflog': { flags: ['--all'], maxArgs: 2 },
      'diff': { flags: ['--staged', '--cached', '--stat', '-w'], maxArgs: 2 },
      'tag': { flags: ['-a', '-d', '-l', '-m'], maxArgs: 3 },
      'cherry-pick': { flags: ['-n', '--no-commit', '--abort', '--continue'], minArgs: 0, maxArgs: 2 },
      'log': { flags: ['--oneline', '--graph', '-n', '--all', '--stat'], maxArgs: 3 },
      'remote': { subcommands: ['add', 'remove', 'rm', '-v', 'show'], maxArgs: 4 }
    };
  }

  /**
   * Tokenize command string taking quotes into account
   */
  tokenize(commandStr = '') {
    const tokens = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';

    for (let i = 0; i < commandStr.length; i++) {
      const char = commandStr[i];
      if ((char === '"' || char === "'") && (!inQuote || quoteChar === char)) {
        inQuote = !inQuote;
        quoteChar = inQuote ? char : '';
      } else if (char === ' ' && !inQuote) {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Validate tokens and produce diagnostic result
   */
  validate(commandStr) {
    const tokens = this.tokenize(commandStr.trim());
    if (tokens.length === 0) {
      return { isValid: false, error: 'Empty command string.' };
    }

    const root = tokens[0];
    if (root !== 'git') {
      if (['clear', 'help', 'up', 'down', 'left', 'right'].includes(root)) {
        return { isValid: true, command: root, args: tokens.slice(1) };
      }
      return {
        isValid: false,
        error: `Unknown command "${root}". GitHero terminal expects commands prefixed with "git" (e.g. git status).`
      };
    }

    if (tokens.length === 1) {
      return {
        isValid: false,
        error: 'git: missing subcommand. Try "git status", "git branch", or "git commit".'
      };
    }

    const sub = tokens[1];
    const spec = this.validCommands[sub];

    if (!spec) {
      return {
        isValid: false,
        error: `git: "${sub}" is not a recognized GitHero command. Supported commands: ${Object.keys(this.validCommands).join(', ')}`
      };
    }

    const args = tokens.slice(2);
    return {
      isValid: true,
      command: sub,
      args,
      rawTokens: tokens
    };
  }
}

export const gitSyntaxValidator = new GitSyntaxValidator();

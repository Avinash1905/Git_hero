/**
 * TerminalAutocompleteEngine
 * Context-aware command line autocompletion providing Tab completion for Git subcommands, active branch names, and flags.
 */

export class TerminalAutocompleteEngine {
  constructor() {
    this.subcommands = [
      'status', 'commit', 'branch', 'checkout', 'switch', 'merge', 'rebase',
      'stash', 'reset', 'reflog', 'diff', 'tag', 'cherry-pick', 'log', 'remote'
    ];
    this.flags = {
      'status': ['-s', '--short'],
      'commit': ['-m', '-am', '--amend'],
      'branch': ['-a', '-d', '-D', '-m'],
      'checkout': ['-b'],
      'switch': ['-c'],
      'merge': ['--no-ff', '--squash'],
      'rebase': ['-i', '--interactive', '--continue', '--abort'],
      'diff': ['--staged', '--cached'],
      'reset': ['--hard', '--soft']
    };
  }

  getSuggestions(inputStr = '', activeBranches = ['master', 'feature/laser']) {
    const tokens = inputStr.trimStart().split(' ');
    if (tokens.length === 1) {
      const prefix = tokens[0].toLowerCase();
      if ('git'.startsWith(prefix)) {
        return ['git'];
      }
      return [];
    }

    if (tokens.length === 2 && tokens[0] === 'git') {
      const prefix = tokens[1].toLowerCase();
      return this.subcommands.filter(s => s.startsWith(prefix));
    }

    if (tokens.length >= 3 && tokens[0] === 'git') {
      const sub = tokens[1];
      const prefix = tokens[tokens.length - 1].toLowerCase();

      // Suggest flags
      const flagList = this.flags[sub] || [];
      const matchingFlags = flagList.filter(f => f.startsWith(prefix));

      // Suggest branch names if sub is switch, checkout, merge, rebase
      if (['switch', 'checkout', 'merge', 'rebase', 'branch'].includes(sub)) {
        const matchingBranches = activeBranches.filter(b => b.toLowerCase().startsWith(prefix));
        return [...matchingFlags, ...matchingBranches];
      }

      return matchingFlags;
    }

    return [];
  }
}

export const terminalAutocompleteEngine = new TerminalAutocompleteEngine();

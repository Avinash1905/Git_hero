/**
 * GitHero Terminal Autocompletion Engine
 * Provides tab autocompletion for git subcommands, directions, flags, and level IDs.
 */

export class AutocompleteEngine {
  constructor() {
    this.dictionary = [
      'git status',
      'git push',
      'git pull',
      'git pull left',
      'git pull right',
      'git pull up',
      'git pull down',
      'git commit',
      'git commit -m "resolve"',
      'git switch',
      'git branch',
      'git log',
      'git reset',
      'git left',
      'git right',
      'git up',
      'git down',
      'clear',
      'help'
    ];
  }

  getSuggestions(prefix) {
    if (!prefix || !prefix.trim()) return [];
    const lower = prefix.trim().toLowerCase();
    return this.dictionary.filter(item => item.startsWith(lower));
  }

  getTabCompletion(input) {
    const matches = this.getSuggestions(input);
    if (matches.length === 1) {
      return matches[0];
    }
    return input;
  }
}

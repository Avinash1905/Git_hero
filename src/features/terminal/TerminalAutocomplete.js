/**
 * TerminalAutocomplete
 * Provides intelligent Tab auto-completion for git verbs, subcommands, and directional interactions.
 */

export class TerminalAutocomplete {
  static commands = [
    'git status',
    'git push',
    'git pull',
    'git pull left',
    'git pull right',
    'git pull up',
    'git pull down',
    'git commit -m "',
    'git switch ',
    'git up',
    'git down',
    'git left',
    'git right',
    'git branch',
    'git merge ',
    'git rebase ',
    'git stash',
    'git diff',
    'git log',
    'clear',
    'help',
    'undo',
    'reset'
  ];

  /**
   * Suggest matches based on current prefix
   * @param {string} input
   * @returns {string[]}
   */
  static getSuggestions(input) {
    const trimmed = String(input || '').trimStart().toLowerCase();
    if (!trimmed) return [];

    return this.commands.filter((cmd) => cmd.toLowerCase().startsWith(trimmed));
  }

  /**
   * Complete input with first match or common prefix
   * @param {string} input
   * @returns {string}
   */
  static complete(input) {
    const matches = this.getSuggestions(input);
    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      // Find longest common prefix
      let prefix = matches[0];
      for (let i = 1; i < matches.length; i++) {
        while (!matches[i].toLowerCase().startsWith(prefix.toLowerCase())) {
          prefix = prefix.slice(0, -1);
          if (!prefix) return input;
        }
      }
      return prefix;
    }
    return input;
  }
}

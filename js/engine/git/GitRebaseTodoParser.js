/**
 * GitQuest Game Engine - Git Rebase Todo Script Parser
 * Parses and validates interactive rebase instruction files (`git-rebase-todo`),
 * supports commands (pick, reword, edit, squash, fixup, drop, exec, break),
 * strips comment blocks, and detects syntax errors.
 */

export class RebaseCommandEntry {
  constructor(lineNumber, command, commitHash, restOfLine = '') {
    this.lineNumber = lineNumber;
    this.command = command; // 'pick', 'reword', 'edit', 'squash', 'fixup', 'drop', 'exec', 'break'
    this.commitHash = commitHash;
    this.restOfLine = restOfLine;
  }
}

export class GitRebaseTodoParser {
  constructor() {
    this.allowedCommands = new Set([
      'p', 'pick',
      'r', 'reword',
      'e', 'edit',
      's', 'squash',
      'f', 'fixup',
      'd', 'drop',
      'x', 'exec',
      'b', 'break'
    ]);
  }

  parse(rawScriptText) {
    const lines = (rawScriptText || '').split('\n');
    const entries = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#')) continue; // Skip comments and blank lines

      const tokens = line.split(/\s+/);
      const cmd = tokens[0].toLowerCase();

      if (!this.allowedCommands.has(cmd)) {
        errors.push(`Line ${i + 1}: Unknown rebase command "${tokens[0]}"`);
        continue;
      }

      if (cmd === 'b' || cmd === 'break') {
        entries.push(new RebaseCommandEntry(i + 1, 'break', null, ''));
        continue;
      }

      if (cmd === 'x' || cmd === 'exec') {
        const shellCmd = tokens.slice(1).join(' ');
        entries.push(new RebaseCommandEntry(i + 1, 'exec', null, shellCmd));
        continue;
      }

      const hash = tokens[1];
      if (!hash) {
        errors.push(`Line ${i + 1}: Missing commit hash for command "${tokens[0]}"`);
        continue;
      }

      const rest = tokens.slice(2).join(' ');
      const normCmd = this._normalizeCommand(cmd);
      entries.push(new RebaseCommandEntry(i + 1, normCmd, hash, rest));
    }

    return {
      isValid: errors.length === 0,
      entries,
      errors,
      totalEntries: entries.length
    };
  }

  _normalizeCommand(cmd) {
    const map = {
      p: 'pick',
      r: 'reword',
      e: 'edit',
      s: 'squash',
      f: 'fixup',
      d: 'drop',
      x: 'exec',
      b: 'break'
    };
    return map[cmd] || cmd;
  }
}

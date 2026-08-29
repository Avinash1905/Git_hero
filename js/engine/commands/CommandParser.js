/**
 * GitQuest Engine - Command Parser
 * Syntactic analysis converting lexical tokens into parsed Command AST structures.
 */

import { CommandLexer, TokenType } from './CommandToken.js';

export class ParsedCommand {
  constructor(keyword = '', subCommand = '') {
    this.raw = '';
    this.keyword = keyword.toLowerCase();
    this.subCommand = subCommand.toLowerCase();
    this.args = [];
    this.flags = new Map(); // flag -> value
    this.isValid = true;
    this.errorMessage = null;
  }

  hasFlag(name) {
    return this.flags.has(name);
  }

  getFlag(name, defaultValue = null) {
    return this.flags.get(name) ?? defaultValue;
  }

  getArg(index = 0, defaultValue = '') {
    return this.args[index] ?? defaultValue;
  }

  toString() {
    return `${this.keyword} ${this.subCommand} ${this.args.join(' ')}`.trim();
  }
}

export class CommandParser {
  static parse(rawInput) {
    const parsed = new ParsedCommand();
    parsed.raw = (rawInput || '').trim();

    if (!parsed.raw) {
      parsed.isValid = false;
      parsed.errorMessage = 'Empty command input.';
      return parsed;
    }

    const tokens = CommandLexer.tokenize(parsed.raw);
    if (tokens.length === 0 || tokens[0].type === TokenType.EOF) {
      parsed.isValid = false;
      parsed.errorMessage = 'No tokens found.';
      return parsed;
    }

    // First token is keyword (e.g. 'git', 'help', 'clear')
    parsed.keyword = tokens[0].value.toLowerCase();

    let i = 1;
    // For 'git' commands, second token is subcommand (e.g. 'status', 'push', 'pull')
    if (parsed.keyword === 'git' && i < tokens.length && tokens[i].type !== TokenType.EOF) {
      parsed.subCommand = tokens[i].value.toLowerCase();
      i++;
    }

    while (i < tokens.length) {
      const token = tokens[i];
      if (token.type === TokenType.EOF) break;

      if (token.type === TokenType.FLAG) {
        const flagName = token.value;
        // Check if next token is value or if it is a boolean flag
        if (i + 1 < tokens.length && (tokens[i + 1].type === TokenType.ARGUMENT || tokens[i + 1].type === TokenType.STRING)) {
          parsed.flags.set(flagName, tokens[i + 1].value);
          i += 2;
        } else {
          parsed.flags.set(flagName, true);
          i++;
        }
      } else if (token.type === TokenType.ARGUMENT || token.type === TokenType.STRING || token.type === TokenType.SUBCOMMAND) {
        parsed.args.push(token.value);
        i++;
      } else {
        i++;
      }
    }

    return parsed;
  }
}

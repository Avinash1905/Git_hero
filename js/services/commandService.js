/**
 * GitHero Command Service
 * Validates, suggests, and provides autocompletion for terminal inputs.
 */

import { CommandParser } from '../terminal/CommandParser.js';
import { AutocompleteEngine } from '../terminal/AutocompleteEngine.js';

export class CommandService {
  constructor() {
    this.parser = new CommandParser();
    this.autocomplete = new AutocompleteEngine();
  }

  parse(rawInput) {
    return this.parser.parse(rawInput);
  }

  suggest(rawInput) {
    return this.autocomplete.getSuggestions(rawInput);
  }

  getHelp() {
    return this.parser.getHelpDocumentation();
  }
}

export const commandService = new CommandService();

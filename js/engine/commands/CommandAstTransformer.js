/**
 * GitQuest Engine - Command AST Transformer & History Buffer
 * Macro preprocessor, alias expansion, command chaining (&&, ;, ||), and autocomplete trie search.
 */

export class CommandAstTransformer {
  constructor() {
    this.aliases = new Map([
      ['st', 'status'],
      ['co', 'checkout'],
      ['br', 'branch'],
      ['ci', 'commit'],
      ['sw', 'switch'],
      ['rb', 'rebase'],
      ['mg', 'merge'],
      ['cp', 'cherry-pick']
    ]);
  }

  registerAlias(alias, expansion) {
    this.aliases.set(alias, expansion);
  }

  transform(rawInput) {
    if (!rawInput) return [];

    // Split on chained command delimiters (&&, ;)
    const segments = rawInput.split(/&&|;/).map(s => s.trim()).filter(Boolean);
    const transformed = [];

    for (const seg of segments) {
      const parts = seg.split(/\s+/);
      if (parts[0].toLowerCase() === 'git' && parts.length > 1) {
        const sub = parts[1].toLowerCase();
        if (this.aliases.has(sub)) {
          parts[1] = this.aliases.get(sub);
        }
      }
      transformed.push(parts.join(' '));
    }

    return transformed;
  }
}

export class AutoCompleteTrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.command = null;
  }
}

export class AutoCompleteTrie {
  constructor(commands = []) {
    this.root = new AutoCompleteTrieNode();
    for (const cmd of commands) {
      this.insert(cmd);
    }
  }

  insert(command) {
    let curr = this.root;
    const lower = command.toLowerCase();
    for (let i = 0; i < lower.length; i++) {
      const ch = lower[i];
      if (!curr.children.has(ch)) {
        curr.children.set(ch, new AutoCompleteTrieNode());
      }
      curr = curr.children.get(ch);
    }
    curr.isEndOfWord = true;
    curr.command = command;
  }

  suggest(prefix) {
    let curr = this.root;
    const lower = (prefix || '').toLowerCase();

    for (let i = 0; i < lower.length; i++) {
      const ch = lower[i];
      if (!curr.children.has(ch)) {
        return [];
      }
      curr = curr.children.get(ch);
    }

    const results = [];
    this._collect(curr, results);
    return results;
  }

  _collect(node, results) {
    if (node.isEndOfWord && node.command) {
      results.push(node.command);
    }
    for (const child of node.children.values()) {
      this._collect(child, results);
    }
  }
}

export class CommandHistoryBuffer {
  constructor(maxSize = 100) {
    this.history = [];
    this.cursor = -1;
    this.maxSize = maxSize;
  }

  push(command) {
    const trimmed = (command || '').trim();
    if (!trimmed) return;
    if (this.history.length === 0 || this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed);
      if (this.history.length > this.maxSize) {
        this.history.shift();
      }
    }
    this.cursor = this.history.length;
  }

  getPrevious() {
    if (this.history.length === 0) return '';
    if (this.cursor > 0) this.cursor--;
    return this.history[this.cursor] || '';
  }

  getNext() {
    if (this.cursor < this.history.length - 1) {
      this.cursor++;
      return this.history[this.cursor] || '';
    }
    this.cursor = this.history.length;
    return '';
  }

  searchRegex(pattern) {
    try {
      const regex = new RegExp(pattern, 'i');
      return this.history.filter(cmd => regex.test(cmd));
    } catch {
      return [];
    }
  }
}

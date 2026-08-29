/**
 * TerminalCommandHistoryBuffer
 * Persistent indexed command history buffer with deduplication and search index.
 */

export class TerminalCommandHistoryBuffer {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.history = [];
    this.cursor = -1;
  }

  push(command) {
    if (!command || !command.trim()) return;
    const clean = command.trim();
    // Don't duplicate consecutive identical commands
    if (this.history.length > 0 && this.history[this.history.length - 1] === clean) {
      this.cursor = this.history.length;
      return;
    }
    this.history.push(clean);
    if (this.history.length > this.maxSize) {
      this.history.shift();
    }
    this.cursor = this.history.length;
  }

  getPrevious() {
    if (this.history.length === 0) return '';
    if (this.cursor > 0) {
      this.cursor--;
    }
    return this.history[this.cursor] || '';
  }

  getNext() {
    if (this.history.length === 0) return '';
    if (this.cursor < this.history.length - 1) {
      this.cursor++;
      return this.history[this.cursor];
    }
    this.cursor = this.history.length;
    return '';
  }

  getAll() {
    return [...this.history];
  }
}

export const terminalCommandHistoryBuffer = new TerminalCommandHistoryBuffer();

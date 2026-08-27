/**
 * GitHero Terminal History Buffer
 * Manages arrow-key navigation (Up/Down) through past entered terminal commands.
 */

export class TerminalHistory {
  constructor(maxSize = 100) {
    this.history = [];
    this.maxSize = maxSize;
    this.cursor = -1;
  }

  push(command) {
    const trimmed = (command || '').trim();
    if (!trimmed) return;

    // Deduplicate consecutive commands
    if (this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed);
      if (this.history.length > this.maxSize) {
        this.history.shift();
      }
    }
    this.cursor = this.history.length;
  }

  getPrevious() {
    if (this.cursor > 0) {
      this.cursor--;
      return this.history[this.cursor];
    } else if (this.cursor === 0) {
      return this.history[0];
    }
    return '';
  }

  getNext() {
    if (this.cursor < this.history.length - 1) {
      this.cursor++;
      return this.history[this.cursor];
    } else {
      this.cursor = this.history.length;
      return '';
    }
  }

  resetCursor() {
    this.cursor = this.history.length;
  }
}

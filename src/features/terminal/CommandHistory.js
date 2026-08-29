/**
 * CommandHistory
 * Manages player terminal command history buffer with Up/Down arrow navigation,
 * uniqueness filtering, and localStorage persistence.
 */

export class CommandHistory {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.history = [];
    this.cursor = -1;
    this.tempInput = '';
    this.storageKey = 'gitquest_terminal_history';
    this.load();
  }

  load() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          this.history = JSON.parse(saved);
        }
      } catch {}
    }
  }

  save() {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.history.slice(-this.maxSize)));
      } catch {}
    }
  }

  /**
   * Add command to history
   * @param {string} cmd
   */
  push(cmd) {
    const trimmed = String(cmd || '').trim();
    if (!trimmed) return;

    // Avoid duplicate adjacent commands
    if (this.history.length === 0 || this.history[this.history.length - 1] !== trimmed) {
      this.history.push(trimmed);
      if (this.history.length > this.maxSize) {
        this.history.shift();
      }
      this.save();
    }
    this.resetCursor();
  }

  resetCursor() {
    this.cursor = this.history.length;
    this.tempInput = '';
  }

  /**
   * Navigate backwards (Up Arrow)
   * @param {string} currentInput - Store current input before navigating away
   * @returns {string}
   */
  getPrevious(currentInput = '') {
    if (this.history.length === 0) return currentInput;

    if (this.cursor === this.history.length) {
      this.tempInput = currentInput;
    }

    if (this.cursor > 0) {
      this.cursor--;
      return this.history[this.cursor];
    }

    return this.history[0];
  }

  /**
   * Navigate forwards (Down Arrow)
   * @returns {string}
   */
  getNext() {
    if (this.cursor < this.history.length - 1) {
      this.cursor++;
      return this.history[this.cursor];
    }

    this.cursor = this.history.length;
    return this.tempInput || '';
  }

  getAll() {
    return [...this.history];
  }

  clear() {
    this.history = [];
    this.resetCursor();
    this.save();
  }
}

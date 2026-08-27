/**
 * TerminalController
 * Coordinates player keyboard inputs, command history navigation, tab autocomplete,
 * execution against the GameEngineAdapter, and DOM log rendering with auto-scroll.
 */

import { CommandHistory } from './CommandHistory.js';
import { TerminalAutocomplete } from './TerminalAutocomplete.js';
import { TerminalFormatter } from './TerminalFormatter.js';

export class TerminalController {
  /**
   * @param {import('../../adapters/GameEngineAdapter.js').GameEngineAdapter} adapter
   * @param {Object} [callbacks]
   */
  constructor(adapter, callbacks = {}) {
    this.adapter = adapter;
    this.callbacks = callbacks;
    this.history = new CommandHistory();
    this.logs = [];
    this.formEl = null;
    this.inputEl = null;
    this.bodyEl = null;
    this.boundSubmit = this.handleSubmit.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Attach listeners to active terminal DOM
   */
  mount() {
    this.formEl = document.getElementById('terminal-input-form');
    this.inputEl = document.getElementById('terminal-cmd-input');
    this.bodyEl = document.getElementById('terminal-output-body');

    if (this.formEl) {
      this.formEl.addEventListener('submit', this.boundSubmit);
    }
    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', this.boundKeyDown);
      // Auto-focus if not on small mobile
      if (window.innerWidth > 768) {
        this.inputEl.focus();
      }
    }

    this.scrollToBottom();
  }

  unmount() {
    if (this.formEl) {
      this.formEl.removeEventListener('submit', this.boundSubmit);
    }
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.boundKeyDown);
    }
  }

  handleSubmit(e) {
    if (e) e.preventDefault();
    if (!this.inputEl) return;

    const raw = this.inputEl.value;
    const trimmed = raw.trim();
    this.inputEl.value = '';

    if (!trimmed) return;

    // Record in history
    this.history.push(trimmed);

    // Render user command prompt line
    this.appendLog({ type: 'cmd', text: trimmed });

    // Handle 'clear' command
    if (trimmed.toLowerCase() === 'clear') {
      this.clearOutput();
      return;
    }

    // Execute via adapter
    if (this.adapter) {
      const execResult = this.adapter.executeCommand(trimmed);
      if (execResult.log) {
        this.appendLog(execResult.log);
      }

      // Check if commit completion occurred
      if (execResult.log?.type === 'commit_success' && typeof this.callbacks.onCommitSuccess === 'function') {
        const state = this.adapter.getFrontendState();
        this.callbacks.onCommitSuccess(state);
      }
    }
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.inputEl.value = this.history.getPrevious(this.inputEl.value);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.inputEl.value = this.history.getNext();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = TerminalAutocomplete.complete(this.inputEl.value);
      this.inputEl.value = completed;
      return;
    }
  }

  appendLog(logEntry) {
    this.logs.push(logEntry);
    if (!this.bodyEl) {
      this.bodyEl = document.getElementById('terminal-output-body');
    }

    if (this.bodyEl) {
      const html = TerminalFormatter.formatLogHtml(logEntry);
      this.bodyEl.insertAdjacentHTML('beforeend', html);
      this.scrollToBottom();
    }
  }

  clearOutput() {
    this.logs = [];
    if (!this.bodyEl) {
      this.bodyEl = document.getElementById('terminal-output-body');
    }
    if (this.bodyEl) {
      this.bodyEl.innerHTML = '';
    }
  }

  scrollToBottom() {
    if (this.bodyEl) {
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight;
    }
  }
}

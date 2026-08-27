/**
 * useKeyboardShortcut
 * Register and manage keyboard shortcuts with modifiers, input field evasion, and cleanup.
 */

export class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map(); // keyCombo -> Set<{ callback, options }>
    this.boundListener = this.handleKeyDown.bind(this);
    this.isListening = false;
  }

  start() {
    if (!this.isListening && typeof window !== 'undefined') {
      window.addEventListener('keydown', this.boundListener);
      this.isListening = true;
    }
  }

  stop() {
    if (this.isListening && typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.boundListener);
      this.isListening = false;
    }
  }

  /**
   * Register a shortcut
   * @param {string} combo - e.g. 'ctrl+z', 'meta+k', 'escape', 'arrowup'
   * @param {Function} callback
   * @param {Object} [options]
   * @returns {Function} Unregister callback
   */
  register(combo, callback, options = {}) {
    const normalizedCombo = combo.toLowerCase().trim();
    if (!this.shortcuts.has(normalizedCombo)) {
      this.shortcuts.set(normalizedCombo, new Set());
    }

    const handlerObj = {
      callback,
      preventInInput: options.preventInInput !== false,
      preventDefault: options.preventDefault !== false
    };

    this.shortcuts.get(normalizedCombo).add(handlerObj);
    this.start();

    return () => {
      const handlers = this.shortcuts.get(normalizedCombo);
      if (handlers) {
        handlers.delete(handlerObj);
        if (handlers.size === 0) {
          this.shortcuts.delete(normalizedCombo);
        }
      }
    };
  }

  handleKeyDown(event) {
    const isInputFocused = document.activeElement && (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.tagName === 'SELECT'
    );

    // Build key combo
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.metaKey) parts.push('meta');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    parts.push(event.key.toLowerCase());

    const combo = parts.join('+');
    const directKey = event.key.toLowerCase();

    const matchedHandlers = [
      ...(this.shortcuts.get(combo) || []),
      ...(this.shortcuts.get(directKey) || [])
    ];

    for (const item of matchedHandlers) {
      if (isInputFocused && item.preventInInput) {
        continue;
      }
      if (item.preventDefault) {
        event.preventDefault();
      }
      item.callback(event);
    }
  }
}

export const keyboardShortcuts = new KeyboardShortcutManager();

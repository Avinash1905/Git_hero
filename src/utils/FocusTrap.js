// GitHero Accessibility Focus Trap Utility
// Ensures keyboard focus remains trapped inside active modal dialogs.

export class FocusTrap {
  static FOCUSABLE_SELECTORS = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]'
  ];

  constructor(element) {
    this.element = element;
    this.previouslyFocusedElement = null;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Activate focus trap
   */
  activate() {
    if (!this.element) return;
    this.previouslyFocusedElement = document.activeElement;

    const focusables = this.getFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    this.element.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Deactivate focus trap and restore previous focus
   */
  deactivate() {
    if (!this.element) return;
    this.element.removeEventListener('keydown', this.handleKeyDown);

    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
    }
  }

  /**
   * Get all focusable elements inside container
   * @returns {NodeList|Array}
   */
  getFocusableElements() {
    if (!this.element) return [];
    return this.element.querySelectorAll(FocusTrap.FOCUSABLE_SELECTORS.join(','));
  }

  /**
   * Handle TAB key navigation
   * @param {KeyboardEvent} e 
   */
  handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    const focusables = Array.from(this.getFocusableElements());
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }
}

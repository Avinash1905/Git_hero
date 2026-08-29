/**
 * TerminalAccessibility
 * Manages screen reader live announcements, keyboard traps, ARIA focus rings,
 * and high-contrast terminal viewing modes.
 */

export class TerminalAccessibility {
  constructor() {
    this.liveRegionId = 'terminal-aria-live-region';
    this.highContrast = false;
    this.fontSize = 13; // px
  }

  /**
   * Ensure aria-live region exists in DOM
   */
  ensureLiveRegion() {
    if (typeof document === 'undefined') return;
    let liveRegion = document.getElementById(this.liveRegionId);
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = this.liveRegionId;
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    return liveRegion;
  }

  /**
   * Announce command output or error to screen reader
   */
  announce(text) {
    const liveRegion = this.ensureLiveRegion();
    if (liveRegion) {
      liveRegion.textContent = text;
    }
  }

  /**
   * Toggle high contrast mode
   */
  toggleHighContrast() {
    this.highContrast = !this.highContrast;
    return this.highContrast;
  }

  /**
   * Adjust terminal font size within safe bounds
   */
  setFontSize(size) {
    this.fontSize = Math.max(10, Math.min(22, size));
    return this.fontSize;
  }
}

export const terminalAccessibility = new TerminalAccessibility();

/**
 * GitQuest Utility: Web Accessibility (a11y) & Screen Reader Live Announcements
 */

export class Accessibility {
  static liveRegion = null;

  static initLiveRegion() {
    if (this.liveRegion || typeof document === 'undefined') return;
    const region = document.createElement('div');
    region.id = 'gitquest-a11y-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only fixed -top-9999px -left-9999px w-1px h-1px overflow-hidden';
    document.body.appendChild(region);
    this.liveRegion = region;
  }

  static announce(message, priority = 'polite') {
    if (typeof document === 'undefined') return;
    this.initLiveRegion();
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
      }
    }, 50);
  }

  static prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static applyAriaAttributes(element, attributes = {}) {
    if (!element) return;
    for (const [key, val] of Object.entries(attributes)) {
      element.setAttribute(key, val);
    }
  }
}

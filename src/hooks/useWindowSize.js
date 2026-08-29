/**
 * useWindowSize & Responsive Breakpoint Observer
 * Provides reactive breakpoint detection for Desktop, Tablet, and Mobile views.
 */

export class ResponsiveObserver {
  constructor() {
    this.listeners = new Set();
    this.width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    this.height = typeof window !== 'undefined' ? window.innerHeight : 768;
    this.boundResize = this.handleResize.bind(this);
    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.boundResize);
    }
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const info = this.getDimensions();
    for (const fn of this.listeners) {
      try {
        fn(info);
      } catch (err) {
        console.error('[ResponsiveObserver] Error in listener:', err);
      }
    }
  }

  getDimensions() {
    const isMobile = this.width < 768;
    const isTablet = this.width >= 768 && this.width < 1024;
    const isDesktop = this.width >= 1024;

    return {
      width: this.width,
      height: this.height,
      isMobile,
      isTablet,
      isDesktop,
      breakpoint: isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop')
    };
  }

  subscribe(listener) {
    if (typeof listener !== 'function') return () => {};
    this.listeners.add(listener);
    listener(this.getDimensions());
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const responsiveObserver = new ResponsiveObserver();

/**
 * GitHero Theme & Accessibility Manager
 * Manages visual filters, accessibility toggles, motion preferences, and font scaling.
 */

import { TOKENS } from './tokens.js';

export class ThemeManager {
  constructor() {
    this.currentTheme = 'terminal-dark';
    this.crtFilter = false;
    this.highContrast = false;
    this.largeFont = false;
    this.screenShake = true;
    this.reducedMotion = false;
  }

  init(settings = {}) {
    this.applySettings(settings);
    this.detectSystemMotion();
  }

  detectSystemMotion() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = motionQuery.matches;
      motionQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
        this.updateDOM();
      });
    }
  }

  applySettings(settings) {
    if (settings.theme) this.currentTheme = settings.theme;
    if (typeof settings.crtFilter === 'boolean') this.crtFilter = settings.crtFilter;
    if (typeof settings.highContrast === 'boolean') this.highContrast = settings.highContrast;
    if (typeof settings.largeTerminalFont === 'boolean') this.largeFont = settings.largeTerminalFont;
    if (typeof settings.screenShake === 'boolean') this.screenShake = settings.screenShake;
    this.updateDOM();
  }

  updateDOM() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // High contrast mode toggle
    if (this.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    // Large terminal font toggle
    if (this.largeFont) {
      root.classList.add('large-font-mode');
    } else {
      root.classList.remove('large-font-mode');
    }

    // CRT Filter toggle
    if (this.crtFilter) {
      body.classList.add('crt-screen-active');
    } else {
      body.classList.remove('crt-screen-active');
    }

    // Reduced motion toggle
    if (this.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }

  triggerScreenShake(intensity = 'medium') {
    if (!this.screenShake || this.reducedMotion) return;
    if (typeof document === 'undefined') return;

    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    appRoot.classList.remove('shake-sm', 'shake-md', 'shake-lg');
    void appRoot.offsetWidth; // Force reflow

    const shakeClass = intensity === 'heavy' ? 'shake-lg' : intensity === 'light' ? 'shake-sm' : 'shake-md';
    appRoot.classList.add(shakeClass);

    setTimeout(() => {
      appRoot.classList.remove(shakeClass);
    }, 400);
  }
}

export const themeManager = new ThemeManager();

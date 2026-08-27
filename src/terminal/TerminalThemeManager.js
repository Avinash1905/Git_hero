// GitHero Terminal Theme Manager
// Provides theme presets for terminal emulation with customized font colors, prompt glyphs, and scanlines.

export class TerminalThemeManager {
  static THEMES = {
    CYBERPUNK: {
      id: 'CYBERPUNK',
      name: 'Cyberpunk Neon',
      background: '#081425',
      foreground: '#d8e3fb',
      promptColor: '#4edea3',
      successColor: '#10b981',
      errorColor: '#ff5555',
      warningColor: '#ffb95f',
      branchColor: '#adc6ff',
      cursorColor: '#4edea3',
      scanlines: true
    },
    MATRIX: {
      id: 'MATRIX',
      name: 'Matrix Operator',
      background: '#051109',
      foreground: '#a3e635',
      promptColor: '#22c55e',
      successColor: '#4ade80',
      errorColor: '#ef4444',
      warningColor: '#eab308',
      branchColor: '#86efac',
      cursorColor: '#22c55e',
      scanlines: true
    },
    DRACULA: {
      id: 'DRACULA',
      name: 'Dracula Dark',
      background: '#282a36',
      foreground: '#f8f8f2',
      promptColor: '#50fa7b',
      successColor: '#50fa7b',
      errorColor: '#ff5555',
      warningColor: '#ffb86c',
      branchColor: '#bd93f9',
      cursorColor: '#ff79c6',
      scanlines: false
    },
    NORD: {
      id: 'NORD',
      name: 'Nordic Frost',
      background: '#2e3440',
      foreground: '#eceff4',
      promptColor: '#88c0d0',
      successColor: '#a3be8c',
      errorColor: '#bf616a',
      warningColor: '#ebcb8b',
      branchColor: '#81a1c1',
      cursorColor: '#88c0d0',
      scanlines: false
    },
    MONOKAI: {
      id: 'MONOKAI',
      name: 'Monokai Pro',
      background: '#2d2a2e',
      foreground: '#fcfcfa',
      promptColor: '#a9dc76',
      successColor: '#a9dc76',
      errorColor: '#ff6188',
      warningColor: '#ffd866',
      branchColor: '#78dce8',
      cursorColor: '#fc9867',
      scanlines: false
    }
  };

  constructor() {
    this.currentTheme = this.loadSavedTheme();
  }

  /**
   * Load saved theme from storage
   * @returns {Object}
   */
  loadSavedTheme() {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedId = localStorage.getItem('githero_terminal_theme');
        if (savedId && TerminalThemeManager.THEMES[savedId]) {
          return TerminalThemeManager.THEMES[savedId];
        }
      }
    } catch (e) {}
    return TerminalThemeManager.THEMES.CYBERPUNK;
  }

  /**
   * Set active theme and persist
   * @param {string} themeId 
   */
  setTheme(themeId) {
    if (TerminalThemeManager.THEMES[themeId]) {
      this.currentTheme = TerminalThemeManager.THEMES[themeId];
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('githero_terminal_theme', themeId);
        }
      } catch (e) {}
    }
  }

  /**
   * Get active theme properties
   * @returns {Object}
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Apply CSS variables to terminal DOM element
   * @param {HTMLElement} terminalEl 
   */
  applyToElement(terminalEl) {
    if (!terminalEl) return;
    const t = this.currentTheme;
    terminalEl.style.setProperty('--term-bg', t.background);
    terminalEl.style.setProperty('--term-fg', t.foreground);
    terminalEl.style.setProperty('--term-prompt', t.promptColor);
    terminalEl.style.setProperty('--term-success', t.successColor);
    terminalEl.style.setProperty('--term-error', t.errorColor);
    terminalEl.style.setProperty('--term-warning', t.warningColor);
    terminalEl.style.setProperty('--term-branch', t.branchColor);
    terminalEl.style.setProperty('--term-cursor', t.cursorColor);
  }
}

// Global Terminal Theme Manager Singleton
export const terminalThemeManager = new TerminalThemeManager();

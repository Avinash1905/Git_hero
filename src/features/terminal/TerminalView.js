/**
 * TerminalView
 * Renders the terminal container adhering to the Stitch design specifications:
 * fixed position, auto-scrolling log area, preserved input visibility, and branch indicator.
 */

import { TerminalFormatter } from './TerminalFormatter.js';

export class TerminalView {
  /**
   * Render initial terminal frame HTML
   * @param {Array<Object>} initialLogs
   * @param {string} currentBranch
   * @returns {string}
   */
  static renderTerminalHtml(initialLogs = [], currentBranch = 'main') {
    const logsHtml = initialLogs.map((log) => TerminalFormatter.formatLogHtml(log)).join('');

    return `
      <div id="gitquest-terminal-panel" class="hud-panel rounded-xl overflow-hidden flex flex-col h-full bg-surface-container-lowest/95 border border-outline-variant/30 shadow-2xl relative">
        <!-- Terminal Header -->
        <div class="px-4 py-2.5 bg-surface-container-high/80 border-b border-outline-variant/30 flex items-center justify-between select-none">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-error/70 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-tertiary/70 inline-block"></span>
            <span class="w-3 h-3 rounded-full bg-primary/70 inline-block"></span>
            <span class="text-terminal-label font-terminal-label text-on-surface-variant text-xs ml-2 font-bold uppercase tracking-wider">
              bash -- git-cli
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-primary font-terminal-code bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              branch: ${currentBranch}
            </span>
          </div>
        </div>

        <!-- Terminal Output Stream (Internal Scrolling) -->
        <div 
          id="terminal-output-body" 
          role="log" 
          aria-live="polite" 
          class="flex-1 p-4 overflow-y-auto font-terminal-code text-xs space-y-1 scrollbar-thin scrollbar-thumb-surface-variant"
        >
          ${logsHtml}
        </div>

        <!-- Terminal Input Line (Always Visible) -->
        <form id="terminal-input-form" class="p-3 bg-surface-container/90 border-t border-outline-variant/30 flex items-center gap-2 relative">
          <label for="terminal-cmd-input" class="text-primary font-bold text-sm select-none font-terminal-code">$</label>
          <input 
            id="terminal-cmd-input"
            type="text"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="git status, git push, git pull..."
            class="flex-1 bg-transparent border-none outline-none text-on-surface font-terminal-code text-sm placeholder:text-on-surface-variant/40 focus:ring-0"
          />
          <button 
            type="submit" 
            class="px-2.5 py-1 rounded bg-primary/15 hover:bg-primary/25 text-primary text-xs font-terminal-label font-bold transition-colors cursor-pointer"
          >
            ENTER
          </button>
        </form>
      </div>
    `;
  }
}

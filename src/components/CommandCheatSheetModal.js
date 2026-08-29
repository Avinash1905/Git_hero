/**
 * CommandCheatSheetModal
 * Modal cheatsheet displaying all 22+ Git commands with copy-to-clipboard buttons and categorized tables.
 */

import { GIT_MANUAL_ENTRIES } from '../terminal/GitCommandManual.js';

export function renderCommandCheatSheetModal(options = {}) {
  const { onClose = 'handleCloseCheatSheet', onExecute = 'handleExecuteCheatSheetCommand' } = options;

  const rows = Object.values(GIT_MANUAL_ENTRIES).map(entry => `
    <tr class="border-b border-outline-variant/15 hover:bg-white/5 font-mono text-xs transition-colors">
      <td class="p-3 font-bold text-primary">${entry.command}</td>
      <td class="p-3 text-on-surface-variant">${entry.description}</td>
      <td class="p-3 text-on-surface select-all text-xs bg-surface-container-lowest/50 rounded">${entry.examples[0]}</td>
      <td class="p-3 text-right">
        <button 
          onclick="${onExecute}('${entry.examples[0]}')" 
          class="px-2.5 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/30 text-[10px] uppercase font-bold transition-all cursor-pointer"
        >
          Run
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="cheat-sheet-modal">
      <div class="w-full max-w-3xl max-h-[85vh] bg-surface-container-high border border-outline-variant/40 rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4 animate-slide-down">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <span class="material-symbols-outlined text-2xl">terminal</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-on-surface font-mono uppercase tracking-wider">GitHero Terminal Command Cheatsheet</h2>
              <p class="text-xs text-on-surface-variant">Standard 22+ Git commands supported in the puzzle terminal</p>
            </div>
          </div>
          <button onclick="${onClose}()" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Table Container -->
        <div class="overflow-y-auto max-h-[55vh] rounded-xl border border-outline-variant/20 bg-surface-container-low">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-outline-variant/20 bg-surface-container-lowest font-mono text-[10px] uppercase text-on-surface-variant tracking-wider">
                <th class="p-3">Command</th>
                <th class="p-3">Functionality</th>
                <th class="p-3">Example Usage</th>
                <th class="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="border-t border-outline-variant/20 pt-3 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
          <span>Tip: You can also use arrow keys or WASD for spatial character navigation.</span>
          <button onclick="${onClose}()" class="px-4 py-2 bg-surface-container hover:bg-surface-container-highest text-on-surface rounded-xl font-bold transition-all cursor-pointer">
            Close
          </button>
        </div>

      </div>
    </div>
  `;
}

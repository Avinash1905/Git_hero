/**
 * MergeConflictResolver
 * Interactive visual 3-Way Merge conflict resolution interface.
 * Allows developers to compare Current (HEAD), Incoming (Feature), and Common Ancestor (Base)
 * hunks and commit resolutions into the active tree.
 */

import { MergeConflictState } from './MergeConflictState.js';

export class MergeConflictResolver {
  constructor(state = null) {
    this.state = state || new MergeConflictState();
    if (this.state.hunks.length === 0) {
      this.state.loadDefaultHunk();
    }
  }

  /**
   * Render complete resolver HTML
   * @returns {string}
   */
  renderHtml() {
    const isDone = this.state.isFullyResolved();
    const hunksHtml = this.state.hunks.map((hunk, idx) => this.renderHunkBlock(hunk, idx + 1)).join('');

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-2xl">
        <!-- Top Status Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-variant/30 font-terminal-code">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-error/20 text-error text-[10px] font-terminal-label uppercase font-bold border border-error/30">
                MERGE CONFLICT
              </span>
              <span class="text-xs text-on-surface font-bold">${this.state.filePath}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">
              Merging <span class="text-secondary font-semibold">${this.state.targetBranch}</span> into <span class="text-primary font-semibold">${this.state.baseBranch}</span>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-on-surface-variant">
              Resolved: <strong class="${isDone ? 'text-primary' : 'text-tertiary'}">${this.state.resolvedCount}/${this.state.hunks.length}</strong>
            </span>
            <button 
              id="btn-finalize-merge" 
              ${isDone ? '' : 'disabled'}
              class="px-4 py-2 rounded-xl ${isDone ? 'bg-primary hover:bg-primary/90 text-on-primary' : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed'} font-terminal-label text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span class="material-symbols-outlined text-[16px]">merge_type</span>
              <span>Commit Merge</span>
            </button>
          </div>
        </div>

        <!-- Hunks List -->
        <div class="space-y-6">
          ${hunksHtml}
        </div>
      </div>
    `;
  }

  /**
   * Render an individual conflict hunk comparison card
   * @param {Object} hunk
   * @param {number} hunkNumber
   * @returns {string}
   */
  renderHunkBlock(hunk, hunkNumber) {
    const isResolved = Boolean(hunk.resolution);

    return `
      <div class="rounded-xl border ${isResolved ? 'border-primary/40 bg-primary/5' : 'border-error/40 bg-surface-container-lowest/60'} overflow-hidden transition-colors font-terminal-code text-xs">
        <!-- Hunk Header -->
        <div class="px-4 py-2.5 bg-surface-container-high/60 flex items-center justify-between border-b border-outline-variant/30">
          <div class="flex items-center gap-2">
            <span class="font-bold text-on-surface">Hunk #${hunkNumber}</span>
            <span class="text-on-surface-variant text-[11px]">at line ${hunk.lineNumber}</span>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1">
            <button 
              data-action="accept-current" 
              data-hunk-id="${hunk.id}"
              class="px-2.5 py-1 rounded text-[10px] font-terminal-label uppercase transition-colors cursor-pointer ${hunk.resolution === 'CURRENT' ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'}"
            >
              Accept Current
            </button>
            <button 
              data-action="accept-incoming" 
              data-hunk-id="${hunk.id}"
              class="px-2.5 py-1 rounded text-[10px] font-terminal-label uppercase transition-colors cursor-pointer ${hunk.resolution === 'INCOMING' ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'}"
            >
              Accept Incoming
            </button>
            <button 
              data-action="accept-both" 
              data-hunk-id="${hunk.id}"
              class="px-2.5 py-1 rounded text-[10px] font-terminal-label uppercase transition-colors cursor-pointer ${hunk.resolution === 'BOTH' ? 'bg-tertiary text-on-tertiary font-bold' : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'}"
            >
              Accept Both
            </button>
          </div>
        </div>

        <!-- Hunk Diff Comparison Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20 p-3 gap-3">
          <!-- Current / HEAD (Local) -->
          <div class="space-y-1">
            <div class="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>Current Change (HEAD: ${this.state.baseBranch})</span>
            </div>
            <pre class="p-2.5 rounded bg-surface-container-lowest text-primary/90 font-mono text-[11px] overflow-x-auto border border-primary/20">${hunk.current}</pre>
          </div>

          <!-- Incoming (Remote / Feature) -->
          <div class="space-y-1">
            <div class="text-[10px] text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>Incoming Change (${this.state.targetBranch})</span>
            </div>
            <pre class="p-2.5 rounded bg-surface-container-lowest text-secondary/90 font-mono text-[11px] overflow-x-auto border border-secondary/20">${hunk.incoming}</pre>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Bind event listeners for conflict picker buttons
   * @param {HTMLElement} containerEl
   * @param {Function} onResolved
   */
  bindEvents(containerEl, onResolved) {
    if (!containerEl) return;

    containerEl.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        const hunkId = btn.getAttribute('data-hunk-id');

        let decision = 'CURRENT';
        if (action === 'accept-incoming') decision = 'INCOMING';
        if (action === 'accept-both') decision = 'BOTH';

        this.state.resolveHunk(hunkId, decision);
        containerEl.innerHTML = this.renderHtml();
        this.bindEvents(containerEl, onResolved);

        if (this.state.isFullyResolved() && typeof onResolved === 'function') {
          onResolved(this.state.generateResolvedFile());
        }
      });
    });
  }
}

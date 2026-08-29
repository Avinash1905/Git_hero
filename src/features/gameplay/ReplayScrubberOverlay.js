// GitHero Interactive Replay Scrubber Overlay
// Allows users to step back and forward through move histories to analyze mechanics.

export class ReplayScrubberOverlay {
  /**
   * Render replay scrubber toolbar HTML
   * @param {number} currentStep 
   * @param {number} totalSteps 
   * @returns {string} HTML markup
   */
  static renderScrubber(currentStep = 0, totalSteps = 0) {
    const percentage = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

    return `
      <div id="replay-scrubber-panel" class="bg-surface-container/95 backdrop-blur p-3 rounded-xl border border-outline-variant/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <!-- Controls -->
        <div class="flex items-center gap-2">
          <button id="replay-btn-start" class="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded text-on-surface transition" title="Jump to Start">
            <span class="material-symbols-Outlined text-sm">first_page</span>
          </button>
          <button id="replay-btn-prev" class="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded text-on-surface transition" title="Step Back (Undo)">
            <span class="material-symbols-Outlined text-sm">chevron_left</span>
          </button>
          <button id="replay-btn-next" class="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded text-on-surface transition" title="Step Forward">
            <span class="material-symbols-Outlined text-sm">chevron_right</span>
          </button>
          <button id="replay-btn-end" class="p-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded text-on-surface transition" title="Jump to Latest">
            <span class="material-symbols-Outlined text-sm">last_page</span>
          </button>
        </div>

        <!-- Slider Bar -->
        <div class="flex-1 w-full flex items-center gap-3">
          <span class="text-xs font-mono text-on-surface-variant w-12 text-right">Step ${currentStep}</span>
          <input 
            type="range" 
            id="replay-timeline-slider" 
            min="0" 
            max="${totalSteps}" 
            value="${currentStep}" 
            class="flex-1 accent-primary cursor-pointer h-1.5 bg-surface-container-highest rounded-lg appearance-none"
          />
          <span class="text-xs font-mono text-on-surface-variant w-12">${totalSteps} Max</span>
        </div>

        <!-- Export Snapshot Button -->
        <button id="replay-export-btn" class="px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface text-xs font-medium rounded flex items-center gap-1.5 transition">
          <span class="material-symbols-Outlined text-xs">download</span>
          Export Solution
        </button>
      </div>
    `;
  }
}

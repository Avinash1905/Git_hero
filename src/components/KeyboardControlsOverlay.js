/**
 * KeyboardControlsOverlay
 * On-screen touch controller and keyboard indicator HUD for movement and spatial interactions.
 */

export function renderKeyboardControlsOverlay(options = {}) {
  const { onMove = 'handleOverlayMove', onCommit = 'handleOverlayCommit', onReset = 'handleOverlayReset' } = options;

  return `
    <div class="fixed bottom-6 left-6 z-40 flex items-end gap-4 select-none pointer-events-auto" id="onscreen-gamepad-overlay">
      <!-- D-Pad Directional Cluster -->
      <div class="grid grid-cols-3 gap-1.5 p-2 bg-surface-container-high/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 shadow-2xl">
        <div></div>
        <button 
          type="button" 
          onclick="${onMove}('up')"
          class="w-11 h-11 bg-surface-container hover:bg-primary/20 active:bg-primary/40 text-on-surface hover:text-primary rounded-xl border border-outline-variant/30 flex items-center justify-center transition-all cursor-pointer"
          title="Move Up (ArrowUp / W / git up)"
        >
          <span class="material-symbols-outlined text-2xl">keyboard_arrow_up</span>
        </button>
        <div></div>

        <button 
          type="button" 
          onclick="${onMove}('left')"
          class="w-11 h-11 bg-surface-container hover:bg-primary/20 active:bg-primary/40 text-on-surface hover:text-primary rounded-xl border border-outline-variant/30 flex items-center justify-center transition-all cursor-pointer"
          title="Move Left (ArrowLeft / A / git left)"
        >
          <span class="material-symbols-outlined text-2xl">keyboard_arrow_left</span>
        </button>
        
        <button 
          type="button" 
          onclick="${onMove}('down')"
          class="w-11 h-11 bg-surface-container hover:bg-primary/20 active:bg-primary/40 text-on-surface hover:text-primary rounded-xl border border-outline-variant/30 flex items-center justify-center transition-all cursor-pointer"
          title="Move Down (ArrowDown / S / git down)"
        >
          <span class="material-symbols-outlined text-2xl">keyboard_arrow_down</span>
        </button>

        <button 
          type="button" 
          onclick="${onMove}('right')"
          class="w-11 h-11 bg-surface-container hover:bg-primary/20 active:bg-primary/40 text-on-surface hover:text-primary rounded-xl border border-outline-variant/30 flex items-center justify-center transition-all cursor-pointer"
          title="Move Right (ArrowRight / D / git right)"
        >
          <span class="material-symbols-outlined text-2xl">keyboard_arrow_right</span>
        </button>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-col gap-2">
        <button 
          type="button" 
          onclick="${onCommit}()"
          class="px-3.5 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 rounded-xl font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          title="Execute git commit"
        >
          <span class="material-symbols-outlined text-[16px]">verified</span>
          <span>Commit</span>
        </button>

        <button 
          type="button" 
          onclick="${onReset}()"
          class="px-3.5 py-2.5 bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface-variant hover:text-error border border-outline-variant/30 rounded-xl font-mono text-xs uppercase font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
          title="Reset Sector (git reset --hard)"
        >
          <span class="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset</span>
        </button>
      </div>
    </div>
  `;
}

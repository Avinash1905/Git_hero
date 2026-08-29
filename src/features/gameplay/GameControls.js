/**
 * GameControls
 * Virtual touch controls (4-Way D-Pad, Push, Pull) and global keyboard bindings.
 */

export class GameControls {
  /**
   * Render virtual D-Pad and mobile action controls HTML
   * @returns {string}
   */
  static renderControlsHtml() {
    return `
      <div id="gameplay-dpad-container" class="flex flex-col items-center justify-center p-3 select-none">
        <div class="text-[10px] text-on-surface-variant font-terminal-label mb-2 uppercase tracking-widest text-center">
          Virtual Nav Controller
        </div>

        <div class="grid grid-cols-3 gap-1.5 w-36 h-36">
          <div></div>
          <button 
            id="btn-dpad-up" 
            aria-label="Move Up" 
            class="bg-surface-container-high hover:bg-surface-bright active:bg-primary text-on-surface hover:text-primary active:text-on-primary rounded-xl flex items-center justify-center border border-outline-variant/30 shadow-md transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-2xl">arrow_upward</span>
          </button>
          <div></div>

          <button 
            id="btn-dpad-left" 
            aria-label="Move Left" 
            class="bg-surface-container-high hover:bg-surface-bright active:bg-primary text-on-surface hover:text-primary active:text-on-primary rounded-xl flex items-center justify-center border border-outline-variant/30 shadow-md transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div class="flex items-center justify-center">
            <span class="w-3 h-3 rounded-full bg-primary/40"></span>
          </div>
          <button 
            id="btn-dpad-right" 
            aria-label="Move Right" 
            class="bg-surface-container-high hover:bg-surface-bright active:bg-primary text-on-surface hover:text-primary active:text-on-primary rounded-xl flex items-center justify-center border border-outline-variant/30 shadow-md transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>

          <div></div>
          <button 
            id="btn-dpad-down" 
            aria-label="Move Down" 
            class="bg-surface-container-high hover:bg-surface-bright active:bg-primary text-on-surface hover:text-primary active:text-on-primary rounded-xl flex items-center justify-center border border-outline-variant/30 shadow-md transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-2xl">arrow_downward</span>
          </button>
          <div></div>
        </div>

        <div class="flex items-center gap-2 mt-3 w-full justify-center">
          <button 
            id="btn-quick-push" 
            class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary text-xs font-terminal-label font-bold border border-primary/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[14px]">upload</span>
            <span>PUSH</span>
          </button>
          <button 
            id="btn-quick-pull" 
            class="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-secondary text-xs font-terminal-label font-bold border border-secondary/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[14px]">download</span>
            <span>PULL</span>
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Bind event listeners to adapter
   * @param {import('../../adapters/GameEngineAdapter.js').GameEngineAdapter} adapter
   */
  static bindEvents(adapter) {
    if (!adapter) return;

    document.getElementById('btn-dpad-up')?.addEventListener('click', () => adapter.movePlayer('up'));
    document.getElementById('btn-dpad-down')?.addEventListener('click', () => adapter.movePlayer('down'));
    document.getElementById('btn-dpad-left')?.addEventListener('click', () => adapter.movePlayer('left'));
    document.getElementById('btn-dpad-right')?.addEventListener('click', () => adapter.movePlayer('right'));
    document.getElementById('btn-quick-push')?.addEventListener('click', () => adapter.gitPush());
    document.getElementById('btn-quick-pull')?.addEventListener('click', () => adapter.gitPull());
  }
}

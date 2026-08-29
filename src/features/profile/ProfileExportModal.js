/**
 * ProfileExportModal
 * Modal for exporting profile statistics and saved level telemetry to JSON and CSV formats.
 */

export function renderProfileExportModal(playerData = {}, options = {}) {
  const { onClose = 'handleCloseExportModal', onExportJson = 'handleExportProfileJson', onExportCsv = 'handleExportProfileCsv' } = options;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="profile-export-modal">
      <div class="w-full max-w-md bg-surface-container-high border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-6 text-center animate-slide-down">
        
        <!-- Header -->
        <div class="space-y-1">
          <div class="p-3 w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-2">
            <span class="material-symbols-outlined text-2xl">download</span>
          </div>
          <h2 class="text-base font-bold text-on-surface font-mono uppercase tracking-wider">Export Operative Dossier</h2>
          <p class="text-xs text-on-surface-variant">Download your sector progress, telemetry, and achievements</p>
        </div>

        <!-- Options -->
        <div class="space-y-3 font-mono text-xs">
          <button 
            type="button" 
            onclick="${onExportJson}()"
            class="w-full p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/20 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3 text-left">
              <span class="material-symbols-outlined text-primary text-2xl">data_object</span>
              <div>
                <div class="font-bold text-on-surface group-hover:text-primary transition-colors">JSON Archive (.json)</div>
                <div class="text-[10px] text-on-surface-variant">Full state schema with move histories</div>
              </div>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">arrow_forward</span>
          </button>

          <button 
            type="button" 
            onclick="${onExportCsv}()"
            class="w-full p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/20 flex items-center justify-between transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3 text-left">
              <span class="material-symbols-outlined text-emerald-400 text-2xl">table_chart</span>
              <div>
                <div class="font-bold text-on-surface group-hover:text-emerald-400 transition-colors">CSV Spreadsheet (.csv)</div>
                <div class="text-[10px] text-on-surface-variant">Sector completion times and star ratings</div>
              </div>
            </div>
            <span class="material-symbols-outlined text-on-surface-variant group-hover:text-emerald-400">arrow_forward</span>
          </button>
        </div>

        <!-- Close -->
        <div class="border-t border-outline-variant/20 pt-4">
          <button 
            type="button" 
            onclick="${onClose}()"
            class="w-full py-2.5 bg-surface-container hover:bg-surface-container-highest text-on-surface font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  `;
}

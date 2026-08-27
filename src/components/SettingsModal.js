/**
 * SettingsModal
 * Modal preferences dialog for terminal themes, volume sliders, CRT scanlines, and audio toggles.
 */

export function renderSettingsModal(currentSettings = {}, options = {}) {
  const {
    onClose = 'handleCloseSettings',
    onSave = 'handleSaveSettings',
    onThemeChange = 'handleSettingsThemeChange'
  } = options;

  const themes = [
    { id: 'matrix-cyan', name: 'Cyber Matrix (Default)' },
    { id: 'synthwave-purple', name: 'Synthwave 80s' },
    { id: 'amber-crt', name: 'Amber Phosphor CRT' },
    { id: 'dracula-dark', name: 'Dracula Midnight' },
    { id: 'monokai-pro', name: 'Monokai Pro' }
  ];

  const themeOptions = themes.map(t => `
    <option value="${t.id}" ${t.id === currentSettings.terminalTheme ? 'selected' : ''}>${t.name}</option>
  `).join('');

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="settings-modal">
      <div class="w-full max-w-lg bg-surface-container-high border border-outline-variant/40 rounded-3xl p-6 shadow-2xl space-y-6 animate-slide-down">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <span class="material-symbols-outlined text-2xl">settings</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-on-surface font-mono uppercase tracking-wider">Operative Settings</h2>
              <p class="text-xs text-on-surface-variant">Customize audio, terminal visuals, and interface effects</p>
            </div>
          </div>
          <button onclick="${onClose}()" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Form Options -->
        <div class="space-y-4 font-mono text-xs">
          <!-- Terminal Theme -->
          <div class="space-y-1.5">
            <label class="text-[10px] uppercase font-bold text-on-surface-variant">Terminal Color Palette</label>
            <select 
              id="settings-theme-select" 
              onchange="${onThemeChange}(this.value)"
              class="w-full p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:border-primary focus:outline-none cursor-pointer"
            >
              ${themeOptions}
            </select>
          </div>

          <!-- Sound Toggle -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <div>
              <div class="font-bold text-on-surface">Synthesized Sound Effects</div>
              <div class="text-[10px] text-on-surface-variant">Web Audio API procedural sound engine</div>
            </div>
            <input type="checkbox" id="settings-sound-enabled" ${currentSettings.soundEnabled !== false ? 'checked' : ''} class="w-5 h-5 rounded text-primary focus:ring-primary/30 cursor-pointer" />
          </div>

          <!-- CRT Filter Toggle -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <div>
              <div class="font-bold text-on-surface">CRT Scanline Shader Filter</div>
              <div class="text-[10px] text-on-surface-variant">Retro arcade phosphor scanline simulation</div>
            </div>
            <input type="checkbox" id="settings-crt-filter" ${currentSettings.crtFilter !== false ? 'checked' : ''} class="w-5 h-5 rounded text-primary focus:ring-primary/30 cursor-pointer" />
          </div>

          <!-- Screen Shake Toggle -->
          <div class="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <div>
              <div class="font-bold text-on-surface">Haptic Screen Shake</div>
              <div class="text-[10px] text-on-surface-variant">Camera shake on error buzzers and laser portals</div>
            </div>
            <input type="checkbox" id="settings-screen-shake" ${currentSettings.screenShake !== false ? 'checked' : ''} class="w-5 h-5 rounded text-primary focus:ring-primary/30 cursor-pointer" />
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="border-t border-outline-variant/20 pt-4 flex items-center justify-end gap-2">
          <button 
            type="button" 
            onclick="${onClose}()"
            class="px-4 py-2.5 bg-surface-container hover:bg-surface-container-highest text-on-surface font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button 
            type="button" 
            onclick="${onSave}()"
            class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-mono text-xs uppercase font-bold tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  `;
}

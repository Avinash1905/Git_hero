// SettingsView - 100% faithful to Stitch Settings Screen

import { StorageService } from '../services/StorageService.js';
import { soundFX } from '../audio.js';

export function renderSettingsView(activeCategory = 'general', onSettingChange) {
  const userState = StorageService.load();
  const settings = userState.settings;

  return `
    <main class="flex-1 max-w-5xl mx-auto px-hud-margin pt-24 pb-28 md:pb-12 flex flex-col md:flex-row gap-lg min-h-screen">
      <!-- Sidebar Navigation for Settings Categories -->
      <aside class="w-full md:w-64 flex-shrink-0 flex flex-col gap-sm">
        <h1 class="text-headline-sm font-headline-sm text-primary mb-md tracking-tighter">~/settings</h1>
        <nav class="flex flex-col gap-unit">
          <button id="set-cat-general" class="${activeCategory === 'general' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'} text-left p-3 rounded-lg flex items-center gap-sm transition-colors font-terminal-label text-terminal-label">
            <span class="material-symbols-outlined text-[18px]">settings</span>
            General
          </button>
          <button id="set-cat-sound" class="${activeCategory === 'sound' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'} text-left p-3 rounded-lg flex items-center gap-sm transition-colors font-terminal-label text-terminal-label">
            <span class="material-symbols-outlined text-[18px]">volume_up</span>
            Sound & Audio
          </button>
          <button id="set-cat-graphics" class="${activeCategory === 'graphics' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'} text-left p-3 rounded-lg flex items-center gap-sm transition-colors font-terminal-label text-terminal-label">
            <span class="material-symbols-outlined text-[18px]">monitor</span>
            Graphics
          </button>
          <button id="set-cat-accessibility" class="${activeCategory === 'accessibility' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'} text-left p-3 rounded-lg flex items-center gap-sm transition-colors font-terminal-label text-terminal-label">
            <span class="material-symbols-outlined text-[18px]">accessibility_new</span>
            Accessibility
          </button>
          <button id="set-cat-controls" class="${activeCategory === 'controls' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40'} text-left p-3 rounded-lg flex items-center gap-sm transition-colors font-terminal-label text-terminal-label">
            <span class="material-symbols-outlined text-[18px]">sports_esports</span>
            Controls & Git CLI
          </button>
        </nav>
      </aside>

      <!-- Settings Content Area -->
      <div class="flex-1 flex flex-col gap-lg">
        <!-- General Settings Panel -->
        <section class="settings-panel rounded-[12px] p-lg flex flex-col gap-md">
          <h2 class="text-headline-md font-headline-md text-secondary border-b border-outline-variant/30 pb-sm">General Configuration</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-lg mt-sm">
            <div class="flex flex-col gap-sm">
              <label class="text-terminal-label font-terminal-label text-on-surface-variant uppercase">Language</label>
              <select id="setting-language" class="bg-surface-container-high border border-outline-variant text-on-surface rounded-lg p-3 font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors">
                <option ${settings.language === 'English (US)' ? 'selected' : ''}>English (US)</option>
                <option ${settings.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
                <option ${settings.language === 'French' ? 'selected' : ''}>French</option>
                <option ${settings.language === 'Japanese' ? 'selected' : ''}>Japanese</option>
              </select>
            </div>
            <div class="flex flex-col gap-sm">
              <label class="text-terminal-label font-terminal-label text-on-surface-variant uppercase">Theme Style</label>
              <select id="setting-theme" class="bg-surface-container-high border border-outline-variant text-on-surface rounded-lg p-3 font-body-md text-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors">
                <option ${settings.theme === 'Terminal (Dark)' ? 'selected' : ''}>Terminal (Dark)</option>
                <option ${settings.theme === 'Modern (Dark)' ? 'selected' : ''}>Modern (Dark)</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Toggles Panel -->
        <section class="settings-panel rounded-[12px] p-lg flex flex-col gap-md">
          <h2 class="text-headline-sm font-headline-sm text-secondary border-b border-outline-variant/30 pb-sm">Preferences & Audio</h2>
          
          <div class="flex flex-col gap-md mt-sm">
            <!-- Sound Toggle -->
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/20 transition-colors">
              <div class="flex flex-col">
                <span class="text-body-md font-body-md text-on-surface">Enable Sound Effects</span>
                <span class="text-terminal-code font-terminal-code text-on-surface-variant text-sm">Synthesizer audio feedback on moves and commands</span>
              </div>
              <input type="checkbox" id="toggle-sound" class="w-6 h-6 accent-primary rounded cursor-pointer" ${settings.soundEffects ? 'checked' : ''}>
            </div>

            <!-- Volume Slider -->
            <div class="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface-variant/20 transition-colors">
              <div class="flex justify-between items-center">
                <span class="text-body-md font-body-md text-on-surface">Master Volume</span>
                <span id="volume-val-display" class="text-terminal-label font-terminal-label text-primary">${settings.volume}%</span>
              </div>
              <input type="range" id="slider-volume" min="0" max="100" value="${settings.volume}" class="w-full accent-primary cursor-pointer">
            </div>

            <!-- Screen Shake Toggle -->
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/20 transition-colors">
              <div class="flex flex-col">
                <span class="text-body-md font-body-md text-on-surface">Screen Shake / Micro-animations</span>
                <span class="text-terminal-code font-terminal-code text-on-surface-variant text-sm">Tactile feedback on commits and puzzle solves</span>
              </div>
              <input type="checkbox" id="toggle-shake" class="w-6 h-6 accent-primary rounded cursor-pointer" ${settings.screenShake ? 'checked' : ''}>
            </div>

            <!-- Vim Keybindings -->
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant/20 transition-colors">
              <div class="flex flex-col">
                <span class="text-body-md font-body-md text-on-surface">Vim Style Navigation (HJKL)</span>
                <span class="text-terminal-code font-terminal-code text-on-surface-variant text-sm">Navigate grid using H, J, K, L</span>
              </div>
              <input type="checkbox" id="toggle-vim" class="w-6 h-6 accent-primary rounded cursor-pointer" ${settings.vimKeybindings ? 'checked' : ''}>
            </div>
          </div>
        </section>
      </div>
    </main>
  `;
}

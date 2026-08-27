/**
 * SettingsPage
 * Displays player preferences: audio volume, SFX mute, design theme, language,
 * and account data controls.
 */

import { playerStore } from '../state/PlayerStore.js';

export function renderSettingsPage() {
  const profile = playerStore.getState().profile || {};
  const settings = profile.settings || {
    soundEffects: true,
    backgroundMusic: true,
    volume: 70,
    language: 'English (US)',
    theme: 'Terminal (Dark)'
  };

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-3xl mx-auto space-y-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-variant/60 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Configuration Matrix</span>
        </div>
        <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
          System Settings
        </h1>
        <p class="text-on-surface-variant text-sm font-terminal-code">
          Adjust audio synthesis, visual theme, and operational parameters
        </p>
      </div>

      <div class="glass-panel p-6 md:p-8 rounded-2xl border border-outline-variant/30 space-y-6 shadow-xl font-terminal-code text-sm">
        <!-- Audio Section -->
        <div>
          <h3 class="text-on-surface font-bold text-base mb-4 font-headline-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">volume_up</span>
            <span>Audio & Sound Synthesis</span>
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-on-surface font-medium">Sound Effects (SFX)</div>
                <div class="text-xs text-on-surface-variant">Movement cues, box slides, commit fanfares</div>
              </div>
              <input 
                id="toggle-sound" 
                type="checkbox" 
                ${settings.soundEffects ? 'checked' : ''}
                class="w-5 h-5 rounded text-primary focus:ring-primary/40 bg-surface-container-lowest border-outline-variant/40 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-on-surface font-medium">Master Volume</span>
                <span id="volume-val-display" class="text-primary font-bold">${settings.volume || 70}%</span>
              </div>
              <input 
                id="slider-volume" 
                type="range" 
                min="0" 
                max="100" 
                value="${settings.volume || 70}"
                class="w-full accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <hr class="border-surface-variant/30" />

        <!-- Theme & Language Section -->
        <div>
          <h3 class="text-on-surface font-bold text-base mb-4 font-headline-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[20px]">palette</span>
            <span>Display & Interface</span>
          </h3>

          <div class="space-y-4">
            <div>
              <label class="block text-xs uppercase text-on-surface-variant mb-1 font-terminal-label" for="setting-theme">
                Color Palette Theme
              </label>
              <select 
                id="setting-theme" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-xs focus:outline-none focus:border-primary"
              >
                <option value="dark" ${settings.theme === 'Terminal (Dark)' ? 'selected' : ''}>Terminal (Dark Cyberpunk) [Authoritative]</option>
                <option value="matrix">Matrix Phosphor Green</option>
                <option value="dracula">Dracula High Contrast</option>
              </select>
            </div>

            <div>
              <label class="block text-xs uppercase text-on-surface-variant mb-1 font-terminal-label" for="setting-language">
                Interface Language
              </label>
              <select 
                id="setting-language" 
                class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2.5 text-on-surface font-terminal-code text-xs focus:outline-none focus:border-primary"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

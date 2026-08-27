/**
 * CosmeticsModal
 * Interactive interface for inspecting and equipping avatar skins and terminal color themes.
 */

import { AVATAR_CATALOG, TERMINAL_THEMES, cosmeticsStore } from './AvatarCatalog.js';

export class CosmeticsModal {
  /**
   * Render modal HTML
   * @param {number} playerXp
   * @returns {string}
   */
  static renderHtml(playerXp = 0) {
    const { equippedSkin, equippedTheme, unlockedSkins } = cosmeticsStore.getState();

    const skinCards = AVATAR_CATALOG.map((skin) => {
      const isUnlocked = unlockedSkins.includes(skin.id);
      const isEquipped = equippedSkin === skin.id;

      return `
        <div class="glass-panel p-4 rounded-xl border ${isEquipped ? 'border-primary shadow-lg shadow-primary/10' : 'border-outline-variant/30'} flex flex-col justify-between font-terminal-code text-xs">
          <div>
            <div class="flex items-center justify-between mb-2">
              <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center" style="border-color: ${skin.color}; background: ${skin.color}20;">
                <span class="w-3 h-3 rounded-full" style="background: ${skin.color};"></span>
              </div>
              <span class="text-[10px] font-terminal-label uppercase px-2 py-0.5 rounded ${isEquipped ? 'bg-primary text-on-primary font-bold' : isUnlocked ? 'bg-surface-container-high text-on-surface-variant' : 'bg-surface-container-highest text-on-surface-variant/50'}">
                ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'UNLOCKED' : `${skin.costXp} XP`}
              </span>
            </div>

            <div class="font-bold text-on-surface text-sm">${skin.name}</div>
            <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">${skin.description}</p>
          </div>

          <div class="mt-4 pt-2 border-t border-surface-variant/30 text-right">
            ${isEquipped ? `
              <button disabled class="w-full py-1.5 rounded-lg bg-surface-container-high text-primary font-terminal-label text-[11px] font-bold uppercase cursor-default">
                Active Skin
              </button>
            ` : isUnlocked ? `
              <button data-equip-skin="${skin.id}" class="w-full py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-[11px] font-bold uppercase transition-colors cursor-pointer">
                Equip Skin
              </button>
            ` : `
              <button data-unlock-skin="${skin.id}" class="w-full py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-terminal-label text-[11px] font-bold uppercase transition-colors cursor-pointer ${playerXp >= skin.costXp ? '' : 'opacity-50 cursor-not-allowed'}">
                Unlock (${skin.costXp} XP)
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    const themeCards = TERMINAL_THEMES.map((th) => {
      const isEquipped = equippedTheme === th.id;

      return `
        <div class="glass-panel p-3.5 rounded-xl border ${isEquipped ? 'border-primary' : 'border-outline-variant/30'} flex items-center justify-between font-terminal-code text-xs">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-md border flex items-center justify-center" style="background: ${th.bg}; border-color: ${th.border};">
              <span class="w-2 h-2 rounded-full" style="background: ${th.fg};"></span>
            </div>
            <div>
              <div class="font-bold text-on-surface">${th.name}</div>
              <div class="text-[10px] text-on-surface-variant">Theme Matrix</div>
            </div>
          </div>

          <button data-equip-theme="${th.id}" class="px-3 py-1 rounded-lg text-[11px] font-terminal-label uppercase transition-colors cursor-pointer ${isEquipped ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'}">
            ${isEquipped ? 'Active' : 'Apply'}
          </button>
        </div>
      `;
    }).join('');

    return `
      <div id="cosmetics-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in">
        <div class="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-outline-variant/40 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin space-y-6">
          <div class="flex items-center justify-between border-b border-surface-variant/30 pb-4">
            <div>
              <h3 class="text-headline-sm font-bold text-on-surface text-lg">Customization Matrix</h3>
              <p class="text-xs text-on-surface-variant font-terminal-code">Select operative avatar skins and terminal color profiles</p>
            </div>
            <button id="cosmetics-close-btn" class="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Skins Section -->
          <div>
            <h4 class="text-xs font-bold text-primary font-terminal-code uppercase tracking-wider mb-3">
              Operative Sprites
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${skinCards}
            </div>
          </div>

          <!-- Themes Section -->
          <div>
            <h4 class="text-xs font-bold text-secondary font-terminal-code uppercase tracking-wider mb-3">
              Terminal Visual Themes
            </h4>
            <div class="space-y-2">
              ${themeCards}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static bindEvents(containerEl, playerXp = 0, onUpdate = null) {
    if (!containerEl) return;

    containerEl.querySelectorAll('[data-equip-skin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-equip-skin');
        cosmeticsStore.equipSkin(id);
        if (typeof onUpdate === 'function') onUpdate();
      });
    });

    containerEl.querySelectorAll('[data-unlock-skin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-unlock-skin');
        const res = cosmeticsStore.unlockSkin(id, playerXp);
        if (res.success) {
          cosmeticsStore.equipSkin(id);
          if (typeof onUpdate === 'function') onUpdate();
        }
      });
    });

    containerEl.querySelectorAll('[data-equip-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-equip-theme');
        cosmeticsStore.equipTheme(id);
        if (typeof onUpdate === 'function') onUpdate();
      });
    });

    containerEl.querySelector('#cosmetics-close-btn')?.addEventListener('click', () => {
      document.getElementById('cosmetics-modal')?.remove();
    });
  }
}

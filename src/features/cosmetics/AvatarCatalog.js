/**
 * AvatarCatalog & CosmeticsStore
 * Player customization items: hero sprites, terminal color themes, particle trails, and title badges.
 */

export const AVATAR_CATALOG = Object.freeze([
  {
    id: 'skin-default',
    name: 'Cyberpunk Scout',
    type: 'skin',
    color: '#4edea3',
    description: 'Standard issue field terminal engineer operative.',
    unlockedByDefault: true,
    requiredLevel: 1,
    costXp: 0
  },
  {
    id: 'skin-neon-phantom',
    name: 'Neon Phantom',
    type: 'skin',
    color: '#adc6ff',
    description: 'Ghost operative specializing in stealth rebases.',
    unlockedByDefault: false,
    requiredLevel: 3,
    costXp: 1200
  },
  {
    id: 'skin-quantum-diver',
    name: 'Quantum Diver',
    type: 'skin',
    color: '#ffb95f',
    description: 'Multi-threaded specialist capable of traversing detached HEADs.',
    unlockedByDefault: false,
    requiredLevel: 5,
    costXp: 2500
  },
  {
    id: 'skin-godhead-prime',
    name: 'Godhead Prime',
    type: 'skin',
    color: '#ff7bf7',
    description: 'Transcendent git architect wielding direct DAG manipulation.',
    unlockedByDefault: false,
    requiredLevel: 10,
    costXp: 10000
  }
]);

export const TERMINAL_THEMES = Object.freeze([
  {
    id: 'theme-cyberpunk',
    name: 'Cyberpunk Midnight (Default)',
    bg: '#040e1f',
    fg: '#4edea3',
    border: '#3c4a42',
    accent: '#adc6ff'
  },
  {
    id: 'theme-matrix',
    name: 'Phosphor Matrix',
    bg: '#020d04',
    fg: '#00ff66',
    border: '#004d1f',
    accent: '#33ff88'
  },
  {
    id: 'theme-dracula',
    name: 'Dracula Obsidian',
    bg: '#181425',
    fg: '#f1fa8c',
    border: '#6272a4',
    accent: '#ff79c6'
  },
  {
    id: 'theme-solarized',
    name: 'Solarized Dark',
    bg: '#002b36',
    fg: '#859900',
    border: '#586e75',
    accent: '#268bd2'
  }
]);

import { Store } from '../../state/Store.js';

export class CosmeticsStore extends Store {
  constructor() {
    super({
      equippedSkin: 'skin-default',
      equippedTheme: 'theme-cyberpunk',
      unlockedSkins: ['skin-default'],
      unlockedThemes: ['theme-cyberpunk']
    });
  }

  equipSkin(skinId) {
    if (this.state.unlockedSkins.includes(skinId)) {
      this.setState({ equippedSkin: skinId });
      return true;
    }
    return false;
  }

  equipTheme(themeId) {
    if (this.state.unlockedThemes.includes(themeId)) {
      this.setState({ equippedTheme: themeId });
      return true;
    }
    return false;
  }

  unlockSkin(skinId, playerXp) {
    const skin = AVATAR_CATALOG.find(s => s.id === skinId);
    if (!skin) return { success: false, reason: 'Skin does not exist' };
    if (this.state.unlockedSkins.includes(skinId)) return { success: true };
    if (playerXp < skin.costXp) return { success: false, reason: 'Insufficient XP' };

    this.setState({
      unlockedSkins: [...this.state.unlockedSkins, skinId]
    });
    return { success: true, skin };
  }
}

export const cosmeticsStore = new CosmeticsStore();

/**
 * GitHero User & Profile Service
 * Manages player profile customization, title progression, avatar selections, and stats aggregations.
 */

import { appStore } from '../state/appStore.js';

export class UserService {
  getProfile() {
    return appStore.getState().player;
  }

  updateProfile(partialProfile) {
    const state = appStore.getState();
    state.player = { ...state.player, ...partialProfile };
    appStore.save();
    return state.player;
  }

  getAvailableAvatars() {
    return [
      { id: 'av_1', name: 'Cyber Ninja', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8' },
      { id: 'av_2', name: 'Kernel Guardian', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDud6okIV02jhmDlAPEHxgYXcDNc2q1nsOHBV3pwTdA_ggOX2dzSjnWA_qfp7oeCXrhLG7W3rDWPQ4NwC7RUAeywZ753egcw2iJitcVtN5DOJRewUcoo4pYrSG0YJ8cUUYVbJ3YzTX7ND9ZlBAw0QJUSZj-SnOk2PRX5n9209agFlczi_Sb3C2MCIe-0qHJlPtIFeLmWypXAd8L431J07JqHbYlHoDEANVtXYddeAxPurorUqmvW8' },
      { id: 'av_3', name: 'Branch Weaver', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpSIs8lzKW5g1qJ4SJylv7qOrt-EmLYp9tHKVhQgw1p7yLeEx6SMQxJt4TVbKGXVDCHWaNfVJ98nlYFFe0o3jJC12J9kvfbKVEcH0tbHMjDxQ2DIhgW0lGDmiqqZTBjIjS0QQykirJlszrGWr4sbtCpJvs76AkYu1MJHTC_nw9dxZ9mVgwmdoT7F-MxMDm7m_jlQCg-y0zi8EQbt3bepNms4XiV1ap18xLb-bhyjaS8KzSzAFPunY' },
      { id: 'av_4', name: 'Daemon Sentinel', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsR47JXLXmx5ja93SRiRd72ASH-oIyc2ZwUFO-JY6ipr5XKzbiLHNEKN4m_5mg19lPN6Ur8H4p0Q9VbwHocGHIJ2o-NrCz5T_gczxp_oxGLRV4KrtWe-8fMP5OI1ISltmPWahQaBYBeKtMpuFw64ESnhp0bKSFl0V-i1R4nNDEZdE0n0N4GiSM2t6udjI1vZRDHiMi2LDJXRmIpChSihJeTuQq46Y5Q-GtipkGFxTgVk_qK72BiZ8' }
    ];
  }

  getTitlesForXP(xp) {
    if (xp >= 20000) return 'Git Grandmaster';
    if (xp >= 15000) return 'Kernel Architect';
    if (xp >= 10000) return 'Branch Master';
    if (xp >= 5000) return 'Merge Specialist';
    if (xp >= 2000) return 'Commit Veteran';
    return 'Git Novice';
  }
}

export const userService = new UserService();

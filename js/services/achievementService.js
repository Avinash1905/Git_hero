/**
 * GitHero Achievement Service
 * Evaluates achievement unlocking conditions and groups badges by category.
 */

import { appStore } from '../state/appStore.js';
import { AchievementModel } from '../types/models.js';

export class AchievementService {
  getAchievements(category = 'all') {
    const list = appStore.getState().achievements || [];
    const models = list.map(a => new AchievementModel(a));

    if (category === 'all') return models;
    return models.filter(a => a.category === category);
  }

  getUnlockedCount() {
    const list = appStore.getState().achievements || [];
    return list.filter(a => a.unlocked).length;
  }

  getTotalCount() {
    return (appStore.getState().achievements || []).length;
  }

  getCompletionRate() {
    const total = this.getTotalCount();
    if (!total) return 0;
    return Math.round((this.getUnlockedCount() / total) * 100);
  }
}

export const achievementService = new AchievementService();

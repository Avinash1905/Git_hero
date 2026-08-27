/**
 * LeaderboardStore & AchievementStore
 * Reactive domain stores for leaderboard rankings and player achievements.
 */

import { Store } from './Store.js';
import { leaderboardService } from '../services/leaderboardService.js';
import { achievementService } from '../services/achievementService.js';

export class LeaderboardStore extends Store {
  constructor() {
    super({
      activeTab: 'global', // 'global' | 'weekly' | 'friends'
      rankings: [],
      myRank: null,
      isLoading: false,
      error: null
    });
  }

  async loadRankings(tab = 'global') {
    this.setState({ activeTab: tab, isLoading: true, error: null }, 'LOAD_RANKINGS_START');
    try {
      let result;
      if (tab === 'weekly') {
        result = await leaderboardService.getWeekly();
      } else {
        result = await leaderboardService.getGlobal();
      }

      this.setState({
        rankings: result.rankings || [],
        isLoading: false
      }, 'LOAD_RANKINGS_SUCCESS');
    } catch (err) {
      this.setState({ isLoading: false, error: err.message }, 'LOAD_RANKINGS_ERROR');
    }
  }

  setTab(tab) {
    this.loadRankings(tab);
  }
}

export class AchievementStore extends Store {
  constructor() {
    super({
      achievements: [],
      userAchievements: {},
      filterCategory: 'ALL',
      isLoading: false
    });
  }

  async loadAchievements() {
    this.setState({ isLoading: true }, 'LOAD_ACHIEVEMENTS_START');
    try {
      const all = await achievementService.getAchievements();
      this.setState({ achievements: all, isLoading: false }, 'LOAD_ACHIEVEMENTS_SUCCESS');
    } catch (err) {
      this.setState({ isLoading: false }, 'LOAD_ACHIEVEMENTS_ERROR');
    }
  }

  setCategory(category) {
    this.setState({ filterCategory: category }, 'SET_ACHIEVEMENT_CATEGORY');
  }
}

export const leaderboardStore = new LeaderboardStore();
export const achievementStore = new AchievementStore();

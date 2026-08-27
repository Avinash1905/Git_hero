/**
 * GitHero Leaderboard Service
 * Aggregates global, friend, and weekly player rankings with dynamic user rank injection.
 */

import { MockBackend } from './MockBackend.js';
import { LeaderboardEntryModel } from '../types/models.js';
import { appStore } from '../state/appStore.js';

export class LeaderboardService {
  getRankings(tab = 'global') {
    const rawData = MockBackend.getLeaderboard(tab);
    const userProfile = appStore.getState().player;

    return rawData.map(item => {
      if (item.isUser) {
        return new LeaderboardEntryModel({
          ...item,
          handle: `${userProfile.username} (You)`,
          title: userProfile.title,
          xp: (userProfile.xp || 14500).toLocaleString(),
          levels: userProfile.completedLevelsCount || 128
        });
      }
      return new LeaderboardEntryModel(item);
    });
  }
}

export const leaderboardService = new LeaderboardService();

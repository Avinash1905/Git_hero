/**
 * QuestStore
 * Reactive state store managing daily and weekly operative quest objectives,
 * tracking real-time progress, and handling reward claims.
 */

import { Store } from './Store.js';

export class QuestStore extends Store {
  constructor() {
    super({
      quests: [
        { id: 'quest_daily_sectors', title: 'Tactical Recon', desc: 'Complete 3 sectors of any difficulty', current: 0, target: 3, xp: 200, isClaimed: false, category: 'daily' },
        { id: 'quest_daily_commits', title: 'Commit Machine', desc: 'Execute 10 valid git commit operations', current: 0, target: 10, xp: 150, isClaimed: false, category: 'daily' },
        { id: 'quest_weekly_stars', title: 'Stellar Operative', desc: 'Earn 15 new stars across worlds', current: 0, target: 15, xp: 1000, isClaimed: false, category: 'weekly' },
        { id: 'quest_weekly_branches', title: 'Branch Specialist', desc: 'Switch or merge branches 20 times', current: 0, target: 20, xp: 750, isClaimed: false, category: 'weekly' }
      ],
      lastResetDate: new Date().toISOString().split('T')[0]
    });
  }

  /**
   * Increment quest progress by key event
   */
  trackEvent(eventType, count = 1) {
    const updatedQuests = this.state.quests.map(q => {
      let increment = 0;
      if (eventType === 'SECTOR_COMPLETED' && q.id === 'quest_daily_sectors') increment = count;
      if (eventType === 'COMMIT_EXECUTED' && q.id === 'quest_daily_commits') increment = count;
      if (eventType === 'STARS_EARNED' && q.id === 'quest_weekly_stars') increment = count;
      if (eventType === 'BRANCH_ACTION' && q.id === 'quest_weekly_branches') increment = count;

      if (increment > 0) {
        return {
          ...q,
          current: Math.min(q.target, q.current + increment)
        };
      }
      return q;
    });

    this.setState({ quests: updatedQuests });
  }

  /**
   * Claim reward for a completed quest
   */
  claimReward(questId) {
    const target = this.state.quests.find(q => q.id === questId);
    if (!target || target.current < target.target || target.isClaimed) {
      return { success: false, reason: 'Quest not completed or already claimed' };
    }

    const updated = this.state.quests.map(q => {
      if (q.id === questId) {
        return { ...q, isClaimed: true };
      }
      return q;
    });

    this.setState({ quests: updated });
    return { success: true, xp: target.xp };
  }
}

export const questStore = new QuestStore();

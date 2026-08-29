/**
 * QuestManager
 * Evaluates gameplay telemetry against active daily and weekly quest criteria.
 */

import { DAILY_QUEST_TEMPLATES, WEEKLY_QUEST_TEMPLATES } from './QuestCatalog.js';
import { playerStore } from '../../state/PlayerStore.js';
import { soundService } from '../../services/soundService.js';

export class QuestManager {
  constructor() {
    this.activeQuests = [];
    this.init();
  }

  init() {
    this.activeQuests = [
      ...DAILY_QUEST_TEMPLATES.map(q => ({ ...q, progress: 0, completed: false, claimed: false })),
      ...WEEKLY_QUEST_TEMPLATES.map(q => ({ ...q, progress: 0, completed: false, claimed: false }))
    ];
  }

  /**
   * Process telemetry event from gameplay
   * @param {'PUSH' | 'LEVEL_CLEARED' | 'MOVE' | 'UNDO'} eventType
   * @param {Object} payload
   */
  recordEvent(eventType, payload = {}) {
    let stateChanged = false;

    for (const q of this.activeQuests) {
      if (q.completed) continue;

      if (eventType === 'PUSH' && q.type === 'push_count') {
        q.progress = Math.min(q.target, q.progress + 1);
        if (q.progress >= q.target) q.completed = true;
        stateChanged = true;
      }

      if (eventType === 'LEVEL_CLEARED' && q.type === 'complete_levels') {
        q.progress = Math.min(q.target, q.progress + 1);
        if (q.progress >= q.target) q.completed = true;
        stateChanged = true;
      }

      if (eventType === 'LEVEL_CLEARED' && q.type === 'speed_clear') {
        if (payload.seconds && payload.seconds <= q.target) {
          q.progress = q.target;
          q.completed = true;
          stateChanged = true;
        }
      }

      if (eventType === 'LEVEL_CLEARED' && q.type === 'no_undo') {
        if (payload.undoCount === 0) {
          q.progress = Math.min(q.target, q.progress + 1);
          if (q.progress >= q.target) q.completed = true;
          stateChanged = true;
        }
      }
    }

    return stateChanged;
  }

  /**
   * Claim bounty for completed quest
   * @param {string} questId
   */
  claimReward(questId) {
    const quest = this.activeQuests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) {
      return { success: false, reason: 'Quest not eligible for claim' };
    }

    quest.claimed = true;
    playerStore.addXp(quest.rewardXp);
    soundService.playVictory();

    return { success: true, rewardXp: quest.rewardXp };
  }

  getActiveQuests() {
    return this.activeQuests;
  }
}

export const questManager = new QuestManager();

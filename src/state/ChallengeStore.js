// GitHero Daily Challenge Reactive Store
// Coordinates daily puzzle mission data, timers, objective progression, and rewards.

import { Store } from './Store.js';
import { challengeService } from '../services/challengeService.js';

export class ChallengeStore extends Store {
  constructor() {
    super({
      activeChallenge: null,
      isLoading: false,
      error: null,
      isCompleted: false,
      claimedReward: false,
      streakDays: 0
    });
  }

  /**
   * Fetch today's authoritative daily challenge from backend service
   */
  async loadTodayChallenge() {
    this.setState({ isLoading: true, error: null });
    try {
      const challenge = await challengeService.getDailyChallenge();
      this.setState({
        activeChallenge: challenge,
        isLoading: false,
        isCompleted: !!challenge?.completed,
        claimedReward: !!challenge?.claimed
      });
      return challenge;
    } catch (err) {
      console.error('[ChallengeStore] Failed to load daily challenge:', err);
      this.setState({ isLoading: false, error: err.message || 'Failed to fetch challenge' });
      return null;
    }
  }

  /**
   * Mark daily challenge completed and claim rewards
   * @param {Object} completionStats 
   */
  async completeAndClaim(completionStats = {}) {
    const active = this.getState().activeChallenge;
    if (!active || this.getState().claimedReward) return;

    try {
      const result = await challengeService.submitChallengeCompletion(active.id, completionStats);
      this.setState({
        isCompleted: true,
        claimedReward: true,
        streakDays: (this.getState().streakDays || 0) + 1
      });
      return result;
    } catch (err) {
      console.error('[ChallengeStore] Submission failed:', err);
      throw err;
    }
  }
}

// Global Challenge Store Singleton
export const challengeStore = new ChallengeStore();

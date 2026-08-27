/**
 * GitHero Daily Challenge Service
 * Provides daily rotated cron challenge missions with live countdown synchronization.
 */

import { MockBackend } from './MockBackend.js';
import { DailyChallengeModel } from '../types/models.js';

export class ChallengeService {
  getDailyChallenge() {
    const raw = MockBackend.getDailyChallenge();
    return new DailyChallengeModel(raw);
  }

  isDailyCompleted() {
    return localStorage.getItem(`githero_daily_${new Date().toISOString().slice(0, 10)}`) === 'completed';
  }

  markDailyCompleted() {
    localStorage.setItem(`githero_daily_${new Date().toISOString().slice(0, 10)}`, 'completed');
  }
}

export const challengeService = new ChallengeService();

/**
 * GitHero Central Reactive App Store
 * Coordinates persistent profile, settings, level progression, and live session state.
 */

import { eventBus, EVENTS } from './eventBus.js';
import { StorageService } from '../services/StorageService.js';
import { themeManager } from '../theme/themeManager.js';

export class AppStore {
  constructor() {
    this.state = StorageService.load();
    this.subscribers = new Set();
    this.activeRoute = 'hero';
    this.activeLevelId = '01';
  }

  init() {
    themeManager.init(this.state.settings);
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state);
      } catch (e) {
        console.error('Error in AppStore subscriber:', e);
      }
    }
  }

  save() {
    StorageService.save(this.state);
    this.notify();
  }

  // Profile Updates
  addXP(amount, reason = '') {
    this.state.player.xp = (this.state.player.xp || 0) + amount;
    this.state.player.level = Math.floor((this.state.player.xp / 1000) + 1);
    this.save();

    eventBus.emit(EVENTS.XP_AWARDED, { amount, total: this.state.player.xp, reason });
    eventBus.emit(EVENTS.TOAST_SHOW, {
      type: 'success',
      title: `+${amount} XP EARNED`,
      message: reason || 'Progress milestone reached!'
    });
  }

  decrementLives() {
    this.state.player.lives = Math.max(0, (this.state.player.lives || 3) - 1);
    this.save();
    return this.state.player.lives;
  }

  restoreLives() {
    this.state.player.lives = 3;
    this.save();
  }

  incrementSquashedBugs() {
    this.state.player.bugsSquashed = (this.state.player.bugsSquashed || 0) + 1;
    this.save();
  }

  // Level Progression
  completeLevel(levelId, stats = {}) {
    const existing = this.state.progress.levels[levelId] || {};
    const stars = Math.max(existing.stars || 0, stats.stars || 1);
    const score = Math.max(existing.score || 0, stats.score || 8000);

    const isFirstTime = !existing.completed;
    if (isFirstTime) {
      this.state.player.completedLevelsCount = (this.state.player.completedLevelsCount || 0) + 1;
      if (stars === 3) {
        this.state.player.perfectClears = (this.state.player.perfectClears || 0) + 1;
      }
    }

    this.state.progress.levels[levelId] = {
      completed: true,
      stars,
      time: stats.time || '01:30',
      moves: stats.moves || 10,
      score
    };

    // Unlock next level
    const nextNum = parseInt(levelId, 10) + 1;
    const nextId = String(nextNum).padStart(2, '0');
    if (!this.state.progress.levels[nextId]) {
      this.state.progress.levels[nextId] = { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 };
    }

    // Award XP
    const xpReward = stats.xpAwarded || (stars * 150);
    this.addXP(xpReward, `Level ${levelId} Completion`);

    this.save();
    eventBus.emit(EVENTS.LEVEL_SOLVED, { levelId, stats, stars, xpReward });
  }

  // Settings
  updateSettings(partialSettings) {
    this.state.settings = { ...this.state.settings, ...partialSettings };
    themeManager.applySettings(this.state.settings);
    this.save();
    eventBus.emit(EVENTS.SETTINGS_CHANGED, this.state.settings);
  }

  // Achievements
  checkAchievement(id, progressIncrement = 1) {
    const ach = this.state.achievements.find(a => a.id === id);
    if (!ach || ach.unlocked) return;

    if (typeof ach.progress === 'number' && ach.maxProgress) {
      ach.progress = Math.min(ach.maxProgress, ach.progress + progressIncrement);
      if (ach.progress >= ach.maxProgress) {
        ach.unlocked = true;
        ach.date = new Date().toLocaleDateString();
        this.addXP(ach.xp, `Achievement: ${ach.title}`);
        eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, ach);
      }
    } else {
      ach.unlocked = true;
      ach.date = new Date().toLocaleDateString();
      this.addXP(ach.xp, `Achievement: ${ach.title}`);
      eventBus.emit(EVENTS.ACHIEVEMENT_UNLOCKED, ach);
    }
    this.save();
  }
}

export const appStore = new AppStore();

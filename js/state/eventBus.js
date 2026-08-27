/**
 * GitHero Decoupled Event Bus
 * Facilitates pub/sub communication across UI components, CLI, and Game Engine.
 */

export const EVENTS = {
  // Navigation & Route
  ROUTE_CHANGED: 'route_changed',

  // Game Lifecycle & Turn Events
  GAME_STARTED: 'game_started',
  PLAYER_MOVED: 'player_moved',
  OBJECT_PUSHED: 'object_pushed',
  OBJECT_PULLED: 'object_pulled',
  GATE_TOGGLED: 'gate_toggled',
  SWITCH_TRIGGERED: 'switch_triggered',
  HAZARD_HIT: 'hazard_hit',
  CHECKPOINT_REACHED: 'checkpoint_reached',
  OBJECTIVE_UPDATED: 'objective_updated',
  LEVEL_SOLVED: 'level_solved',
  LEVEL_FAILED: 'level_failed',

  // CLI & Terminal
  COMMAND_EXECUTED: 'command_executed',
  TERMINAL_CLEARED: 'terminal_cleared',
  LOG_APPENDED: 'log_appended',

  // Progression & Rewards
  XP_AWARDED: 'xp_awarded',
  STARS_EARNED: 'stars_earned',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  STREAK_INCREMENTED: 'streak_incremented',

  // Settings & Theme
  SETTINGS_CHANGED: 'settings_changed',
  THEME_CHANGED: 'theme_changed',

  // Notifications
  TOAST_SHOW: 'toast_show'
};

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  once(event, callback) {
    const unbind = this.on(event, (...args) => {
      unbind();
      callback(...args);
    });
    return unbind;
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, payload = {}) {
    if (this.listeners.has(event)) {
      for (const callback of this.listeners.get(event)) {
        try {
          callback(payload);
        } catch (e) {
          console.error(`Error in EventBus listener for "${event}":`, e);
        }
      }
    }
  }

  clear() {
    this.listeners.clear();
  }
}

export const eventBus = new EventBus();

/**
 * GitQuest Reactive State: Domain Specific Stores
 */

import { Store } from './Store.js';

export class AuthStore extends Store {
  constructor() {
    super({
      isAuthenticated: false,
      user: null,
      profile: null,
      token: null,
      isLoading: false,
      error: null
    });
  }

  setAuthenticated(user, profile, token) {
    this.setState({
      isAuthenticated: true,
      user,
      profile,
      token,
      isLoading: false,
      error: null
    });
  }

  setUnauthenticated(error = null) {
    this.setState({
      isAuthenticated: false,
      user: null,
      profile: null,
      token: null,
      isLoading: false,
      error
    });
  }

  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  setError(error) {
    this.setState({ error, isLoading: false });
  }
}

export class PlayerStore extends Store {
  constructor() {
    super({
      xp: 0,
      level: 1,
      title: 'Novice Contributor',
      completedCount: 0,
      perfectClears: 0,
      streak: 1,
      commandUsage: {}
    });
  }

  updateProfile(profile) {
    if (!profile) return;
    this.setState({
      xp: profile.xp ?? this.state.xp,
      level: profile.level ?? this.state.level,
      title: profile.title ?? this.state.title,
      completedCount: profile.completedLevelsCount ?? this.state.completedCount,
      perfectClears: profile.perfectClears ?? this.state.perfectClears,
      streak: profile.streak ?? this.state.streak,
      commandUsage: profile.commandUsage ?? this.state.commandUsage
    });
  }

  addXP(amount) {
    this.setState(s => ({ xp: s.xp + Number(amount) }));
  }
}

export class GameStore extends Store {
  constructor() {
    super({
      levelId: '01',
      sessionId: null,
      moves: 0,
      pushCount: 0,
      pullCount: 0,
      statusCount: 0,
      commandsCount: 0,
      elapsedSeconds: 0,
      isGoalReached: false,
      isCommitted: false,
      score: 0,
      status: 'IDLE'
    });
  }

  resetLevel(levelId) {
    this.setState({
      levelId,
      sessionId: null,
      moves: 0,
      pushCount: 0,
      pullCount: 0,
      statusCount: 0,
      commandsCount: 0,
      elapsedSeconds: 0,
      isGoalReached: false,
      isCommitted: false,
      score: 0,
      status: 'ACTIVE'
    });
  }
}

export class LevelStore extends Store {
  constructor() {
    super({
      levels: [],
      progressMap: {},
      selectedWorld: 0,
      activeLevelId: '01',
      isLoading: false
    });
  }

  setLevels(levels) {
    const map = {};
    for (const lvl of levels) {
      map[lvl.id] = lvl.status;
    }
    this.setState({ levels, progressMap: map, isLoading: false });
  }

  setSelectedWorld(world) {
    this.setState({ selectedWorld: Number(world) || 0 });
  }
}

export class UIStore extends Store {
  constructor() {
    super({
      currentRoute: 'hero',
      activeModal: null,
      isMobileMenuOpen: false,
      isSidebarOpen: true
    });
  }

  setRoute(currentRoute) {
    this.setState({ currentRoute, isMobileMenuOpen: false });
  }

  openModal(modalId) {
    this.setState({ activeModal: modalId });
  }

  closeModal() {
    this.setState({ activeModal: null });
  }
}

export class NotificationStore extends Store {
  constructor() {
    super({
      notifications: []
    });
  }

  addNotification(title, message, severity = 'info', durationMs = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const item = { id, title, message, severity, durationMs };
    this.setState(s => ({ notifications: [...s.notifications, item] }));
    if (durationMs > 0) {
      setTimeout(() => this.removeNotification(id), durationMs);
    }
    return id;
  }

  removeNotification(id) {
    this.setState(s => ({ notifications: s.notifications.filter(n => n.id !== id) }));
  }
}

export const authStore = new AuthStore();
export const playerStore = new PlayerStore();
export const gameStore = new GameStore();
export const levelStore = new LevelStore();
export const uiStore = new UIStore();
export const notificationStore = new NotificationStore();

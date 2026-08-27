// StorageService: local state persistence for player profile, levels, settings, and progress

const STORAGE_KEY = 'gitquest_user_state_v2';
const AUTH_STORAGE_KEY = 'githero_registered_user';

const DEFAULT_STATE = {
  player: {
    username: '@cyber_ninja',
    title: 'Grandmaster',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8',
    xp: 14500,
    lives: 3,
    completedLevelsCount: 128,
    perfectClears: 84,
    bugsSquashed: 404,
    commandUsage: {
      'git commit': 85,
      'git push': 65,
      'git switch': 40,
      'git status': 95,
      'git pull': 35
    }
  },
  progress: {
    currentWorld: 2,
    currentLevelId: '07',
    levels: {
      '01': { completed: true, stars: 3, time: '01:12', moves: 6, score: 9900 },
      '02': { completed: true, stars: 3, time: '01:45', moves: 8, score: 9800 },
      '03': { completed: true, stars: 3, time: '02:01', moves: 11, score: 9650 },
      '04': { completed: true, stars: 3, time: '01:50', moves: 9, score: 9750 },
      '05': { completed: true, stars: 2, time: '02:30', moves: 14, score: 8900 },
      '06': { completed: true, stars: 3, time: '02:15', moves: 12, score: 9400 },
      '07': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '08': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '09': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '10': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '11': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '12': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '13': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '14': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '15': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 },
      '16': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 }
    }
  },
  settings: {
    language: 'English (US)',
    theme: 'Terminal (Dark)',
    soundEffects: true,
    backgroundMusic: true,
    volume: 70,
    crtFilter: false,
    screenShake: true,
    highContrast: false,
    largeTerminalFont: false,
    vimKeybindings: false
  },
  achievements: [
    { id: 'first_commit', title: 'FIRST COMMIT', desc: 'Complete your first level.', icon: 'emoji_events', xp: 100, unlocked: true, date: '01/05/2024' },
    { id: 'push_master', title: 'PUSH MASTER', desc: 'Complete a level using only push commands.', icon: 'upload', xp: 250, unlocked: true, date: '12/05/2024' },
    { id: 'status_check', title: 'STATUS CHECK', desc: 'Use git status 100 times.', icon: 'find_in_page', xp: 150, unlocked: true, date: '15/05/2024' },
    { id: 'merge_survivor', title: 'MERGE CONFLICT SURVIVOR', desc: 'Resolve 10 merge conflicts without reverting.', icon: 'call_merge', xp: 500, unlocked: false, progress: 3, maxProgress: 10 },
    { id: 'branch_weaver', title: 'BRANCH WEAVER', desc: 'Create 5 distinct branches in a single challenge.', icon: 'alt_route', xp: 300, unlocked: false, progress: 2, maxProgress: 5 },
    { id: 'speed_demon', title: 'SPEED DEMON', desc: 'Complete Level 07 under 90 seconds.', icon: 'speed', xp: 400, unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'grandmaster', title: 'GIT GRANDMASTER', desc: 'Reach 20,000 XP and clear all 5 Worlds.', icon: 'military_tech', xp: 1000, unlocked: false, progress: 14500, maxProgress: 20000 }
  ]
};

export class StorageService {
  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService load failed, using defaults', e);
    }
    return DEFAULT_STATE;
  }

  static save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('StorageService save failed', e);
    }
  }

  static completeLevel(levelId, stats) {
    const state = this.load();
    const existing = state.progress.levels[levelId] || {};
    
    // Update level
    state.progress.levels[levelId] = {
      completed: true,
      stars: Math.max(existing.stars || 0, stats.stars || 1),
      time: stats.time,
      moves: stats.moves,
      score: Math.max(existing.score || 0, stats.score || 8000)
    };

    // Add XP
    state.player.xp += stats.xpAwarded || 500;
    state.player.completedLevelsCount = Object.values(state.progress.levels).filter(l => l.completed).length;

    // Check next level unlock
    const numId = parseInt(levelId, 10);
    const nextId = String(numId + 1).padStart(2, '0');
    if (state.progress.levels[nextId] !== undefined) {
      state.progress.currentLevelId = nextId;
    }

    // Save
    this.save(state);
    return state;
  }

  static updateCommandUsage(cmdName) {
    const state = this.load();
    if (!state.player.commandUsage[cmdName]) {
      state.player.commandUsage[cmdName] = 0;
    }
    state.player.commandUsage[cmdName]++;
    this.save(state);
  }

  static updateSettings(settings) {
    const state = this.load();
    state.settings = { ...state.settings, ...settings };
    this.save(state);
    return state.settings;
  }

  static getRegisteredUser() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('StorageService getRegisteredUser failed', e);
      return null;
    }
  }

  static setRegisteredUser(userData) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (e) {
      console.warn('StorageService setRegisteredUser failed', e);
      return false;
    }
  }

  static clearRegisteredUser() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return true;
    } catch (e) {
      console.warn('StorageService clearRegisteredUser failed', e);
      return false;
    }
  }
}

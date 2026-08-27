/**
 * StorageService: local state persistence for player profile, levels, settings, and progress.
 * Supports backward-compatible migration from legacy keys.
 */

const STORAGE_KEY = 'githero_user_state_v2';
const LEGACY_STORAGE_KEY = 'gitquest_user_state_v2';

export const DEFAULT_STATE = {
  player: {
    username: '@cyber_ninja',
    title: 'Grandmaster',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8',
    xp: 14500,
    lives: 3,
    completedLevelsCount: 128,
    perfectClears: 84,
    bugsSquashed: 404,
    streakDays: 5,
    lastActiveDate: new Date().toISOString(),
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
      '07': { completed: false, stars: 0, time: '--:--', moves: 0, score: 0 }
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
    { id: 'first_commit', title: 'FIRST COMMIT', desc: 'Complete your first level.', category: 'general', icon: 'emoji_events', xp: 100, unlocked: true, date: '01/05/2024' },
    { id: 'push_master', title: 'PUSH MASTER', desc: 'Complete a level using only push commands.', category: 'commands', icon: 'upload', xp: 250, unlocked: true, date: '12/05/2024' },
    { id: 'status_check', title: 'STATUS CHECK', desc: 'Use git status 100 times.', category: 'commands', icon: 'find_in_page', xp: 150, unlocked: true, date: '15/05/2024' },
    { id: 'merge_survivor', title: 'MERGE CONFLICT SURVIVOR', desc: 'Resolve 10 merge conflicts without reverting.', category: 'puzzles', icon: 'call_merge', xp: 500, unlocked: false, progress: 3, maxProgress: 10 },
    { id: 'branch_weaver', title: 'BRANCH WEAVER', desc: 'Create 5 distinct branches in a single challenge.', category: 'puzzles', icon: 'alt_route', xp: 300, unlocked: false, progress: 2, maxProgress: 5 },
    { id: 'speed_demon', title: 'SPEED DEMON', desc: 'Complete Level 07 under 90 seconds.', category: 'masteries', icon: 'speed', xp: 400, unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'grandmaster', title: 'GIT GRANDMASTER', desc: 'Reach 20,000 XP and clear all 6 Worlds.', category: 'masteries', icon: 'military_tech', xp: 1000, unlocked: false, progress: 14500, maxProgress: 20000 }
  ]
};

export class StorageService {
  static load() {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (data) {
          return JSON.parse(data);
        }
      }
    } catch (e) {
      console.warn('StorageService load failed, using defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  static save(state) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    } catch (e) {
      console.warn('StorageService save failed', e);
    }
  }

  static updateCommandUsage(cmdName) {
    const state = this.load();
    if (!state.player.commandUsage) {
      state.player.commandUsage = {};
    }
    state.player.commandUsage[cmdName] = (state.player.commandUsage[cmdName] || 0) + 1;
    this.save(state);
  }

  static reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

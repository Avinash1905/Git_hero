/**
 * GitHero Structured Data Models & Type Validation Helpers
 * Provides formal schemas and validation for User, Profile, Level, Command, Progression, etc.
 */

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || 'usr_' + Math.random().toString(36).substring(2, 9);
    this.username = data.username || '@cyber_ninja';
    this.email = data.email || 'player@githero.io';
    this.title = data.title || 'Grandmaster';
    this.avatar = data.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDen8Ka6duWuOF49zomdOYJ9-ic1S5o3YZpY76w7FAQp9GClFjyr0FHXVqgL4BZNZyDGalfCuM-CRTzu7ShV25X9df5ELG9Rjs3882nQIBC9SlDr7NESJYJliBNYllx0ivxXVhfO3txoyNS5yoXGREsA-S6EX_3pe1KOQ8pwiiKWrijza0hAljYNTuHZI1TrGAHxTQkCckb4nkrv5x4xhh_WtqfSKZltzFIPEKq_UQ6AITIerEjNe8';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

export class PlayerProfileModel {
  constructor(data = {}) {
    this.xp = data.xp || 14500;
    this.level = data.level || Math.floor((this.xp / 1000) + 1);
    this.lives = typeof data.lives === 'number' ? data.lives : 3;
    this.completedLevelsCount = data.completedLevelsCount || 0;
    this.perfectClears = data.perfectClears || 0;
    this.bugsSquashed = data.bugsSquashed || 404;
    this.streakDays = data.streakDays || 5;
    this.lastActiveDate = data.lastActiveDate || new Date().toISOString();
    this.commandUsage = data.commandUsage || {
      'git commit': 85,
      'git push': 65,
      'git switch': 40,
      'git status': 95,
      'git pull': 35
    };
  }
}

export class LevelProgressModel {
  constructor(data = {}) {
    this.completed = !!data.completed;
    this.stars = data.stars || 0;
    this.time = data.time || '--:--';
    this.moves = data.moves || 0;
    this.score = data.score || 0;
    this.attempts = data.attempts || 0;
    this.bestScore = data.bestScore || 0;
  }
}

export class CommandResultModel {
  constructor(data = {}) {
    this.success = !!data.success;
    this.type = data.type || 'output'; // 'output', 'status', 'push', 'pull', 'commit', 'error', 'switch'
    this.text = data.text || '';
    this.detail = data.detail || '';
    this.result = data.result || '';
    this.branch = data.branch || '';
    this.objective = data.objective || '';
    this.boxStatus = data.boxStatus || '';
    this.progress = data.progress || '';
    this.timestamp = data.timestamp || new Date().toLocaleTimeString();
    this.error = data.error || null;
  }
}

export class AchievementModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.desc = data.desc || '';
    this.category = data.category || 'general'; // 'general', 'puzzles', 'commands', 'masteries'
    this.icon = data.icon || 'emoji_events';
    this.xp = data.xp || 100;
    this.unlocked = !!data.unlocked;
    this.progress = data.progress || 0;
    this.maxProgress = data.maxProgress || 1;
    this.date = data.date || '';
  }
}

export class LeaderboardEntryModel {
  constructor(data = {}) {
    this.rank = data.rank || 0;
    this.handle = data.handle || '@player';
    this.title = data.title || 'Novice';
    this.xp = data.xp || '0';
    this.levels = data.levels || 0;
    this.score = data.score || '0';
    this.isUser = !!data.isUser;
    this.avatar = data.avatar || '';
  }
}

export class DailyChallengeModel {
  constructor(data = {}) {
    this.id = data.id || 'daily_' + new Date().toISOString().slice(0, 10);
    this.title = data.title || 'Memory Leak';
    this.difficulty = data.difficulty || 'HARD';
    this.description = data.description || '';
    this.rewardXP = data.rewardXP || 1000;
    this.rewardItems = data.rewardItems || ['Exclusive Cyber Avatar', 'Memory Sanitizer Badge'];
    this.timeRemaining = data.timeRemaining || '14:23:59';
    this.gridSize = data.gridSize || '8x8';
    this.completed = !!data.completed;
  }
}

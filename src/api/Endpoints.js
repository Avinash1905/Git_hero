/**
 * GitQuest API Endpoints Constants
 */

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },

  // Player Profile & Stats
  PLAYER: {
    PROFILE: '/api/player/profile',
    UPDATE_PROFILE: '/api/player/profile',
    UPDATE_SETTINGS: '/api/player/settings',
    STATS: '/api/player/stats'
  },

  // 250 Levels
  LEVELS: {
    LIST: '/api/levels',
    DETAIL: (id) => `/api/levels/${id}`,
    CHECK_ACCESS: (id) => `/api/levels/${id}/access`
  },

  // Gameplay Sessions
  GAME: {
    START_SESSION: '/api/game/session/start',
    TELEMETRY: '/api/game/session/telemetry',
    COMPLETE_SESSION: '/api/game/session/complete',
    REPLAY: (sessionId) => `/api/game/session/${sessionId}/replay`
  },

  // Progression
  PROGRESS: {
    GET: '/api/progress',
    SAVE: '/api/progress/save',
    SUMMARY: '/api/progress/summary'
  },

  // Leaderboard
  LEADERBOARD: {
    GLOBAL: '/api/leaderboard/global',
    WEEKLY: '/api/leaderboard/weekly',
    FRIENDS: '/api/leaderboard/friends',
    PLAYER_RANK: '/api/leaderboard/me'
  },

  // Achievements
  ACHIEVEMENTS: {
    LIST: '/api/achievements',
    USER_PROGRESS: '/api/achievements/user',
    CLAIM: (id) => `/api/achievements/${id}/claim`
  },

  // Daily Challenge
  CHALLENGES: {
    TODAY: '/api/challenges/today',
    COMPLETE: '/api/challenges/complete',
    HISTORY: '/api/challenges/history'
  }
};

/**
 * GitQuest Type Definitions - Authentication & User Session
 */

/**
 * @typedef {Object} UserCredentials
 * @property {string} username - Unique handle prefixed with @
 * @property {string} email - Valid user email address
 * @property {string} password - Raw user password
 */

/**
 * @typedef {Object} AuthenticatedUser
 * @property {string} id - Unique UUID of user
 * @property {string} username - User handle
 * @property {string} email - Email address
 * @property {string} createdAt - ISO timestamp of account creation
 * @property {string} [lastLogin] - ISO timestamp of last successful login
 * @property {boolean} isActive - Status flag
 */

/**
 * @typedef {Object} PlayerProfileData
 * @property {string} userId - Reference to user UUID
 * @property {string} avatarUrl - URL of player avatar
 * @property {string} title - Player tier title
 * @property {number} level - Current player level (1..100)
 * @property {number} xp - Current accumulated experience points
 * @property {number} lives - Remaining hearts/lives
 * @property {number} streakDays - Active daily challenge streak
 * @property {string} lastActiveDate - YYYY-MM-DD date of last action
 * @property {Record<string, number>} commandUsage - Frequency of each Git command
 * @property {ClientSettings} settings - Player configuration preferences
 */

/**
 * @typedef {Object} ClientSettings
 * @property {boolean} soundEffects - Toggle SFX playback
 * @property {boolean} backgroundMusic - Toggle background ambient audio
 * @property {number} volume - Master volume percentage (0..100)
 * @property {string} language - Locale string (e.g. 'English (US)')
 * @property {string} theme - UI theme code
 * @property {boolean} [crtFilter] - Retro CRT overlay toggle
 * @property {boolean} [screenShake] - Tactical screen shake toggle
 * @property {boolean} [highContrast] - Accessibility high contrast
 * @property {boolean} [largeTerminalFont] - Accessibility larger CLI font
 * @property {boolean} [vimKeybindings] - Alternate modal editor keys
 */

/**
 * @typedef {Object} AuthSessionState
 * @property {boolean} isAuthenticated - Whether a valid JWT token exists
 * @property {AuthenticatedUser|null} user - Current user object
 * @property {PlayerProfileData|null} profile - Current player profile
 * @property {string|null} token - JWT Bearer token string
 * @property {string|null} error - Last auth error message
 * @property {boolean} isLoading - Loading state during async auth dispatch
 */

export const AuthRole = Object.freeze({
  GUEST: 'GUEST',
  PLAYER: 'PLAYER',
  CONTRIBUTOR: 'CONTRIBUTOR',
  MAINTAINER: 'MAINTAINER',
  ADMIN: 'ADMIN'
});

export const SessionStatus = Object.freeze({
  IDLE: 'IDLE',
  AUTHENTICATING: 'AUTHENTICATING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  EXPIRED: 'EXPIRED'
});

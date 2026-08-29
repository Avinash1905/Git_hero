/**
 * GitQuest Type Definitions - UI Navigation & Visual Presentation
 */

/**
 * @typedef {'hero' | 'login' | 'register' | 'forgot-password' | 'reset-password' | 'dashboard' | 'world-map' | 'levels' | 'gameplay' | 'profile' | 'leaderboard' | 'achievements' | 'daily' | 'settings' | 'editor' | 'manual'} AppRoute
 */

export const AppRoutes = Object.freeze({
  HERO: 'hero',
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  DASHBOARD: 'dashboard',
  WORLD_MAP: 'world-map',
  LEVELS: 'levels',
  GAMEPLAY: 'gameplay',
  PROFILE: 'profile',
  LEADERBOARD: 'leaderboard',
  ACHIEVEMENTS: 'achievements',
  DAILY: 'daily',
  SETTINGS: 'settings',
  EDITOR: 'editor',
  MANUAL: 'manual'
});

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastSeverity
 */

export const ToastSeverity = Object.freeze({
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
});

/**
 * @typedef {Object} ToastNotification
 * @property {string} id - Unique notification ID
 * @property {string} title - Toast headline
 * @property {string} message - Notification details
 * @property {ToastSeverity} severity - Alert category
 * @property {number} durationMs - Auto-dismiss timeout
 */

/**
 * @typedef {Object} ModalConfig
 * @property {string} id - Modal identifier
 * @property {string} title - Modal header title
 * @property {string} [bodyHtml] - Inner HTML payload
 * @property {boolean} isClosable - Whether ESC / backdrop clicks dismiss
 * @property {() => void} [onClose] - Close callback
 */

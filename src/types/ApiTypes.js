/**
 * GitQuest Type Definitions - API Request & Response Contracts
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Operation success flag
 * @property {string} [error] - Human-readable error message
 * @property {string} [message] - Operational message
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} usernameOrEmail - Handle or registered email
 * @property {string} password - Raw password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} username - Unique handle
 * @property {string} email - Valid email address
 * @property {string} password - Raw password (min 6 chars)
 */

/**
 * @typedef {Object} StartGameSessionRequest
 * @property {string} levelId - Level ID to begin
 */

/**
 * @typedef {Object} CompleteGameSessionRequest
 * @property {string} [sessionId] - Active session UUID
 * @property {string} levelId - Target level ID
 * @property {number} moves - Total moves taken
 * @property {number} timeSeconds - Elapsed time in seconds
 * @property {number} commandsCount - Number of commands typed
 * @property {number} pushCount - Number of pushes executed
 * @property {number} pullCount - Number of pulls executed
 * @property {Array<{ x: number, y: number }>} [history] - Path history
 * @property {Record<string, number>} [commandUsage] - Command usage frequencies
 */

/**
 * @typedef {Object} CompleteGameSessionResponse
 * @property {boolean} success - Completion validity
 * @property {string} levelId - Completed level ID
 * @property {string|null} nextLevelId - Next sequentially unlocked level ID
 * @property {number} stars - Stars earned (1..3)
 * @property {number} score - Verified score
 * @property {number} xpAwarded - Verified XP awarded
 * @property {number} totalXp - New player total XP
 * @property {number} playerLevel - New player tier level
 * @property {string} playerTitle - New player rank title
 * @property {boolean} isFirstClear - Whether this was the first completion
 * @property {Object[]} newlyUnlockedAchievements - Achievements unlocked on this clear
 */

/**
 * @typedef {Object} LeaderboardItem
 * @property {number} rank - Leaderboard placement rank
 * @property {string} handle - Player handle with @ prefix
 * @property {string} title - Player tier title
 * @property {string} xp - Formatted XP string
 * @property {number} rawXp - Raw numeric XP
 * @property {number} levels - Number of completed levels
 * @property {string} score - Formatted total score
 * @property {number} rawScore - Raw numeric total score
 * @property {string} avatar - Avatar image URL
 * @property {boolean} isUser - Whether this entry belongs to the current user
 */

/**
 * @typedef {Object} AchievementItem
 * @property {string} id - Achievement ID key
 * @property {string} code - Achievement enum code
 * @property {string} title - Display title
 * @property {string} desc - Description criteria
 * @property {string} icon - Google Material Symbol icon name
 * @property {number} xp - XP reward
 * @property {boolean} unlocked - Whether currently unlocked for player
 * @property {number} progress - Current progress counter
 * @property {number} maxProgress - Target progress counter
 * @property {string|null} date - Formatted date string of unlock
 */

/**
 * @typedef {Object} DailyChallengeData
 * @property {string} date - YYYY-MM-DD challenge date
 * @property {string} title - Challenge mission name
 * @property {string} description - Briefing lore
 * @property {string} difficulty - Difficulty tier
 * @property {number} rewardXP - Bonus XP for completion
 * @property {string} gridSize - Grid dimensions string
 * @property {string} timeRemaining - HH:MM:SS string
 * @property {boolean} isCompleted - Whether completed today
 * @property {Object} config - Embedded level geometry and obstacles
 */

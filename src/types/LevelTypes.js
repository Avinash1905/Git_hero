/**
 * GitQuest Type Definitions - Level System & 250 Handcrafted Levels
 */

/**
 * @typedef {'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MASTER' | 'GRANDMASTER' | 'BOSS'} LevelDifficulty
 */

export const DifficultyLevel = Object.freeze({
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EXPERT: 'EXPERT',
  MASTER: 'MASTER',
  GRANDMASTER: 'GRANDMASTER',
  BOSS: 'BOSS'
});

/**
 * @typedef {'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED'} LevelStatus
 */

export const LevelStatus = Object.freeze({
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
});

/**
 * @typedef {Object} LevelDefinitionRaw
 * @property {string} id - Formatted 2-digit string ID (e.g. '01'..'250')
 * @property {number} [number] - Sequential numeric index (1..250)
 * @property {string} name - Human-readable challenge name
 * @property {number} world - World chapter index (1..20)
 * @property {LevelDifficulty} difficulty - Difficulty tier
 * @property {number} [stars] - Max earnable stars
 * @property {number} [xpReward] - Experience reward for completion
 * @property {number} [commitsReq] - Target par commits / moves factor
 * @property {string} description - Briefing description
 * @property {string[]} [objectives] - List of objective milestones
 * @property {string} [hint] - Tactical hint for terminal/movement
 * @property {number} [gridSize] - Square dimension of grid (e.g. 6, 8, 10, 12, 16, 24, 36)
 * @property {number} [width] - Explicit grid width
 * @property {number} [height] - Explicit grid height
 * @property {{ x: number, y: number }} player - Initial player start coordinates
 * @property {{ x: number, y: number }} box - Initial box payload coordinates
 * @property {{ x: number, y: number }} goal - Destination goal coordinates
 * @property {{ x: number, y: number }[]} [walls] - Wall obstacle coordinates
 * @property {{ x: number, y: number }[]} [hazards] - Hazard coordinates
 * @property {Object[]} [switches] - Pressure switch gates
 * @property {Object[]} [portals] - Teleport portal networks
 * @property {Object[]} [mirrors] - Laser reflection mirrors
 * @property {Object[]} [lasers] - Laser emitter relays
 */

/**
 * @typedef {Object} LevelProgressModel
 * @property {string} levelId - Level ID
 * @property {LevelStatus} status - Unlock and clear status
 * @property {number} stars - Stars earned (0..3)
 * @property {number} bestScore - Highest score recorded
 * @property {number} bestMoves - Fewest moves taken
 * @property {number} bestTimeSec - Best elapsed time in seconds
 * @property {number} commandsUsed - Total commands executed
 * @property {string} [completedAt] - ISO timestamp
 */

/**
 * @typedef {Object} WorldMetadata
 * @property {number} worldNumber - World chapter index (1..20)
 * @property {string} name - World title (e.g. 'Foundations', 'Branch Valley')
 * @property {string} subtitle - Theme subtitle
 * @property {string} description - Lore description
 * @property {number} startLevel - First level number in world
 * @property {number} endLevel - Final level number in world
 * @property {number} totalLevels - Number of levels in this world
 * @property {string} bannerUrl - Artwork URL for world preview
 */

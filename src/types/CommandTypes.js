/**
 * GitQuest Type Definitions - Terminal & Command Pipeline
 */

/**
 * @typedef {'cmd' | 'output' | 'status' | 'push' | 'pull' | 'commit_success' | 'movement' | 'error' | 'system'} TerminalLogType
 */

export const LogType = Object.freeze({
  CMD: 'cmd',
  OUTPUT: 'output',
  STATUS: 'status',
  PUSH: 'push',
  PULL: 'pull',
  COMMIT_SUCCESS: 'commit_success',
  MOVEMENT: 'movement',
  ERROR: 'error',
  SYSTEM: 'system'
});

/**
 * @typedef {Object} TerminalLogEntry
 * @property {TerminalLogType} type - Category of log message
 * @property {string} [text] - Raw message or error text
 * @property {string} [branch] - Branch name indicator
 * @property {string} [objective] - Current objective description
 * @property {string} [boxStatus] - Goal alignment status string
 * @property {string} [progress] - Percentage progress string
 * @property {string} [detail] - Sub-action description
 * @property {string} [result] - Success result string
 * @property {string} [commitHash] - 7-character hex hash
 * @property {string} [message] - Commit message
 * @property {string} [filesChanged] - Simulated git diff stat
 * @property {number} [timestamp] - Milliseconds epoch
 */

/**
 * @typedef {Object} CommandToken
 * @property {'IDENTIFIER' | 'FLAG' | 'STRING' | 'PIPE' | 'AND' | 'ARGUMENT'} type - Token category
 * @property {string} value - Literal token value
 * @property {number} start - Character index start
 * @property {number} end - Character index end
 */

/**
 * @typedef {Object} ParsedCommandAST
 * @property {string} root - e.g. 'git', 'clear', 'undo', 'help'
 * @property {string} subcommand - e.g. 'status', 'push', 'pull', 'commit', 'left', 'switch'
 * @property {string[]} args - Positional arguments
 * @property {Record<string, string|boolean>} flags - Extracted flags (e.g. { m: "commit msg", hard: true })
 * @property {ParsedCommandAST|null} [chained] - Next command in && pipeline
 */

/**
 * @typedef {Object} CommandExecutionResult
 * @property {boolean} success - Whether command executed successfully
 * @property {string} [command] - Normalized command string
 * @property {string} [message] - Response feedback message
 * @property {Object} [stateChanges] - Delta of game state mutations
 * @property {Object} [objectiveChanges] - Updated objective states
 * @property {number} [xpEarned] - Experience points awarded
 * @property {string} [error] - Error string if unsuccessful
 */

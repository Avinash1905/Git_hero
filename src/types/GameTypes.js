/**
 * GitQuest Type Definitions - Core Game Engine & Spatial Coordinate Systems
 */

/**
 * @typedef {Object} Vector2D
 * @property {number} x - Horizontal tile or pixel coordinate
 * @property {number} y - Vertical tile or pixel coordinate
 */

/**
 * @typedef {'up' | 'down' | 'left' | 'right'} DirectionString
 */

export const Direction = Object.freeze({
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  NONE: 'none'
});

export const DirectionVectors = Object.freeze({
  [Direction.UP]: Object.freeze({ x: 0, y: -1 }),
  [Direction.DOWN]: Object.freeze({ x: 0, y: 1 }),
  [Direction.LEFT]: Object.freeze({ x: -1, y: 0 }),
  [Direction.RIGHT]: Object.freeze({ x: 1, y: 0 }),
  [Direction.NONE]: Object.freeze({ x: 0, y: 0 })
});

/**
 * @typedef {'player' | 'box' | 'goal' | 'wall' | 'hazard' | 'gate' | 'switch' | 'portal' | 'drone'} EntityType
 */

export const EntityTypes = Object.freeze({
  PLAYER: 'player',
  BOX: 'box',
  GOAL: 'goal',
  WALL: 'wall',
  HAZARD: 'hazard',
  GATE: 'gate',
  SWITCH: 'switch',
  PORTAL: 'portal',
  DRONE: 'drone',
  MIRROR: 'mirror',
  LASER_EMITTER: 'laser_emitter',
  RECEPTOR: 'receptor'
});

/**
 * @typedef {Object} MoveResult
 * @property {boolean} success - Whether movement was accepted
 * @property {boolean} [pushed] - Whether a box was pushed forward
 * @property {boolean} [pulled] - Whether an object was pulled backward
 * @property {string} [direction] - Movement direction vector
 * @property {boolean} [onGoal] - Whether box is now resting on the goal tile
 * @property {string} [reason] - Rejection diagnostic code
 * @property {Vector2D} [from] - Previous coordinate
 * @property {Vector2D} [to] - New coordinate
 */

/**
 * @typedef {Object} GameEngineSnapshot
 * @property {string} levelId - ID of active level (e.g. '07')
 * @property {Vector2D} playerPosition - Player spatial coordinate
 * @property {DirectionString} playerDirection - Player facing orientation
 * @property {Vector2D} boxPosition - Primary payload box coordinate
 * @property {Vector2D} goalPosition - Destination goal coordinate
 * @property {Vector2D[]} walls - List of impassable firewall coordinates
 * @property {Vector2D[]} hazards - List of memory leak hazards
 * @property {number} moves - Cumulative move counter
 * @property {number} pushCount - Cumulative push counter
 * @property {number} pullCount - Cumulative pull counter
 * @property {number} statusCount - Cumulative status check counter
 * @property {number} commandsCount - Cumulative command input counter
 * @property {boolean} isGoalReached - Goal alignment state
 * @property {boolean} isCommitted - Completed level state
 * @property {number} score - Current calculated score
 */

export const GameActionType = Object.freeze({
  MOVE: 'MOVE',
  PUSH: 'PUSH',
  PULL: 'PULL',
  STATUS: 'STATUS',
  COMMIT: 'COMMIT',
  SWITCH_BRANCH: 'SWITCH_BRANCH',
  MERGE: 'MERGE',
  REBASE: 'REBASE',
  STASH: 'STASH',
  CHERRY_PICK: 'CHERRY_PICK',
  DIFF: 'DIFF',
  LOG: 'LOG',
  UNDO: 'UNDO',
  RESET: 'RESET'
});

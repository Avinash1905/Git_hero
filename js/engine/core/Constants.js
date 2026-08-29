/**
 * GitQuest Engine - Core Constants
 * Centralized enumerations, tokens, event names, and configuration defaults.
 */

export const EngineVersion = '2.4.0';

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

export const OpposingDirections = Object.freeze({
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
  [Direction.NONE]: Direction.NONE
});

export const TileType = Object.freeze({
  EMPTY: 'empty',
  FLOOR: 'floor',
  WALL: 'wall',
  WALL_BREAKABLE: 'wall_breakable',
  HAZARD: 'hazard',
  HAZARD_LASER: 'hazard_laser',
  HAZARD_CONFLICT: 'hazard_conflict',
  CORRIDOR: 'corridor',
  DOOR_FRAME: 'door_frame',
  VOID: 'void',
  PORTAL_PAD: 'portal_pad',
  TERMINAL_ZONE: 'terminal_zone'
});

export const EntityType = Object.freeze({
  PLAYER: 'player',
  WALL: 'wall',
  DOOR: 'door',
  LOCKED_DOOR: 'locked_door',
  GATE: 'gate',
  CRATE: 'crate',
  PUSHABLE: 'pushable',
  PULLABLE: 'pullable',
  SWITCH: 'switch',
  PRESSURE_PLATE: 'pressure_plate',
  KEY: 'key',
  PORTAL: 'portal',
  CHECKPOINT: 'checkpoint',
  EXIT: 'exit',
  GOAL: 'goal',
  GIT_REPOSITORY: 'git_repository',
  BRANCH_NODE: 'branch_node',
  COMMIT_NODE: 'commit_node',
  REMOTE_NODE: 'remote_node',
  CONFLICT_NODE: 'conflict_node',
  OBJECTIVE_MARKER: 'objective_marker',
  HAZARD: 'hazard',
  MOVING_OBSTACLE: 'moving_obstacle',
  WIRE: 'wire',
  TERMINAL_RELAY: 'terminal_relay',
  CHERRY_PICK_NODE: 'cherry_pick_node',
  STASH_CONTAINER: 'stash_container',
  REBASE_SLOT: 'rebase_slot'
});

export const EntityLayer = Object.freeze({
  TERRAIN: 0,
  FLOOR_MARKINGS: 1,
  CIRCUITS: 2,
  ITEMS: 3,
  OBSTACLES: 4,
  ACTORS: 5,
  EFFECTS: 6,
  OVERLAY: 7
});

export const GameEvent = Object.freeze({
  // Engine Lifecycle
  ENGINE_INITIALIZED: 'engine:initialized',
  ENGINE_TICK: 'engine:tick',
  ENGINE_RESET: 'engine:reset',
  ENGINE_PAUSED: 'engine:paused',
  ENGINE_RESUMED: 'engine:resumed',

  // Player Actions
  PLAYER_MOVED: 'player:moved',
  PLAYER_MOVE_BLOCKED: 'player:move_blocked',
  PLAYER_FACING_CHANGED: 'player:facing_changed',
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_HEALED: 'player:healed',
  PLAYER_RESPAWNED: 'player:respawned',
  PLAYER_TELEPORTED: 'player:teleported',

  // Entity Physics & Interactions
  OBJECT_PUSHED: 'object:pushed',
  OBJECT_PUSH_FAILED: 'object:push_failed',
  OBJECT_PULLED: 'object:pulled',
  OBJECT_PULL_FAILED: 'object:pull_failed',
  OBJECT_PLACED_ON_GOAL: 'object:placed_on_goal',
  OBJECT_REMOVED_FROM_GOAL: 'object:removed_from_goal',
  OBJECT_DESTROYED: 'object:destroyed',

  // Interactive Mechanisms
  SWITCH_TOGGLED: 'switch:toggled',
  SWITCH_ACTIVATED: 'switch:activated',
  SWITCH_DEACTIVATED: 'switch:deactivated',
  PRESSURE_PLATE_PRESSED: 'pressure_plate:pressed',
  PRESSURE_PLATE_RELEASED: 'pressure_plate:released',
  DOOR_UNLOCKED: 'door:unlocked',
  DOOR_OPENED: 'door:opened',
  DOOR_CLOSED: 'door:closed',
  KEY_COLLECTED: 'key:collected',
  CIRCUIT_POWERED: 'circuit:powered',
  CIRCUIT_UNPOWERED: 'circuit:unpowered',
  PORTAL_ENTERED: 'portal:entered',

  // Git Specific Mechanics
  GIT_STATUS_CHECKED: 'git:status_checked',
  GIT_PUSH_EXECUTED: 'git:push_executed',
  GIT_PULL_EXECUTED: 'git:pull_executed',
  GIT_COMMIT_EXECUTED: 'git:commit_executed',
  GIT_SWITCH_EXECUTED: 'git:switch_executed',
  GIT_BRANCH_CREATED: 'git:branch_created',
  GIT_BRANCH_DELETED: 'git:branch_deleted',
  GIT_MERGE_ATTEMPTED: 'git:merge_attempted',
  GIT_MERGE_SUCCEEDED: 'git:merge_succeeded',
  GIT_MERGE_CONFLICT: 'git:merge_conflict',
  GIT_CONFLICT_RESOLVED: 'git:conflict_resolved',
  GIT_REBASE_STARTED: 'git:rebase_started',
  GIT_REBASE_STEP_APPLIED: 'git:rebase_step_applied',
  GIT_REBASE_COMPLETED: 'git:rebase_completed',
  GIT_STASH_PUSHED: 'git:stash_pushed',
  GIT_STASH_POPPED: 'git:stash_popped',
  GIT_CHERRY_PICKED: 'git:cherry_picked',
  GIT_RESET_EXECUTED: 'git:reset_executed',

  // Commands
  COMMAND_EXECUTED: 'command:executed',
  COMMAND_SUCCEEDED: 'command:succeeded',
  COMMAND_FAILED: 'command:failed',
  COMMAND_INVALID: 'command:invalid',

  // Objectives & Progression
  OBJECTIVE_PROGRESS: 'objective:progress',
  OBJECTIVE_COMPLETED: 'objective:completed',
  OBJECTIVE_FAILED: 'objective:failed',
  STAGE_COMPLETED: 'stage:completed',
  CHECKPOINT_REACHED: 'checkpoint:reached',
  CHECKPOINT_RESTORED: 'checkpoint:restored',
  LEVEL_LOADED: 'level:loaded',
  LEVEL_STARTED: 'level:started',
  LEVEL_COMPLETED: 'level:completed',
  LEVEL_FAILED: 'level:failed',
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',

  // State
  STATE_MUTATED: 'state:mutated',
  STATE_RESTORED: 'state:restored',
  STATE_HISTORY_PUSHED: 'state:history_pushed',
  STATE_UNDO: 'state:undo',
  STATE_REDO: 'state:redo'
});

export const CommandType = Object.freeze({
  GIT: 'git',
  HELP: 'help',
  CLEAR: 'clear',
  INSPECT: 'inspect',
  HINT: 'hint',
  UNDO: 'undo',
  REDO: 'redo',
  RESET: 'reset',
  RESTART: 'restart',
  SCAN: 'scan',
  STATS: 'stats',
  MAP: 'map',
  CHECKPOINT: 'checkpoint'
});

export const GitSubCommand = Object.freeze({
  STATUS: 'status',
  PUSH: 'push',
  PULL: 'pull',
  COMMIT: 'commit',
  SWITCH: 'switch',
  CHECKOUT: 'checkout',
  BRANCH: 'branch',
  MERGE: 'merge',
  REBASE: 'rebase',
  STASH: 'stash',
  RESET: 'reset',
  CHERRY_PICK: 'cherry-pick',
  DIFF: 'diff',
  LOG: 'log',
  FETCH: 'fetch',
  TAG: 'tag',
  CLEAN: 'clean',
  // Movement aliases
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  STEP: 'step',
  JUMP: 'jump'
});

export const ObjectiveType = Object.freeze({
  REACH_LOCATION: 'reach_location',
  MOVE_OBJECT: 'move_object',
  ALL_OBJECTS_ON_GOALS: 'all_objects_on_goals',
  EXECUTE_COMMAND: 'execute_command',
  COMMAND_SEQUENCE: 'command_sequence',
  ACTIVATE_SWITCH: 'activate_switch',
  OPEN_DOOR: 'open_door',
  COLLECT_KEY: 'collect_key',
  RESOLVE_CONFLICT: 'resolve_conflict',
  GIT_COMMIT: 'git_commit',
  GIT_BRANCH: 'git_branch',
  GIT_MERGE: 'git_merge',
  GIT_REBASE: 'git_rebase',
  GIT_STASH: 'git_stash',
  ENTER_ROOM: 'enter_room',
  TIMED_SURVIVAL: 'timed_survival',
  PAR_EFFICIENCY: 'par_efficiency',
  COMPOSITE_AND: 'composite_and',
  COMPOSITE_OR: 'composite_or',
  COMPOSITE_NOT: 'composite_not',
  COMPOSITE_SEQUENCE: 'composite_sequence'
});

export const ObjectiveStatus = Object.freeze({
  PENDING: 'pending',
  ACTIVE: 'active',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  SKIPPED: 'skipped'
});

export const Difficulty = Object.freeze({
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
  EXPERT: 'EXPERT',
  MASTER: 'MASTER',
  GRANDMASTER: 'GRANDMASTER'
});

export const PuzzleCategory = Object.freeze({
  NAVIGATION: 'navigation',
  COMMAND: 'command',
  INTERACTION: 'interaction',
  STATE: 'state',
  BRANCH: 'branch',
  SEQUENCE: 'sequence',
  EXPLORATION: 'exploration',
  MULTI_ROOM: 'multi_room',
  COMBINATION: 'combination'
});

export const ErrorCode = Object.freeze({
  OK: 0,
  WALL_COLLISION: 101,
  HAZARD_COLLISION: 102,
  DOOR_LOCKED: 103,
  OUT_OF_BOUNDS: 104,
  BOX_BLOCKED: 105,
  NO_BOX_TO_PULL: 106,
  PULL_PATH_OBSTRUCTED: 107,
  INVALID_DIRECTION: 108,
  UNKNOWN_COMMAND: 201,
  INVALID_ARGUMENT: 202,
  PRECONDITION_FAILED: 203,
  DIRTY_WORKING_TREE: 204,
  MERGE_CONFLICT: 205,
  DETACHED_HEAD: 206,
  NO_SUCH_BRANCH: 207,
  NO_SUCH_COMMIT: 208,
  CHECKPOINT_RESTORE_FAILED: 301,
  OBJECTIVE_NOT_MET: 401,
  ENGINE_ERROR: 500
});

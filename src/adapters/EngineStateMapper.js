/**
 * EngineStateMapper
 * Translates low-level mutable engine representations into clean, immutable
 * frontend Data Transfer Objects (DTOs) for rendering and state stores.
 */

/**
 * @typedef {Object} FrontendPlayerState
 * @property {number} x
 * @property {number} y
 * @property {'up' | 'down' | 'left' | 'right'} direction
 * @property {number} lives
 * @property {number} xp
 * @property {boolean} isMoving
 */

/**
 * @typedef {Object} FrontendBoxState
 * @property {number} x
 * @property {number} y
 * @property {boolean} isOnGoal
 * @property {string} id
 */

/**
 * @typedef {Object} FrontendGoalState
 * @property {number} x
 * @property {number} y
 * @property {boolean} isSatisfied
 * @property {string} branchName
 */

/**
 * @typedef {Object} FrontendGridState
 * @property {number} width
 * @property {number} height
 * @property {number} gridSize
 * @property {Array<{x: number, y: number, type: string}>} walls
 * @property {Array<{x: number, y: number, type: string}>} hazards
 * @property {Array<{x: number, y: number, type: string, active: boolean}>} switches
 * @property {Array<{x: number, y: number, type: string, open: boolean}>} doors
 */

/**
 * @typedef {Object} FrontendGameplayState
 * @property {string} levelId
 * @property {string} levelName
 * @property {number} world
 * @property {string} difficulty
 * @property {FrontendPlayerState} player
 * @property {FrontendBoxState} box
 * @property {FrontendGoalState} goal
 * @property {FrontendGridState} grid
 * @property {number} moves
 * @property {number} pushCount
 * @property {number} pullCount
 * @property {number} commandsCount
 * @property {number} statusCount
 * @property {string} formattedTime
 * @property {number} elapsedSeconds
 * @property {boolean} isGoalReached
 * @property {boolean} isCommitted
 * @property {boolean} canUndo
 * @property {number} score
 * @property {number} stars
 * @property {number} xpReward
 */

export class EngineStateMapper {
  /**
   * Map raw engine instance to frontend DTO
   * @param {Object} engine - The active GitQuestEngine or GameState instance
   * @returns {FrontendGameplayState}
   */
  static mapEngineToFrontendState(engine) {
    if (!engine) {
      return this.getEmptyState();
    }

    const levelDef = engine.levelDef || {};
    const gridSize = engine.gridSize || levelDef.gridSize || 6;
    const width = engine.width || levelDef.width || gridSize;
    const height = engine.height || levelDef.height || gridSize;

    // Player position and facing direction
    const playerX = engine.player?.x ?? engine.player?.position?.x ?? 1;
    const playerY = engine.player?.y ?? engine.player?.position?.y ?? 1;
    const playerDir = engine.player?.dir ?? engine.player?.direction ?? 'up';

    // Box position
    const boxX = engine.box?.x ?? 2;
    const boxY = engine.box?.y ?? 2;

    // Goal position
    const goalX = engine.goal?.x ?? (width - 2);
    const goalY = engine.goal?.y ?? (height - 2);

    const isGoalReached = Boolean(engine.isGoalReached || (boxX === goalX && boxY === goalY));
    const isCommitted = Boolean(engine.isCommitted);

    // Walls and hazards extraction
    const walls = (engine.walls || levelDef.walls || []).map(w => ({
      x: w.x,
      y: w.y,
      type: w.type || 'standard'
    }));

    const hazards = (engine.hazards || levelDef.hazards || []).map(h => ({
      x: h.x,
      y: h.y,
      type: h.type || 'lava'
    }));

    const switches = (engine.switches || levelDef.switches || []).map(s => ({
      x: s.x,
      y: s.y,
      type: s.type || 'pressure_plate',
      active: Boolean(s.active || s.isTriggered)
    }));

    const doors = (engine.doors || levelDef.doors || []).map(d => ({
      x: d.x,
      y: d.y,
      type: d.type || 'security_gate',
      open: Boolean(d.open || d.isOpen)
    }));

    // Stats calculations
    const moves = engine.moves ?? engine.stats?.moves ?? 0;
    const pushCount = engine.pushCount ?? engine.stats?.pushCount ?? 0;
    const pullCount = engine.pullCount ?? engine.stats?.pullCount ?? 0;
    const commandsCount = engine.commandsCount ?? engine.stats?.commandsCount ?? 0;
    const statusCount = engine.statusCount ?? engine.stats?.statusCount ?? 0;
    const elapsedSeconds = engine.elapsedSeconds ?? engine.stats?.elapsedSeconds ?? 0;
    const formattedTime = typeof engine.getFormattedTime === 'function'
      ? engine.getFormattedTime()
      : this.formatSeconds(elapsedSeconds);

    const commitsReq = levelDef.commitsReq || 2;
    const stars = this.calculateStars(moves, commitsReq);
    const score = typeof engine.calculateScore === 'function'
      ? engine.calculateScore()
      : this.calculateFallbackScore(moves, elapsedSeconds, stars);

    const canUndo = typeof engine.historyManager?.canUndo === 'function'
      ? engine.historyManager.canUndo()
      : (Array.isArray(engine.history) && engine.history.length > 0);

    return {
      levelId: String(engine.levelId || '01').padStart(2, '0'),
      levelName: levelDef.name || `Level ${engine.levelId}`,
      world: levelDef.world || 1,
      difficulty: levelDef.difficulty || 'MEDIUM',
      player: {
        x: playerX,
        y: playerY,
        direction: playerDir,
        lives: engine.lives ?? 3,
        xp: engine.xp ?? 0,
        isMoving: false
      },
      box: {
        x: boxX,
        y: boxY,
        isOnGoal: isGoalReached,
        id: 'box_primary'
      },
      goal: {
        x: goalX,
        y: goalY,
        isSatisfied: isGoalReached,
        branchName: engine.gitRepo?.currentBranch || `main`
      },
      grid: {
        width,
        height,
        gridSize,
        walls,
        hazards,
        switches,
        doors
      },
      moves,
      pushCount,
      pullCount,
      commandsCount,
      statusCount,
      formattedTime,
      elapsedSeconds,
      isGoalReached,
      isCommitted,
      canUndo,
      score,
      stars,
      xpReward: levelDef.xpReward || 500
    };
  }

  /**
   * Format seconds into MM:SS format
   * @param {number} totalSeconds
   * @returns {string}
   */
  static formatSeconds(totalSeconds = 0) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Determine stars based on efficiency thresholds
   * @param {number} moves
   * @param {number} commitsReq
   * @returns {number}
   */
  static calculateStars(moves, commitsReq = 2) {
    const target3Star = commitsReq * 4;
    const target2Star = commitsReq * 8;
    if (moves <= target3Star) return 3;
    if (moves <= target2Star) return 2;
    return 1;
  }

  /**
   * Calculate score from metrics
   */
  static calculateFallbackScore(moves, timeSeconds, stars) {
    const base = 10000;
    const movePenalty = moves * 25;
    const timePenalty = timeSeconds * 10;
    const starBonus = stars * 1000;
    return Math.max(100, base - movePenalty - timePenalty + starBonus);
  }

  /**
   * Default empty frontend state
   * @returns {FrontendGameplayState}
   */
  static getEmptyState() {
    return {
      levelId: '01',
      levelName: 'Loading...',
      world: 1,
      difficulty: 'NORMAL',
      player: { x: 1, y: 1, direction: 'up', lives: 3, xp: 0, isMoving: false },
      box: { x: 2, y: 2, isOnGoal: false, id: 'box_primary' },
      goal: { x: 4, y: 4, isSatisfied: false, branchName: 'main' },
      grid: { width: 6, height: 6, gridSize: 6, walls: [], hazards: [], switches: [], doors: [] },
      moves: 0,
      pushCount: 0,
      pullCount: 0,
      commandsCount: 0,
      statusCount: 0,
      formattedTime: '00:00',
      elapsedSeconds: 0,
      isGoalReached: false,
      isCommitted: false,
      canUndo: false,
      score: 0,
      stars: 0,
      xpReward: 500
    };
  }
}

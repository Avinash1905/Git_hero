/**
 * LevelDataAdapter
 * Normalizes and validates level definitions from engine registry and backend API
 * into structured, type-safe level descriptors for frontend selectors and progression views.
 */

export class LevelDataAdapter {
  /**
   * Format any raw level ID into standardized string key
   * @param {string|number} rawId
   * @returns {string}
   */
  static normalizeLevelId(rawId) {
    if (rawId === null || rawId === undefined) return '01';
    const parsed = parseInt(rawId, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed < 10 ? `0${parsed}` : String(parsed);
    }
    return String(rawId).trim();
  }

  /**
   * Parse numeric level index
   * @param {string|number} levelId
   * @returns {number}
   */
  static parseLevelNumber(levelId) {
    const num = parseInt(levelId, 10);
    return isNaN(num) ? 1 : num;
  }

  /**
   * Calculate World index (1..20) from level number
   * @param {number} levelNumber
   * @returns {number}
   */
  static calculateWorld(levelNumber) {
    if (levelNumber <= 0) return 1;
    // 250 levels across 20 worlds (~12-13 levels per world)
    const world = Math.ceil(levelNumber / 12.5);
    return Math.min(20, Math.max(1, world));
  }

  /**
   * Classify difficulty based on level number and world
   * @param {number} levelNumber
   * @returns {'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MASTER' | 'GRANDMASTER'}
   */
  static determineDifficulty(levelNumber) {
    if (levelNumber <= 10) return 'BEGINNER';
    if (levelNumber <= 25) return 'EASY';
    if (levelNumber <= 60) return 'MEDIUM';
    if (levelNumber <= 120) return 'HARD';
    if (levelNumber <= 180) return 'EXPERT';
    if (levelNumber <= 230) return 'MASTER';
    return 'GRANDMASTER';
  }

  /**
   * Adapt raw engine definition or DB record to full frontend LevelModel
   * @param {Object} rawDef
   * @param {string|number} id
   * @param {Object} [userProgress]
   * @returns {Object}
   */
  static adaptToLevelModel(rawDef = {}, id = '01', userProgress = null) {
    const normId = this.normalizeLevelId(id || rawDef.id);
    const num = this.parseLevelNumber(normId);
    const world = rawDef.world || this.calculateWorld(num);
    const difficulty = rawDef.difficulty || this.determineDifficulty(num);

    const progressEntry = userProgress?.[normId] || userProgress?.[String(num)] || null;
    const isCompleted = Boolean(progressEntry?.completed || progressEntry?.status === 'COMPLETED');
    const stars = isCompleted ? (progressEntry.stars || 3) : 0;

    // Level 1 is always unlocked by default; others unlocked if completed or previous completed
    let isUnlocked = num === 1;
    if (num > 1 && userProgress) {
      const prevId = this.normalizeLevelId(num - 1);
      const prevProg = userProgress[prevId] || userProgress[String(num - 1)];
      isUnlocked = Boolean(isCompleted || prevProg?.completed || prevProg?.status === 'COMPLETED');
    }

    const commitsReq = rawDef.commitsReq || Math.min(10, Math.max(1, Math.floor(num / 15) + 1));
    const xpReward = rawDef.xpReward || (num * 50 + 450);
    const gridSize = rawDef.gridSize || Math.min(12, Math.max(5, Math.floor(num / 25) + 5));

    return {
      id: normId,
      number: num,
      name: rawDef.name || `Level ${normId}: ${this.getDefaultLevelTitle(num)}`,
      description: rawDef.description || `Master git branching and staging mechanics in sector ${normId}.`,
      world,
      worldName: this.getWorldName(world),
      difficulty,
      xpReward,
      commitsReq,
      gridSize,
      width: rawDef.width || gridSize,
      height: rawDef.height || gridSize,
      player: rawDef.player ? { ...rawDef.player } : { x: 1, y: 1 },
      box: rawDef.box ? { ...rawDef.box } : { x: 2, y: 2 },
      goal: rawDef.goal ? { ...rawDef.goal } : { x: gridSize - 2, y: gridSize - 2 },
      walls: Array.isArray(rawDef.walls) ? [...rawDef.walls] : [],
      hazards: Array.isArray(rawDef.hazards) ? [...rawDef.hazards] : [],
      switches: Array.isArray(rawDef.switches) ? [...rawDef.switches] : [],
      doors: Array.isArray(rawDef.doors) ? [...rawDef.doors] : [],
      status: isCompleted ? 'COMPLETED' : (isUnlocked ? 'UNLOCKED' : 'LOCKED'),
      unlocked: isUnlocked,
      completed: isCompleted,
      stars,
      bestMoves: progressEntry?.bestMoves || progressEntry?.moves || 0,
      bestTime: progressEntry?.bestTime || progressEntry?.time || 0,
      bestScore: progressEntry?.bestScore || progressEntry?.score || 0
    };
  }

  /**
   * Friendly world names for Worlds 1..20
   * @param {number} world
   * @returns {string}
   */
  static getWorldName(world) {
    const worldNames = {
      1: 'Foundations of Git',
      2: 'Branch Valley',
      3: 'Merge Peaks',
      4: 'Rebase Wasteland',
      5: 'Kernel Core',
      6: 'Grandmaster Trials',
      7: 'Community Expansions',
      8: 'Grandmaster Infinity',
      9: 'Secret Omniverse',
      10: 'Ascension Matrix',
      11: 'Multiverse Nexus',
      12: 'Godhead Infinity',
      13: 'Cataclysm Core',
      14: 'Eternal Genesis',
      15: 'Infinity Nexus',
      16: 'Supreme Pantheon',
      17: 'Infinite Chambers',
      18: 'Omniverse Pantheon',
      19: 'Omnipotent Ascendancy',
      20: 'The Eternal Godhead'
    };
    return worldNames[world] || `World ${world}`;
  }

  /**
   * Default titles for levels when not explicitly specified
   * @param {number} num
   * @returns {string}
   */
  static getDefaultLevelTitle(num) {
    const concepts = [
      'Init Working Tree',
      'Staging Area',
      'The First Commit',
      'Branch Isolation',
      'Fast-Forward Push',
      'Upstream Pull',
      'Remote Synchronize',
      'Three-Way Merge',
      'Conflict Resolution',
      'Interactive Rebase',
      'Cherry-Pick Stash',
      'Detached HEAD',
      'Bisect Debugger',
      'Submodule Linking',
      'Reflog Time Machine',
      'Tagging Release'
    ];
    const index = (num - 1) % concepts.length;
    return `${concepts[index]} ${Math.ceil(num / concepts.length)}`;
  }
}

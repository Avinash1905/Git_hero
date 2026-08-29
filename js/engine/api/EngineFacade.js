/**
 * GitQuest Engine - EngineFacade (GitQuestEngine)
 * Master public API facade providing a clean, decoupled interface for UI and frontend consumers.
 */

import { GitQuestCoreEngine } from '../core/Engine.js';
import { EventBus } from '../core/EventBus.js';
import { GameEvent, Direction } from '../core/Constants.js';
import { World } from '../world/World.js';
import { TileMap } from '../world/TileMap.js';
import { EntityManager } from '../entities/EntityManager.js';
import { CollisionEngine } from '../collision/CollisionEngine.js';
import { PushSolver } from '../collision/PushSolver.js';
import { PullSolver } from '../collision/PullSolver.js';
import { MovementSolver } from '../collision/MovementSolver.js';
import { CommandPipeline, CommandContext, CommandRegistry } from '../commands/CommandPipeline.js';
import {
  StatusHandler,
  PushHandler,
  PullHandler,
  CommitHandler,
  SwitchHandler
} from '../commands/handlers/CoreGitHandlers.js';
import {
  MovementHandler,
  HelpHandler,
  ClearHandler,
  UndoHandler,
  HintHandler
} from '../commands/handlers/UtilityHandlers.js';
import {
  BranchHandler,
  MergeHandler,
  RebaseHandler,
  StashHandler,
  CherryPickHandler,
  DiffHandler,
  LogHandler
} from '../commands/handlers/AdvancedGitHandlers.js';
import {
  TagHandler,
  RevertHandler,
  SubmoduleHandler,
  WorktreeHandler,
  BundleHandler,
  BlameHandler
} from '../commands/handlers/GitExtendedHandlers.js';
import { ObjectiveManager } from '../objectives/ObjectiveManager.js';
import { PuzzleSystem } from '../puzzles/PuzzleSystem.js';
import { PlayerState, GitRepoState, WorldState } from '../state/PlayerState.js';
import { HistoryManager, StatsTracker, Serialization } from '../state/HistoryManager.js';
import { CheckpointManager } from '../checkpoints/CheckpointManager.js';
import { GlobalLevelRegistry, GlobalLevelLoader } from '../levels/LevelRegistry.js';
import { ScoringCalculator, ProgressionManager, AchievementEngine } from '../progression/ProgressionManager.js';

export class GitQuestEngine {
  constructor(options = {}) {
    this.core = new GitQuestCoreEngine(options);
    this.eventBus = this.core.eventBus;
    this.levelRegistry = options.levelRegistry || GlobalLevelRegistry;
    this.levelLoader = options.levelLoader || GlobalLevelLoader;

    // Subsystems
    this.world = new World();
    this.entityManager = new EntityManager(this.world, this.eventBus);
    this.collision = new CollisionEngine(this.world, this.entityManager);
    this.pushSolver = new PushSolver(this.world, this.entityManager, this.collision, this.eventBus);
    this.pullSolver = new PullSolver(this.world, this.entityManager, this.collision, this.eventBus);
    this.movementSolver = new MovementSolver(
      this.world,
      this.entityManager,
      this.collision,
      this.pushSolver,
      this.pullSolver,
      this.eventBus
    );

    this.objectiveManager = new ObjectiveManager(this.eventBus);
    this.puzzleSystem = new PuzzleSystem(this.eventBus);
    this.historyManager = new HistoryManager(options.maxHistory || 200);
    this.stats = new StatsTracker();
    this.checkpointManager = new CheckpointManager(this.eventBus);
    this.achievementEngine = new AchievementEngine();

    // Command subsystem
    this.commandRegistry = new CommandRegistry();
    this._registerDefaultCommands();
    this.commandPipeline = new CommandPipeline(this.commandRegistry, this.eventBus);

    // Live state
    this.levelDef = null;
    this.levelId = '07';
    this.player = new PlayerState();
    this.box = { x: 2, y: 2 };
    this.goal = { x: 4, y: 4 };
    this.gitRepo = new GitRepoState();
    this.worldState = new WorldState();
    this.isGoalReached = false;
    this.isCommitted = false;
    this.listeners = [];
  }

  _registerDefaultCommands() {
    this.commandRegistry.register('git', 'status', new StatusHandler());
    this.commandRegistry.register('git', 'push', new PushHandler());
    this.commandRegistry.register('git', 'pull', new PullHandler());
    this.commandRegistry.register('git', 'commit', new CommitHandler());
    this.commandRegistry.register('git', 'switch', new SwitchHandler());
    this.commandRegistry.register('git', 'branch', new BranchHandler());
    this.commandRegistry.register('git', 'merge', new MergeHandler());
    this.commandRegistry.register('git', 'rebase', new RebaseHandler());
    this.commandRegistry.register('git', 'stash', new StashHandler());
    this.commandRegistry.register('git', 'cherry-pick', new CherryPickHandler());
    this.commandRegistry.register('git', 'diff', new DiffHandler());
    this.commandRegistry.register('git', 'log', new LogHandler());
    this.commandRegistry.register('git', 'tag', new TagHandler());
    this.commandRegistry.register('git', 'revert', new RevertHandler());
    this.commandRegistry.register('git', 'submodule', new SubmoduleHandler());
    this.commandRegistry.register('git', 'worktree', new WorktreeHandler());
    this.commandRegistry.register('git', 'bundle', new BundleHandler());
    this.commandRegistry.register('git', 'blame', new BlameHandler());

    // Movement subcommands
    this.commandRegistry.register('git', 'left', new MovementHandler('left'));
    this.commandRegistry.register('git', 'right', new MovementHandler('right'));
    this.commandRegistry.register('git', 'up', new MovementHandler('up'));
    this.commandRegistry.register('git', 'down', new MovementHandler('down'));

    // Utilities
    this.commandRegistry.register('help', '', new HelpHandler());
    this.commandRegistry.register('clear', '', new ClearHandler());
    this.commandRegistry.register('undo', '', new UndoHandler());
    this.commandRegistry.register('hint', '', new HintHandler());
  }

  /**
   * Load and initialize a level by ID
   */
  loadLevel(levelId, customLevel = null) {
    const normId = String(levelId || '07').padStart(2, '0');
    this.levelDef = this.levelLoader.loadLevel(normId, customLevel);
    this.levelId = this.levelDef.id;

    // Reset subsystems
    this.entityManager.clear();
    this.objectiveManager.clear();
    this.puzzleSystem.reset();
    this.historyManager.clear();
    this.stats.reset();
    this.checkpointManager.clear();

    // Map & Dimensions
    this.gridSize = this.levelDef.gridSize || 6;
    const width = this.levelDef.width || this.gridSize;
    const height = this.levelDef.height || this.gridSize;
    this.world.map.width = width;
    this.world.map.height = height;
    this.world.map.gridSize = this.gridSize;
    this.world.map.tileMap = new TileMap(width, height, 'floor');
    this.world.map.tileMap.setPerimeter('wall');

    // Walls
    for (const w of this.levelDef.walls || []) {
      this.world.map.tileMap.setTile(w.x, w.y, 'wall');
    }

    // Hazards
    for (const h of this.levelDef.hazards || []) {
      this.world.map.tileMap.setTile(h.x, h.y, 'hazard', 'overlay');
    }

    // Coordinates
    this.player.position.x = this.levelDef.player?.x ?? 1;
    this.player.position.y = this.levelDef.player?.y ?? 1;
    this.player.direction = Direction.UP;

    this.box = { x: this.levelDef.box?.x ?? 2, y: this.levelDef.box?.y ?? 2 };
    this.goal = { x: this.levelDef.goal?.x ?? 4, y: this.levelDef.goal?.y ?? 4 };

    // Register box entity in EntityManager
    this.entityManager.add({
      id: 'box',
      type: 'pushable',
      position: this.box,
      isPushable: true,
      isPullable: true,
      isSolid: () => true,
      setPosition: (x, y) => {
        this.box.x = x;
        this.box.y = y;
      },
      setGoalStatus: (onGoal) => {
        this.isGoalReached = Boolean(onGoal);
      }
    });

    // Register goal entity in EntityManager
    this.entityManager.add({
      id: 'goal',
      type: 'goal',
      position: this.goal,
      isSolid: () => false
    });

    this.isCommitted = false;
    this.isGoalReached = this.checkGoal();

    // Setup git repo state
    this.gitRepo = new GitRepoState({
      currentBranch: `level-${this.levelId}`
    });

    this.eventBus.emit(GameEvent.LEVEL_LOADED, { levelId: this.levelId, levelDef: this.levelDef });
    this.notifyStateChange();
    return this;
  }

  checkGoal() {
    return this.box.x === this.goal.x && this.box.y === this.goal.y;
  }

  saveHistory() {
    this.historyManager.pushState({
      player: { x: this.player.x, y: this.player.y, dir: this.player.dir },
      box: { x: this.box.x, y: this.box.y },
      moves: this.stats.moves,
      pushCount: this.stats.pushCount,
      pullCount: this.stats.pullCount
    });
  }

  undo() {
    if (!this.historyManager.canUndo()) return false;
    const prev = this.historyManager.undo({
      player: { x: this.player.x, y: this.player.y, dir: this.player.dir },
      box: { x: this.box.x, y: this.box.y },
      moves: this.stats.moves,
      pushCount: this.stats.pushCount,
      pullCount: this.stats.pullCount
    });

    if (prev) {
      this.player.x = prev.player.x;
      this.player.y = prev.player.y;
      this.player.dir = prev.player.dir;
      this.box.x = prev.box.x;
      this.box.y = prev.box.y;
      this.entityManager.updatePosition(this.entityManager.get('box'), this.box.x, this.box.y);
      this.stats.moves = prev.moves;
      this.stats.pushCount = prev.pushCount;
      this.stats.pullCount = prev.pullCount;
      this.isGoalReached = this.checkGoal();
      this.notifyStateChange();
      return true;
    }
    return false;
  }

  moveDirection(dir) {
    const norm = String(dir || '').trim().toLowerCase();
    let dx = 0;
    let dy = 0;
    if (norm === 'left') dx = -1;
    else if (norm === 'right') dx = 1;
    else if (norm === 'up') dy = -1;
    else if (norm === 'down') dy = 1;
    else return { success: false, reason: 'invalid_direction' };

    const targetX = this.player.x + dx;
    const targetY = this.player.y + dy;

    // Update facing
    this.player.dir = norm;

    // Check wall
    if (this.world.isWall(targetX, targetY) || !this.world.map.isInBounds(targetX, targetY)) {
      return { success: false, reason: 'wall' };
    }

    // Check box push
    if (targetX === this.box.x && targetY === this.box.y) {
      const boxNewX = this.box.x + dx;
      const boxNewY = this.box.y + dy;

      if (this.world.isWall(boxNewX, boxNewY) || !this.world.map.isInBounds(boxNewX, boxNewY)) {
        return { success: false, reason: 'blocked_box' };
      }

      this.saveHistory();
      this.box.x = boxNewX;
      this.box.y = boxNewY;
      this.entityManager.updatePosition(this.entityManager.get('box'), boxNewX, boxNewY);
      this.player.x = targetX;
      this.player.y = targetY;
      this.stats.moves++;
      this.stats.pushCount++;
      this.isGoalReached = this.checkGoal();

      this.notifyStateChange();
      return { success: true, pushed: true, onGoal: this.isGoalReached };
    }

    // Normal move
    this.saveHistory();
    this.player.x = targetX;
    this.player.y = targetY;
    this.stats.moves++;

    this.notifyStateChange();
    return { success: true, pushed: false };
  }

  pullDirection(dir) {
    const res = this.pullSolver.resolvePull(
      this.player.position,
      this.player.dir,
      dir
    );

    if (res.success) {
      this.saveHistory();
      this.player.x = res.playerTo.x;
      this.player.y = res.playerTo.y;
      this.box.x = res.boxTo.x;
      this.box.y = res.boxTo.y;
      this.player.dir = res.direction || this.player.dir;
      this.stats.moves++;
      this.stats.pullCount++;
      this.isGoalReached = this.checkGoal();

      this.notifyStateChange();
      return { success: true, pulled: true, direction: res.direction, onGoal: this.isGoalReached };
    }

    return { success: false, reason: res.reason, direction: dir };
  }

  gitPush() {
    let dx = 0;
    let dy = 0;
    if (this.player.dir === 'right') dx = 1;
    else if (this.player.dir === 'left') dx = -1;
    else if (this.player.dir === 'down') dy = 1;
    else if (this.player.dir === 'up') dy = -1;

    if (this.player.x + dx === this.box.x && this.player.y + dy === this.box.y) {
      return this.moveDirection(this.player.dir);
    }

    const adj = [
      { dx: 0, dy: -1, dir: 'up' },
      { dx: 0, dy: 1, dir: 'down' },
      { dx: -1, dy: 0, dir: 'left' },
      { dx: 1, dy: 0, dir: 'right' }
    ];
    for (const d of adj) {
      if (this.player.x + d.dx === this.box.x && this.player.y + d.dy === this.box.y) {
        return this.moveDirection(d.dir);
      }
    }

    return this.moveDirection(this.player.dir);
  }

  gitPull() {
    return this.pullDirection('');
  }

  executeCommand(rawCommand) {
    this.stats.commandsCount++;
    const ctx = new CommandContext({
      engine: this,
      gameState: this,
      gridEngine: this,
      world: this.world,
      entityManager: this.entityManager,
      eventBus: this.eventBus,
      player: this.player
    });
    return this.commandPipeline.execute(rawCommand, ctx);
  }

  onStateChange(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  notifyStateChange() {
    for (const fn of this.listeners) {
      try {
        fn(this);
      } catch (err) {
        console.error('[GitQuestEngine] Error in onStateChange listener:', err);
      }
    }
  }

  // Compatibility getters for frontend views
  get walls() {
    return this.levelDef?.walls || [];
  }

  get hazards() {
    return this.levelDef?.hazards || [];
  }

  get moves() {
    return this.stats.moves;
  }
  set moves(v) {
    this.stats.moves = v;
  }

  get pushCount() {
    return this.stats.pushCount;
  }
  set pushCount(v) {
    this.stats.pushCount = v;
  }

  get pullCount() {
    return this.stats.pullCount;
  }
  set pullCount(v) {
    this.stats.pullCount = v;
  }

  get statusCount() {
    return this.stats.statusCount;
  }
  set statusCount(v) {
    this.stats.statusCount = v;
  }

  get commandsCount() {
    return this.stats.commandsCount;
  }
  set commandsCount(v) {
    this.stats.commandsCount = v;
  }

  get elapsedSeconds() {
    return this.stats.elapsedSeconds;
  }
  set elapsedSeconds(v) {
    this.stats.elapsedSeconds = v;
  }

  get lives() {
    return this.player.lives;
  }
  set lives(v) {
    this.player.lives = v;
  }

  get xp() {
    return this.player.xp;
  }
  set xp(v) {
    this.player.xp = v;
  }

  startTimer(onTick) {
    this.stats.startTimer(onTick);
  }

  stopTimer() {
    this.stats.stopTimer();
  }

  getFormattedTime() {
    return this.stats.getFormattedTime();
  }

  calculateScore() {
    return this.stats.calculateScore(10000, (this.levelDef?.commitsReq || 2) * 4, 60);
  }
}

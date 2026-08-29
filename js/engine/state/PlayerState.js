/**
 * GitQuest Engine - Player, World, and Git Repository State Models
 * Immutable-friendly state structures representing player status, world state, and simulated Git DAG.
 */

import { Direction } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';
import { EngineUtils } from '../core/Utils.js';

export class Inventory {
  constructor(items = []) {
    this.items = new Set(items);
  }

  addItem(itemId) {
    this.items.add(itemId);
  }

  removeItem(itemId) {
    return this.items.delete(itemId);
  }

  hasItem(itemId) {
    return this.items.has(itemId);
  }

  clear() {
    this.items.clear();
  }

  toJSON() {
    return Array.from(this.items);
  }

  static fromJSON(json) {
    return new Inventory(Array.isArray(json) ? json : []);
  }
}

export class PlayerState {
  constructor(options = {}) {
    this.position = options.position ? Vector2D.from(options.position) : new Vector2D(1, 1);
    this.direction = options.direction || Direction.UP;
    this.lives = options.lives ?? 3;
    this.maxLives = options.maxLives ?? 3;
    this.inventory = options.inventory instanceof Inventory ? options.inventory : new Inventory(options.inventory || []);
    this.xp = options.xp ?? 2450;
    this.stamina = options.stamina ?? 100;
  }

  get x() {
    return this.position.x;
  }

  set x(val) {
    this.position.x = Math.round(val);
  }

  get y() {
    return this.position.y;
  }

  set y(val) {
    this.position.y = Math.round(val);
  }

  get dir() {
    return this.direction;
  }

  set dir(val) {
    this.direction = val;
  }

  clone() {
    return new PlayerState({
      position: this.position.clone(),
      direction: this.direction,
      lives: this.lives,
      maxLives: this.maxLives,
      inventory: new Inventory(this.inventory.toJSON()),
      xp: this.xp,
      stamina: this.stamina
    });
  }

  toJSON() {
    return {
      x: this.position.x,
      y: this.position.y,
      dir: this.direction,
      lives: this.lives,
      maxLives: this.maxLives,
      inventory: this.inventory.toJSON(),
      xp: this.xp,
      stamina: this.stamina
    };
  }
}

export class WorldState {
  constructor(options = {}) {
    this.activeRoomId = options.activeRoomId || null;
    this.discoveredRooms = new Set(options.discoveredRooms || []);
    this.doorStates = new Map(Object.entries(options.doorStates || {}));
    this.switchStates = new Map(Object.entries(options.switchStates || {}));
    this.boxPositions = new Map(Object.entries(options.boxPositions || {}));
  }

  clone() {
    const clone = new WorldState({
      activeRoomId: this.activeRoomId,
      discoveredRooms: Array.from(this.discoveredRooms)
    });
    clone.doorStates = new Map(this.doorStates);
    clone.switchStates = new Map(this.switchStates);
    clone.boxPositions = new Map(this.boxPositions);
    return clone;
  }

  toJSON() {
    return {
      activeRoomId: this.activeRoomId,
      discoveredRooms: Array.from(this.discoveredRooms),
      doorStates: Object.fromEntries(this.doorStates),
      switchStates: Object.fromEntries(this.switchStates),
      boxPositions: Object.fromEntries(this.boxPositions)
    };
  }
}

export class GitCommitRecord {
  constructor(options = {}) {
    this.hash = options.hash || EngineUtils.generateGitHash();
    this.message = options.message || 'Commit message';
    this.parentHashes = options.parentHashes || [];
    this.author = options.author || 'GitQuest Player';
    this.timestamp = options.timestamp || Date.now();
    this.snapshot = options.snapshot || null;
  }
}

export class GitRepoState {
  constructor(options = {}) {
    this.currentBranch = options.currentBranch || 'main';
    this.headCommitHash = options.headCommitHash || null;
    this.branches = new Map(Object.entries(options.branches || { main: null }));
    this.commits = new Map(Object.entries(options.commits || {}));
    this.stagingIndex = new Set(options.stagingIndex || []);
    this.stashStack = options.stashStack ? [...options.stashStack] : [];
  }

  createBranch(branchName, commitHash = this.headCommitHash) {
    this.branches.set(branchName, commitHash);
    return branchName;
  }

  checkoutBranch(branchName) {
    if (!this.branches.has(branchName)) {
      this.createBranch(branchName);
    }
    this.currentBranch = branchName;
    this.headCommitHash = this.branches.get(branchName);
    return branchName;
  }

  commit(message, snapshot = null) {
    const hash = EngineUtils.generateGitHash(this.currentBranch);
    const parentHashes = this.headCommitHash ? [this.headCommitHash] : [];
    const record = new GitCommitRecord({
      hash,
      message,
      parentHashes,
      snapshot
    });

    this.commits.set(hash, record);
    this.headCommitHash = hash;
    this.branches.set(this.currentBranch, hash);
    this.stagingIndex.clear();
    return record;
  }

  clone() {
    const clone = new GitRepoState({
      currentBranch: this.currentBranch,
      headCommitHash: this.headCommitHash,
      stagingIndex: Array.from(this.stagingIndex),
      stashStack: [...this.stashStack]
    });
    clone.branches = new Map(this.branches);
    clone.commits = new Map(this.commits);
    return clone;
  }

  toJSON() {
    return {
      currentBranch: this.currentBranch,
      headCommitHash: this.headCommitHash,
      branches: Object.fromEntries(this.branches),
      commits: Object.fromEntries(this.commits),
      stagingIndex: Array.from(this.stagingIndex),
      stashStack: [...this.stashStack]
    };
  }
}

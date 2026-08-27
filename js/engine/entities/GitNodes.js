/**
 * GitQuest Engine - Git Node Entities
 * Specialized entities representing Git abstractions in the puzzle space:
 * Commit nodes, branch switches, remotes, merge conflicts, and terminal relays.
 */

import { Entity } from './Entity.js';
import { EntityType, EntityLayer } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';
import { EngineUtils } from '../core/Utils.js';

export class CommitNodeEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.COMMIT_NODE,
      layer: EntityLayer.OBSTACLES,
      solid: options.solid !== undefined ? options.solid : true
    });
    this.hash = options.hash || EngineUtils.generateGitHash();
    this.message = options.message || 'feat: add core logic';
    this.parentHashes = options.parentHashes || [];
    this.author = options.author || 'GitQuest Player';
    this.isCherryPickable = Boolean(options.isCherryPickable);
    this.isMerged = Boolean(options.isMerged);
  }
}

export class BranchNodeEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.BRANCH_NODE,
      layer: EntityLayer.OBSTACLES,
      solid: options.solid !== undefined ? options.solid : true
    });
    this.branchName = options.branchName || 'main';
    this.targetCommitHash = options.targetCommitHash || null;
    this.isCurrent = Boolean(options.isCurrent);
    this.isProtected = Boolean(options.isProtected);
  }

  checkout() {
    this.isCurrent = true;
    return this.branchName;
  }
}

export class RemoteNodeEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.REMOTE_NODE,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.remoteName = options.remoteName || 'origin';
    this.url = options.url || 'https://github.com/gitquest/core.git';
    this.syncedCommits = new Set(options.syncedCommits || []);
  }

  pushCommit(commitHash) {
    this.syncedCommits.add(commitHash);
    return true;
  }

  isSynced(commitHash) {
    return this.syncedCommits.has(commitHash);
  }
}

export class ConflictNodeEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.CONFLICT_NODE,
      layer: EntityLayer.OBSTACLES,
      solid: options.isResolved ? false : true
    });
    this.conflictFile = options.conflictFile || 'main.js';
    this.oursVersion = options.oursVersion || 'current branch';
    this.theirsVersion = options.theirsVersion || 'incoming branch';
    this.isResolved = Boolean(options.isResolved);
  }

  resolve(chosenVersion = 'theirs') {
    this.isResolved = true;
    this.solid = false;
    return { resolved: true, chosen: chosenVersion };
  }
}

export class TerminalRelayEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.TERMINAL_RELAY,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.allowedCommands = new Set(options.allowedCommands || ['git status', 'git push']);
    this.isOnline = options.isOnline !== false;
  }

  canExecute(commandStr) {
    if (!this.isOnline) return false;
    return this.allowedCommands.has(commandStr.trim().toLowerCase());
  }
}

export class ObjectiveMarkerEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.OBJECTIVE_MARKER,
      layer: EntityLayer.FLOOR_MARKINGS,
      solid: false
    });
    this.objectiveId = options.objectiveId || 'obj_main';
    this.isCompleted = Boolean(options.isCompleted);
    this.markerShape = options.markerShape || 'flag'; // flag, circle, diamond
  }

  complete() {
    this.isCompleted = true;
  }
}

export class CherryPickNodeEntity extends Entity {
  constructor(options = {}) {
    super({
      ...options,
      type: EntityType.CHERRY_PICK_NODE,
      layer: EntityLayer.OBSTACLES,
      solid: true
    });
    this.sourceCommitHash = options.sourceCommitHash || EngineUtils.generateGitHash();
    this.picked = Boolean(options.picked);
  }

  pick() {
    this.picked = true;
    this.solid = false;
    return this.sourceCommitHash;
  }
}

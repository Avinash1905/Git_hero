/**
 * GitQuest Engine - Git Worktree & Submodule Engines
 * Multi-worktree dimension hopping and recursive submodule repository tracking.
 */

import { GitRepo } from './GitRepo.js';
import { EngineUtils } from '../core/Utils.js';

export class WorktreeInstance {
  constructor(id, path, branch, headHash) {
    this.id = id;
    this.path = path;
    this.branch = branch;
    this.headHash = headHash;
    this.isLocked = false;
    this.workingState = null;
  }
}

export class GitWorktreeEngine {
  constructor(mainRepo) {
    this.mainRepo = mainRepo;
    this.worktrees = new Map(); // path -> WorktreeInstance
    this.activeWorktreePath = 'main';

    // Register primary worktree
    this.worktrees.set('main', new WorktreeInstance('main', 'main', mainRepo.currentBranch, mainRepo.headCommitHash));
  }

  addWorktree(path, branchName, commitHash = null) {
    if (this.worktrees.has(path)) {
      throw new Error(`fatal: '${path}' already exists`);
    }

    const targetHash = commitHash || this.mainRepo.branches.get(branchName) || this.mainRepo.headCommitHash;
    if (!this.mainRepo.branches.has(branchName)) {
      this.mainRepo.createBranch(branchName, targetHash);
    }

    const wt = new WorktreeInstance(`wt_${EngineUtils.generateUUID().substring(0, 6)}`, path, branchName, targetHash);
    this.worktrees.set(path, wt);
    return wt;
  }

  removeWorktree(path) {
    if (path === 'main') {
      throw new Error('fatal: cannot remove main worktree');
    }
    return this.worktrees.delete(path);
  }

  switchWorktree(path) {
    if (!this.worktrees.has(path)) {
      throw new Error(`fatal: worktree '${path}' not found`);
    }
    this.activeWorktreePath = path;
    const wt = this.worktrees.get(path);
    this.mainRepo.currentBranch = wt.branch;
    this.mainRepo.headCommitHash = wt.headHash;
    return wt;
  }

  listWorktrees() {
    return Array.from(this.worktrees.values());
  }
}

export class SubmoduleEntry {
  constructor(name, path, url, commitHash) {
    this.name = name;
    this.path = path;
    this.url = url;
    this.commitHash = commitHash;
    this.repo = new GitRepo({ initialBranch: 'main', initGenesis: true });
  }
}

export class GitSubmoduleEngine {
  constructor(parentRepo) {
    this.parentRepo = parentRepo;
    this.submodules = new Map(); // path -> SubmoduleEntry
  }

  addSubmodule(url, path, name = null) {
    const subName = name || path;
    if (this.submodules.has(path)) {
      throw new Error(`fatal: A git submodule already exists at '${path}'`);
    }

    const entry = new SubmoduleEntry(subName, path, url, EngineUtils.generateGitHash(url));
    this.submodules.set(path, entry);
    return entry;
  }

  update(path = null) {
    if (path) {
      const sub = this.submodules.get(path);
      if (sub) {
        sub.commitHash = sub.repo.headCommitHash;
        return [sub];
      }
      return [];
    }

    const updated = [];
    for (const sub of this.submodules.values()) {
      sub.commitHash = sub.repo.headCommitHash;
      updated.push(sub);
    }
    return updated;
  }

  get(path) {
    return this.submodules.get(path) || null;
  }

  getAll() {
    return Array.from(this.submodules.values());
  }
}

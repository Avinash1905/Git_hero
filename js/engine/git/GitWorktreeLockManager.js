/**
 * GitQuest Game Engine - Git Worktree Lock Manager
 * Prevents accidental worktree deletion and automated prune operations:
 * `git worktree lock <path> [--reason <msg>]`, unlock verification, and prunability audits.
 */

export class WorktreeLockRecord {
  constructor(worktreePath, reason = 'Locked by administrator', lockedAt = Date.now()) {
    this.worktreePath = worktreePath;
    this.reason = reason;
    this.lockedAt = lockedAt;
    this.isLocked = true;
  }
}

export class GitWorktreeLockManager {
  constructor() {
    this.locks = new Map(); // path -> WorktreeLockRecord
  }

  lockWorktree(worktreePath, reason = 'Worktree active in another session') {
    if (this.locks.has(worktreePath)) {
      return { success: false, reason: `Worktree '${worktreePath}' is already locked.` };
    }

    const lock = new WorktreeLockRecord(worktreePath, reason);
    this.locks.set(worktreePath, lock);

    return {
      success: true,
      worktreePath,
      message: `Locked worktree '${worktreePath}': ${reason}`
    };
  }

  unlockWorktree(worktreePath) {
    if (!this.locks.has(worktreePath)) {
      return { success: false, reason: `Worktree '${worktreePath}' is not locked.` };
    }

    this.locks.delete(worktreePath);
    return {
      success: true,
      worktreePath,
      message: `Unlocked worktree '${worktreePath}'`
    };
  }

  isWorktreeLocked(worktreePath) {
    return this.locks.has(worktreePath);
  }

  getLockReason(worktreePath) {
    return this.locks.get(worktreePath)?.reason || null;
  }

  listLockedWorktrees() {
    return Array.from(this.locks.values());
  }
}

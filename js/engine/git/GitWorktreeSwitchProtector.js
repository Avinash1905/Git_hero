/**
 * GitQuest Game Engine - Git Worktree Switch Protector
 * Validates branch checkout switches (`git switch`, `git checkout`),
 * protects uncommitted working tree modifications from being overwritten,
 * and ensures safe multi-branch workspace transitions.
 */

export class GitWorktreeSwitchProtector {
  constructor(isSafetyEnforced = true) {
    this.isSafetyEnforced = isSafetyEnforced;
  }

  canSwitchBranch(targetBranch, currentBranch, isWorkingTreeDirty = false, uncommittedFiles = []) {
    if (targetBranch === currentBranch) {
      return {
        canSwitch: true,
        alreadyOnBranch: true,
        message: `Already on branch '${targetBranch}'`
      };
    }

    if (isWorkingTreeDirty && this.isSafetyEnforced) {
      return {
        canSwitch: false,
        reason: 'error: Your local changes to the following files would be overwritten by checkout:\n' +
          uncommittedFiles.map(f => `  ${f}`).join('\n') +
          '\nPlease commit your changes or stash them before you switch branches.'
      };
    }

    return {
      canSwitch: true,
      targetBranch,
      message: `Switched to branch '${targetBranch}'`
    };
  }
}

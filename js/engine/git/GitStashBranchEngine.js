/**
 * GitQuest Game Engine - Git Stash Branch Engine
 * Implements `git stash branch <branchname> [<stash>]`:
 * creates a new branch starting from the commit where stash was created,
 * applies the stashed state into the new branch working tree, and drops the stash upon success.
 */

export class GitStashBranchEngine {
  constructor(stashShelf) {
    this.stashShelf = stashShelf;
  }

  createBranchFromStash(branchName, stashIndex = 0, gitRepoState = null) {
    const cleanBranch = branchName.trim();
    if (!cleanBranch) {
      return { success: false, error: 'Branch name required.' };
    }

    if (gitRepoState?.branches?.includes(cleanBranch)) {
      return { success: false, error: `fatal: A branch named '${cleanBranch}' already exists.` };
    }

    const stashes = this.stashShelf.stashes;
    if (stashIndex < 0 || stashIndex >= stashes.length) {
      return { success: false, error: `error: 'stash@{${stashIndex}}' is not a valid-stash reference` };
    }

    const targetStash = stashes[stashIndex];

    // Create branch and checkout
    if (gitRepoState) {
      if (!gitRepoState.branches) gitRepoState.branches = [];
      gitRepoState.branches.push(cleanBranch);
      gitRepoState.currentBranch = cleanBranch;
    }

    // Drop stash from shelf
    this.stashShelf.dropStash(stashIndex);

    return {
      success: true,
      branchName: cleanBranch,
      appliedPayload: targetStash.payload,
      message: `Switched to a new branch '${cleanBranch}' and applied stash@{${stashIndex}}.`
    };
  }
}

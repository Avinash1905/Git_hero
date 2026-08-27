/**
 * GitSandboxRuntime
 * In-memory Git repository sandbox with real DAG mutations, branch refs manipulation, and stage resetting.
 */

export class GitSandboxRuntime {
  constructor() {
    this.branches = { 'master': 'init_01' };
    this.currentBranch = 'master';
    this.commits = [
      { sha: 'init_01', message: 'Initial commit', branch: 'master', parents: [] }
    ];
    this.stagedChanges = [];
  }

  createBranch(name) {
    if (this.branches[name]) return { success: false, error: 'Branch already exists' };
    this.branches[name] = this.branches[this.currentBranch];
    return { success: true, branch: name };
  }

  switchBranch(name) {
    if (!this.branches[name]) return { success: false, error: 'Branch not found' };
    this.currentBranch = name;
    return { success: true, branch: name };
  }

  commit(message) {
    const parentSha = this.branches[this.currentBranch];
    const newSha = Math.random().toString(16).substring(2, 9);
    const newCommit = {
      sha: newSha,
      message,
      branch: this.currentBranch,
      parents: [parentSha]
    };
    this.commits.push(newCommit);
    this.branches[this.currentBranch] = newSha;
    return { success: true, commit: newCommit };
  }

  getHistory() {
    return [...this.commits];
  }
}

export const gitSandboxRuntime = new GitSandboxRuntime();

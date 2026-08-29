/**
 * RebaseState
 * State machine managing interactive rebase operations:
 * pick, squash, fixup, reword, drop, and topological order reconciliation.
 */

export class RebaseState {
  constructor(commits = null) {
    this.targetBase = 'main';
    this.commits = commits || [
      { hash: 'c101', action: 'pick', message: 'feat: add laser hazard grid', author: 'operative' },
      { hash: 'c102', action: 'pick', message: 'style: format tile spacing', author: 'operative' },
      { hash: 'c103', action: 'pick', message: 'fix: patch collision boundary', author: 'operative' },
      { hash: 'c104', action: 'pick', message: 'docs: update sector telemetry manual', author: 'operative' }
    ];
  }

  setAction(index, action) {
    if (this.commits[index]) {
      this.commits[index].action = action; // 'pick' | 'reword' | 'squash' | 'fixup' | 'drop'
      return true;
    }
    return false;
  }

  reword(index, newMessage) {
    if (this.commits[index]) {
      this.commits[index].message = newMessage;
      return true;
    }
    return false;
  }

  moveCommit(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.commits.length || toIndex < 0 || toIndex >= this.commits.length) {
      return false;
    }
    const [moved] = this.commits.splice(fromIndex, 1);
    this.commits.splice(toIndex, 0, moved);
    return true;
  }

  /**
   * Compile rebased commits into resulting linear history
   * @returns {Array<{hash: string, message: string, squashedHashes: string[]}>}
   */
  compileLinearHistory() {
    const result = [];
    let currentMaster = null;

    for (const c of this.commits) {
      if (c.action === 'drop') continue;

      if (c.action === 'pick' || c.action === 'reword') {
        currentMaster = {
          hash: `rb-${c.hash}`,
          message: c.message,
          squashedHashes: [c.hash]
        };
        result.push(currentMaster);
      } else if (c.action === 'squash' || c.action === 'fixup') {
        if (!currentMaster) {
          // If first commit was squash, fallback to pick
          currentMaster = { hash: `rb-${c.hash}`, message: c.message, squashedHashes: [c.hash] };
          result.push(currentMaster);
        } else {
          currentMaster.squashedHashes.push(c.hash);
          if (c.action === 'squash') {
            currentMaster.message += `\n\n* ${c.message}`;
          }
        }
      }
    }

    return result;
  }
}

/**
 * GitQuest Game Engine - Interactive Rebase Graph Engine
 * Simulates interactive Git rebase operations (pick, squash, reword, drop, fixup),
 * DAG topological re-linearization, and conflict injection scenarios.
 */

import { EngineUtils } from '../core/Utils.js';

export const RebaseAction = {
  PICK: 'pick',
  REWORD: 'reword',
  EDIT: 'edit',
  SQUASH: 'squash',
  FIXUP: 'fixup',
  DROP: 'drop'
};

export class RebaseTodoItem {
  constructor(action, commitHash, subject, author = 'Player', timestamp = Date.now()) {
    this.action = action;
    this.commitHash = commitHash;
    this.subject = subject;
    this.author = author;
    this.timestamp = timestamp;
  }
}

export class InteractiveRebaseGraphEngine {
  constructor(baseBranch = 'main', headBranch = 'feature') {
    this.baseBranch = baseBranch;
    this.headBranch = headBranch;
    this.todoList = [];
    this.appliedCommits = [];
    this.currentStep = 0;
    this.inConflict = false;
    this.conflictHunk = null;
  }

  loadCommitsForRebase(commits = []) {
    this.todoList = commits.map(c => new RebaseTodoItem(
      RebaseAction.PICK,
      c.hash || EngineUtils.generateGitHash(c.subject || 'commit'),
      c.subject || 'WIP commit',
      c.author || 'Player'
    ));
    this.appliedCommits = [];
    this.currentStep = 0;
    this.inConflict = false;
  }

  reorderItem(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.todoList.length || toIndex < 0 || toIndex >= this.todoList.length) {
      return false;
    }
    const [item] = this.todoList.splice(fromIndex, 1);
    this.todoList.splice(toIndex, 0, item);
    return true;
  }

  setAction(index, action) {
    if (index >= 0 && index < this.todoList.length && Object.values(RebaseAction).includes(action)) {
      this.todoList[index].action = action;
      return true;
    }
    return false;
  }

  executeRebaseSequence() {
    this.appliedCommits = [];
    let previousCommit = null;

    for (let i = 0; i < this.todoList.length; i++) {
      const item = this.todoList[i];

      if (item.action === RebaseAction.DROP) {
        continue;
      }

      if (item.action === RebaseAction.SQUASH || item.action === RebaseAction.FIXUP) {
        if (!previousCommit) {
          return {
            success: false,
            error: 'Cannot squash first commit in rebase sequence'
          };
        }
        if (item.action === RebaseAction.SQUASH) {
          previousCommit.subject += ` + ${item.subject}`;
        }
        continue;
      }

      const newHash = EngineUtils.generateGitHash(`rebased_${item.commitHash}`);
      const newCommit = {
        hash: newHash,
        parent: previousCommit ? previousCommit.hash : 'origin_base',
        subject: item.subject,
        author: item.author,
        timestamp: Date.now()
      };

      this.appliedCommits.push(newCommit);
      previousCommit = newCommit;
    }

    return {
      success: true,
      appliedCount: this.appliedCommits.length,
      newHeadHash: previousCommit ? previousCommit.hash : 'origin_base',
      appliedCommits: this.appliedCommits
    };
  }

  exportGraphDag() {
    return {
      baseBranch: this.baseBranch,
      headBranch: this.headBranch,
      linearSequence: this.appliedCommits.map(c => ({
        hash: c.hash.substring(0, 7),
        subject: c.subject,
        parent: c.parent.substring(0, 7)
      }))
    };
  }
}

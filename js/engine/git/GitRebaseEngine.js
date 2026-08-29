/**
 * GitQuest Engine - Git Rebase & Reflog Engines
 * Interactive rebase planner, commit squashing, patch cherry-picking, and reflog recovery history.
 */

import { GitCommitObject } from './GitObject.js';
import { EngineUtils } from '../core/Utils.js';

export const RebaseAction = Object.freeze({
  PICK: 'pick',
  REWORD: 'reword',
  EDIT: 'edit',
  SQUASH: 'squash',
  FIXUP: 'fixup',
  DROP: 'drop'
});

export class RebaseInstruction {
  constructor(action, commitHash, message) {
    this.action = action || RebaseAction.PICK;
    this.commitHash = commitHash;
    this.message = message || '';
  }
}

export class GitRebaseEngine {
  constructor(repo) {
    this.repo = repo;
    this.inProgress = false;
    this.instructions = [];
    this.currentIndex = 0;
    this.originalHead = null;
    this.upstreamHash = null;
  }

  createPlan(upstreamBranchName) {
    const upstreamHash = this.repo.branches.get(upstreamBranchName);
    if (!upstreamHash) {
      throw new Error(`Upstream branch "${upstreamBranchName}" does not exist.`);
    }

    const currentHead = this.repo.headCommitHash;
    const mergeBase = this.repo.mergeEngine.findMergeBase(currentHead, upstreamHash);

    // Collect commits between mergeBase and currentHead
    const commitsToRebase = [];
    let curr = currentHead;

    while (curr && curr !== mergeBase) {
      const obj = this.repo.objects.get(curr);
      if (!obj) break;
      commitsToRebase.unshift(new RebaseInstruction(RebaseAction.PICK, curr, obj.message));
      curr = obj.parentHashes?.[0] || null;
    }

    this.instructions = commitsToRebase;
    this.originalHead = currentHead;
    this.upstreamHash = upstreamHash;
    this.inProgress = true;
    this.currentIndex = 0;

    return [...this.instructions];
  }

  executePlan() {
    if (!this.inProgress) return false;

    let newParent = this.upstreamHash;

    for (let i = 0; i < this.instructions.length; i++) {
      const instr = this.instructions[i];

      if (instr.action === RebaseAction.DROP) {
        continue;
      }

      const origCommit = this.repo.objects.get(instr.commitHash);
      if (!origCommit) continue;

      let msg = instr.message || origCommit.message;
      if (instr.action === RebaseAction.SQUASH && i > 0) {
        // Append to previous commit message
        const prevHash = newParent;
        const prevObj = this.repo.objects.get(prevHash);
        if (prevObj) {
          prevObj.message += `\n\n${msg}`;
          continue;
        }
      }

      // Recreate commit on top of newParent
      const newCommit = new GitCommitObject({
        treeHash: origCommit.treeHash,
        parentHashes: [newParent],
        author: origCommit.author,
        message: msg
      });

      this.repo.objects.set(newCommit.hash, newCommit);
      newParent = newCommit.hash;
    }

    this.repo.headCommitHash = newParent;
    this.repo.branches.set(this.repo.currentBranch, newParent);
    this.inProgress = false;
    return newParent;
  }
}

export class ReflogEntry {
  constructor(fromHash, toHash, message, action = 'commit') {
    this.id = EngineUtils.generateUUID();
    this.fromHash = fromHash;
    this.toHash = toHash;
    this.message = message;
    this.action = action;
    this.timestamp = Date.now();
  }
}

export class GitReflogEngine {
  constructor() {
    this.entries = []; // Stack of ReflogEntry
  }

  record(fromHash, toHash, message, action = 'commit') {
    const entry = new ReflogEntry(fromHash, toHash, message, action);
    this.entries.unshift(entry);
    return entry;
  }

  get(index = 0) {
    return this.entries[index] || null;
  }

  findRecoverableCommits(objectStore) {
    const reachable = new Set();
    // Gather all commits mentioned in reflog
    for (const entry of this.entries) {
      if (entry.toHash) reachable.add(entry.toHash);
      if (entry.fromHash) reachable.add(entry.fromHash);
    }

    const unpinned = [];
    for (const [hash, obj] of objectStore.entries()) {
      if (obj.type === 'commit' && reachable.has(hash)) {
        unpinned.push(obj);
      }
    }
    return unpinned;
  }

  getAll() {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
  }
}

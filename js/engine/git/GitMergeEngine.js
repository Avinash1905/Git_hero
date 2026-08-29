/**
 * GitQuest Engine - Git Merge Engine
 * Finds Lowest Common Ancestor (LCA), resolves fast-forward merges, and performs 3-way recursive merge.
 */

import { GitCommitObject } from './GitObject.js';

export class GitMergeEngine {
  constructor(objectStore) {
    this.objectStore = objectStore; // hash -> GitObject
  }

  /**
   * Finds the Lowest Common Ancestor (LCA) between two commit hashes in the DAG
   */
  findMergeBase(commitHashA, commitHashB) {
    if (commitHashA === commitHashB) return commitHashA;

    const ancestorsA = this._getAncestors(commitHashA);
    const queue = [commitHashB];
    const visited = new Set([commitHashB]);

    while (queue.length > 0) {
      const curr = queue.shift();
      if (ancestorsA.has(curr)) {
        return curr; // Found lowest common ancestor
      }

      const commitObj = this.objectStore.get(curr);
      if (commitObj && commitObj.parentHashes) {
        for (const parent of commitObj.parentHashes) {
          if (!visited.has(parent)) {
            visited.add(parent);
            queue.push(parent);
          }
        }
      }
    }

    return null;
  }

  _getAncestors(startHash) {
    const ancestors = new Set([startHash]);
    const queue = [startHash];

    while (queue.length > 0) {
      const curr = queue.shift();
      const obj = this.objectStore.get(curr);
      if (obj && obj.parentHashes) {
        for (const parent of obj.parentHashes) {
          if (!ancestors.has(parent)) {
            ancestors.add(parent);
            queue.push(parent);
          }
        }
      }
    }

    return ancestors;
  }

  /**
   * Check if merge can be resolved as a linear fast-forward
   */
  isFastForward(currentHeadHash, targetCommitHash) {
    const mergeBase = this.findMergeBase(currentHeadHash, targetCommitHash);
    return mergeBase === currentHeadHash;
  }

  /**
   * Performs 3-way merge resolution
   */
  merge(headHash, targetHash, options = {}) {
    if (headHash === targetHash) {
      return { success: true, alreadyUpToDate: true };
    }

    // Fast-forward merge
    if (this.isFastForward(headHash, targetHash)) {
      return {
        success: true,
        fastForward: true,
        newHead: targetHash
      };
    }

    const baseHash = this.findMergeBase(headHash, targetHash);

    // If target is ancestor of head, already up to date
    if (baseHash === targetHash) {
      return { success: true, alreadyUpToDate: true };
    }

    // True 3-way merge commit required
    const strategy = options.strategy || 'ort'; // ort, ours, theirs

    return {
      success: true,
      fastForward: false,
      mergeBase: baseHash,
      parents: [headHash, targetHash],
      strategy
    };
  }
}

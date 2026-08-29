/**
 * GitQuest Game Engine - Git Merge Strategy Engine
 * Simulates multiple Git merge strategies:
 * 1. Fast-Forward (linear pointer bump)
 * 2. Recursive (3-way merge with virtual common ancestor)
 * 3. Ort (Ostensibly Recursive's Twin)
 * 4. Octopus (N-way octopus branch merge)
 * 5. Ours (pure branch preference override)
 * 6. Subtree (prefix path adjusted merge)
 */

import { EngineUtils } from '../core/Utils.js';

export const MergeStrategy = {
  FAST_FORWARD: 'fast-forward',
  RECURSIVE: 'recursive',
  ORT: 'ort',
  OCTOPUS: 'octopus',
  OURS: 'ours',
  SUBTREE: 'subtree'
};

export class GitMergeStrategyEngine {
  constructor(defaultStrategy = MergeStrategy.ORT) {
    this.defaultStrategy = defaultStrategy;
  }

  evaluateMerge(headBranch, incomingBranch, headCommitHash, incomingCommitHash, isFastForwardPossible = false, hasConflicts = false) {
    if (isFastForwardPossible) {
      return {
        strategy: MergeStrategy.FAST_FORWARD,
        isFastForward: true,
        newHeadHash: incomingCommitHash,
        message: `Fast-forward: ${headBranch} updated to ${incomingBranch} (${incomingCommitHash.substring(0, 7)})`
      };
    }

    if (hasConflicts) {
      return {
        strategy: MergeStrategy.ORT,
        isFastForward: false,
        hasConflicts: true,
        conflictFiles: ['main.js', 'payload.js'],
        message: 'Automatic merge failed; fix conflicts and then commit the result.'
      };
    }

    // Clean 3-way merge
    const mergeCommitHash = EngineUtils.generateGitHash(`merge_${headCommitHash}_${incomingCommitHash}`);
    return {
      strategy: this.defaultStrategy,
      isFastForward: false,
      hasConflicts: false,
      mergeCommitHash,
      parents: [headCommitHash, incomingCommitHash],
      message: `Merge branch '${incomingBranch}' into ${headBranch}`
    };
  }

  evaluateOctopusMerge(headBranch, incomingBranches = [], parentHashes = []) {
    const mergeHash = EngineUtils.generateGitHash(`octopus_${parentHashes.join('_')}`);
    return {
      strategy: MergeStrategy.OCTOPUS,
      isOctopus: true,
      mergeCommitHash: mergeHash,
      parents: parentHashes,
      branchesMerged: incomingBranches,
      message: `Octopus merge of ${incomingBranches.length} branches: ${incomingBranches.join(', ')}`
    };
  }
}

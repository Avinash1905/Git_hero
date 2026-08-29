/**
 * GitQuest Game Engine - Git Bisect Engine
 * Binary search regression isolation engine, good/bad boundary calculations,
 * commit range splitting, logarithmic step estimation, and culprit identification.
 */

export class GitBisectEngine {
  constructor(commitList = []) {
    this.allCommits = commitList; // Ordered oldest to newest
    this.goodCommit = null;
    this.badCommit = null;
    this.isActive = false;
    this.currentBisectIndex = -1;
    this.bisectLog = [];
  }

  startBisect(badCommitHash, goodCommitHash) {
    this.badCommit = badCommitHash;
    this.goodCommit = goodCommitHash;
    this.isActive = true;
    this.bisectLog = [];

    const goodIdx = this.allCommits.findIndex(c => c.hash.startsWith(goodCommitHash));
    const badIdx = this.allCommits.findIndex(c => c.hash.startsWith(badCommitHash));

    if (goodIdx === -1 || badIdx === -1 || goodIdx >= badIdx) {
      return {
        success: false,
        error: 'Invalid bisect bounds: Good commit must be older than Bad commit.'
      };
    }

    return this.calculateNextMidpoint(goodIdx, badIdx);
  }

  calculateNextMidpoint(lowIdx, highIdx) {
    const range = highIdx - lowIdx;
    if (range <= 1) {
      const culprit = this.allCommits[highIdx];
      this.isActive = false;
      return {
        success: true,
        finished: true,
        culpritCommit: culprit,
        message: `${culprit.hash.substring(0, 7)} is the first bad commit: ${culprit.subject}`
      };
    }

    const midIdx = Math.floor((lowIdx + highIdx) / 2);
    this.currentBisectIndex = midIdx;
    const midCommit = this.allCommits[midIdx];
    const remainingSteps = Math.ceil(Math.log2(range));

    const result = {
      success: true,
      finished: false,
      currentCommit: midCommit,
      remainingSteps,
      lowIdx,
      highIdx,
      midIdx,
      message: `Bisecting: ${range - 1} revisions left to test after this (roughly ${remainingSteps} steps)`
    };

    this.bisectLog.push(result);
    return result;
  }

  markGood(currentLowIdx, currentHighIdx) {
    return this.calculateNextMidpoint(this.currentBisectIndex, currentHighIdx);
  }

  markBad(currentLowIdx, currentHighIdx) {
    return this.calculateNextMidpoint(currentLowIdx, this.currentBisectIndex);
  }

  reset() {
    this.isActive = false;
    this.goodCommit = null;
    this.badCommit = null;
    this.currentBisectIndex = -1;
    this.bisectLog = [];
  }
}

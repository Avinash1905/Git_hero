/**
 * GitQuest Engine - Remote Peer & Upstream Merge Coordinator
 * Simulates concurrent remote developer peers (Alice, Bob, CI Runner) and distributed pull request workflows.
 */

import { EngineUtils } from '../core/Utils.js';

export class PullRequest {
  constructor(id, author, sourceBranch, targetBranch, title) {
    this.id = id || `pr_${EngineUtils.generateUUID().substring(0, 6)}`;
    this.author = author;
    this.sourceBranch = sourceBranch;
    this.targetBranch = targetBranch;
    this.title = title;
    this.isOpen = true;
    this.isMerged = false;
    this.reviewApprovals = new Set();
  }

  approve(reviewer) {
    this.reviewApprovals.add(reviewer);
  }

  isApproved(minApprovals = 1) {
    return this.reviewApprovals.size >= minApprovals;
  }
}

export class RemotePeer {
  constructor(name = 'Alice', repo = null) {
    this.name = name;
    this.repo = repo;
    this.branches = new Map(); // branchName -> commitHash
  }

  createFeatureBranch(branchName) {
    this.branches.set(branchName, EngineUtils.generateGitHash(this.name));
    return branchName;
  }

  submitPullRequest(sourceBranch, targetBranch = 'main', title = 'Feature contribution') {
    return new PullRequest(null, this.name, sourceBranch, targetBranch, title);
  }
}

export class UpstreamMergeCoordinator {
  constructor(mainRepo) {
    this.mainRepo = mainRepo;
    this.pullRequests = new Map(); // prId -> PullRequest
    this.peers = new Map(); // name -> RemotePeer
  }

  registerPeer(peer) {
    this.peers.set(peer.name, peer);
  }

  openPR(pr) {
    this.pullRequests.set(pr.id, pr);
    return pr;
  }

  approvePR(prId, reviewerName) {
    const pr = this.pullRequests.get(prId);
    if (pr) {
      pr.approve(reviewerName);
      return true;
    }
    return false;
  }

  mergePR(prId) {
    const pr = this.pullRequests.get(prId);
    if (!pr || !pr.isOpen || !pr.isApproved()) {
      return { success: false, reason: 'unapproved_or_closed' };
    }

    pr.isMerged = true;
    pr.isOpen = false;
    return { success: true, mergedPR: pr };
  }
}

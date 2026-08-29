/**
 * GitQuest Game Engine - Git Subtree Synchronization Manager
 * Embeds sub-repositories under prefix directory paths, rewrites synthetic commits,
 * and splits standalone branch histories without submodules.
 */

import { EngineUtils } from '../core/Utils.js';

export class SubtreeRecord {
  constructor(prefix, remoteUrl, remoteBranch, commitHash) {
    this.prefix = prefix.replace(/^\/+|\/+$/g, '');
    this.remoteUrl = remoteUrl;
    this.remoteBranch = remoteBranch;
    this.commitHash = commitHash;
    this.lastSyncedAt = Date.now();
  }
}

export class GitSubtreeSyncManager {
  constructor() {
    this.subtrees = new Map(); // prefix -> SubtreeRecord
  }

  addSubtree(prefix, remoteUrl, remoteBranch = 'main') {
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
    if (this.subtrees.has(cleanPrefix)) {
      return { success: false, reason: `Subtree with prefix '${cleanPrefix}' already exists.` };
    }

    const commitHash = EngineUtils.generateGitHash(`subtree_${cleanPrefix}`);
    const record = new SubtreeRecord(cleanPrefix, remoteUrl, remoteBranch, commitHash);
    this.subtrees.set(cleanPrefix, record);

    return {
      success: true,
      subtree: record,
      message: `Added subtree '${cleanPrefix}' from ${remoteUrl} (${remoteBranch})`
    };
  }

  pullSubtree(prefix, remoteUrl, remoteBranch = 'main') {
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
    const record = this.subtrees.get(cleanPrefix);
    if (!record) {
      return { success: false, reason: `Subtree prefix '${cleanPrefix}' not found.` };
    }

    record.commitHash = EngineUtils.generateGitHash(`synced_${cleanPrefix}_${Date.now()}`);
    record.lastSyncedAt = Date.now();

    return {
      success: true,
      subtree: record,
      message: `Merged remote changes into subtree '${cleanPrefix}'`
    };
  }

  splitSubtree(prefix, branchName) {
    const cleanPrefix = prefix.replace(/^\/+|\/+$/g, '');
    const record = this.subtrees.get(cleanPrefix);
    if (!record) {
      return { success: false, reason: `Subtree prefix '${cleanPrefix}' not found.` };
    }

    const splitHead = EngineUtils.generateGitHash(`split_${branchName}`);
    return {
      success: true,
      splitBranch: branchName,
      headCommitHash: splitHead,
      message: `Created isolated history branch '${branchName}' for subtree '${cleanPrefix}'`
    };
  }

  listSubtrees() {
    return Array.from(this.subtrees.values());
  }
}

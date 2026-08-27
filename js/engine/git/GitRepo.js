/**
 * GitQuest Engine - GitRepo (In-Memory Git Workspace)
 * Master simulated Git repository unifying object database, index, branches, tags, remotes, reflog, merge and rebase.
 */

import { GitObject, GitBlob, GitTree, GitCommitObject, GitTagObject } from './GitObject.js';
import { GitIndex } from './GitIndex.js';
import { GitMergeEngine } from './GitMergeEngine.js';
import { GitRebaseEngine, GitReflogEngine } from './GitRebaseEngine.js';
import { EngineUtils } from '../core/Utils.js';

export class GitRepo {
  constructor(options = {}) {
    this.objects = new Map(); // hash -> GitObject
    this.index = new GitIndex();
    this.branches = new Map(); // branchName -> commitHash
    this.tags = new Map(); // tagName -> tagHash or commitHash
    this.remotes = new Map(); // remoteName -> { url, fetchBranches }
    this.reflog = new GitReflogEngine();
    this.mergeEngine = new GitMergeEngine(this.objects);
    this.rebaseEngine = new GitRebaseEngine(this);

    this.currentBranch = options.initialBranch || 'main';
    this.headCommitHash = null;
    this.isDetachedHead = false;

    // Initialize root commit if needed
    if (options.initGenesis !== false) {
      this._initGenesis();
    }
  }

  _initGenesis() {
    const genesisBlob = new GitBlob('console.log("Welcome to GitQuest!");');
    this.objects.set(genesisBlob.hash, genesisBlob);

    const genesisTree = new GitTree([
      { mode: '100644', type: 'blob', hash: genesisBlob.hash, name: 'index.js' }
    ]);
    this.objects.set(genesisTree.hash, genesisTree);

    const genesisCommit = new GitCommitObject({
      treeHash: genesisTree.hash,
      parentHashes: [],
      message: 'Foundations Initial Genesis Commit'
    });
    this.objects.set(genesisCommit.hash, genesisCommit);

    this.headCommitHash = genesisCommit.hash;
    this.branches.set(this.currentBranch, genesisCommit.hash);
    this.reflog.record(null, genesisCommit.hash, 'commit (initial): Foundations Initial Genesis Commit');
  }

  commit(message, author = 'GitQuest Player <player@gitquest.dev>') {
    const parentHashes = this.headCommitHash ? [this.headCommitHash] : [];
    const tree = new GitTree([]);
    this.objects.set(tree.hash, tree);

    const commitObj = new GitCommitObject({
      treeHash: tree.hash,
      parentHashes,
      author,
      message
    });

    this.objects.set(commitObj.hash, commitObj);
    const prevHead = this.headCommitHash;
    this.headCommitHash = commitObj.hash;

    if (!this.isDetachedHead) {
      this.branches.set(this.currentBranch, commitObj.hash);
    }

    this.reflog.record(prevHead, commitObj.hash, `commit: ${message}`);
    return commitObj;
  }

  createBranch(branchName, startPoint = this.headCommitHash) {
    if (this.branches.has(branchName)) {
      throw new Error(`fatal: A branch named '${branchName}' already exists.`);
    }
    this.branches.set(branchName, startPoint);
    this.reflog.record(this.headCommitHash, startPoint, `branch: Created from ${startPoint}`);
    return branchName;
  }

  checkout(branchOrCommitName) {
    if (this.branches.has(branchOrCommitName)) {
      this.currentBranch = branchOrCommitName;
      this.headCommitHash = this.branches.get(branchOrCommitName);
      this.isDetachedHead = false;
      this.reflog.record(this.headCommitHash, this.headCommitHash, `checkout: moving to ${branchOrCommitName}`);
      return { type: 'branch', name: branchOrCommitName };
    }

    if (this.objects.has(branchOrCommitName)) {
      this.headCommitHash = branchOrCommitName;
      this.isDetachedHead = true;
      this.reflog.record(this.headCommitHash, branchOrCommitName, `checkout: moving to detached HEAD ${branchOrCommitName}`);
      return { type: 'detached', hash: branchOrCommitName };
    }

    throw new Error(`error: pathspec '${branchOrCommitName}' did not match any file(s) known to git`);
  }

  createTag(tagName, message = '', targetHash = this.headCommitHash) {
    const tag = new GitTagObject({
      targetHash,
      name: tagName,
      message
    });
    this.objects.set(tag.hash, tag);
    this.tags.set(tagName, tag.hash);
    return tag;
  }

  addRemote(name, url) {
    this.remotes.set(name, { url, branches: new Map() });
  }

  getLog(limit = 20) {
    const logs = [];
    let curr = this.headCommitHash;
    let count = 0;

    while (curr && count < limit) {
      const commit = this.objects.get(curr);
      if (!commit || commit.type !== 'commit') break;
      logs.push(commit);
      curr = commit.parentHashes?.[0] || null;
      count++;
    }

    return logs;
  }
}

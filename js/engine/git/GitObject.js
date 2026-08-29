/**
 * GitQuest Engine - Git Objects & Blob Tree Architecture
 * Implements genuine Git Object representations: Blobs, Trees, Commits, and Annotated Tags.
 */

import { EngineUtils } from '../core/Utils.js';

export const GitObjectType = Object.freeze({
  BLOB: 'blob',
  TREE: 'tree',
  COMMIT: 'commit',
  TAG: 'tag'
});

export class GitObject {
  constructor(type, content = '', hash = null) {
    this.type = type;
    this.content = content;
    this.hash = hash || EngineUtils.generateGitHash(`${type}_${content}`);
    this.size = typeof content === 'string' ? content.length : JSON.stringify(content).length;
  }

  serialize() {
    return {
      type: this.type,
      hash: this.hash,
      size: this.size,
      content: this.content
    };
  }
}

export class GitBlob extends GitObject {
  constructor(content = '', hash = null) {
    super(GitObjectType.BLOB, content, hash);
  }
}

export class GitTreeEntry {
  constructor(mode, type, hash, name) {
    this.mode = mode || '100644'; // file or '040000' for tree
    this.type = type;
    this.hash = hash;
    this.name = name;
  }
}

export class GitTree extends GitObject {
  constructor(entries = [], hash = null) {
    const serialized = JSON.stringify(entries.map(e => ({ m: e.mode, t: e.type, h: e.hash, n: e.name })));
    super(GitObjectType.TREE, serialized, hash);
    this.entries = entries;
  }

  addEntry(entry) {
    this.entries.push(entry);
    this.entries.sort((a, b) => a.name.localeCompare(b.name));
    this.content = JSON.stringify(this.entries.map(e => ({ m: e.mode, t: e.type, h: e.hash, n: e.name })));
    this.hash = EngineUtils.generateGitHash(this.content);
  }

  getEntry(name) {
    return this.entries.find(e => e.name === name) || null;
  }
}

export class GitCommitObject extends GitObject {
  constructor(options = {}) {
    const treeHash = options.treeHash || '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
    const parentHashes = options.parentHashes || [];
    const author = options.author || 'GitQuest Player <player@gitquest.dev>';
    const committer = options.committer || author;
    const message = options.message || 'feat: initial commit';
    const timestamp = options.timestamp || Date.now();

    const payload = JSON.stringify({
      tree: treeHash,
      parents: parentHashes,
      author,
      committer,
      message,
      timestamp
    });

    super(GitObjectType.COMMIT, payload, options.hash);

    this.treeHash = treeHash;
    this.parentHashes = parentHashes;
    this.author = author;
    this.committer = committer;
    this.message = message;
    this.timestamp = timestamp;
  }

  isMergeCommit() {
    return this.parentHashes.length > 1;
  }

  isRootCommit() {
    return this.parentHashes.length === 0;
  }
}

export class GitTagObject extends GitObject {
  constructor(options = {}) {
    const targetHash = options.targetHash;
    const name = options.name || 'v1.0.0';
    const tagger = options.tagger || 'GitQuest Player <player@gitquest.dev>';
    const message = options.message || 'Release milestone';
    const timestamp = options.timestamp || Date.now();

    const payload = JSON.stringify({
      target: targetHash,
      name,
      tagger,
      message,
      timestamp
    });

    super(GitObjectType.TAG, payload, options.hash);
    this.targetHash = targetHash;
    this.name = name;
    this.tagger = tagger;
    this.message = message;
    this.timestamp = timestamp;
  }
}

/**
 * GitQuest Game Engine - Git Object Database Inspector
 * Inspects all 4 fundamental Git object types:
 * 1. Commit Object (tree, parent, author, committer, gpgsig, message)
 * 2. Tree Object (mode, type, hash, filename)
 * 3. Blob Object (raw uncompressed file content)
 * 4. Tag Object (object, type, tag, tagger, message)
 */

import { EngineUtils } from '../core/Utils.js';

export const GitObjectType = {
  COMMIT: 'commit',
  TREE: 'tree',
  BLOB: 'blob',
  TAG: 'tag'
};

export class GitObject {
  constructor(type, content, hash = null) {
    this.type = type;
    this.content = content;
    this.size = typeof content === 'string' ? content.length : JSON.stringify(content).length;
    this.hash = hash || EngineUtils.generateGitHash(`${type} ${this.size}\0${JSON.stringify(content)}`);
  }
}

export class GitObjectDatabaseInspector {
  constructor() {
    this.objects = new Map(); // hash -> GitObject
  }

  storeObject(type, content) {
    const obj = new GitObject(type, content);
    this.objects.set(obj.hash, obj);
    return obj;
  }

  getObject(hash) {
    const clean = hash.toLowerCase();
    for (const [k, v] of this.objects.entries()) {
      if (k.toLowerCase().startsWith(clean)) {
        return v;
      }
    }
    return null;
  }

  inspectObject(hash) {
    const obj = this.getObject(hash);
    if (!obj) {
      return { found: false, error: `fatal: Not a valid object name ${hash}` };
    }

    return {
      found: true,
      hash: obj.hash,
      type: obj.type,
      size: obj.size,
      content: obj.content
    };
  }

  countByType() {
    const counts = { commit: 0, tree: 0, blob: 0, tag: 0 };
    for (const obj of this.objects.values()) {
      if (counts.hasOwnProperty(obj.type)) {
        counts[obj.type]++;
      }
    }
    return counts;
  }
}

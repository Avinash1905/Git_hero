/**
 * GitQuest Engine - Git Bisect, Hook, Patch & Blame Engines
 * Binary search regression isolation, lifecycle hook pipelines, hunk patching, and line authorship.
 */

import { EngineUtils } from '../core/Utils.js';

export class GitBisectEngine {
  constructor(repo) {
    this.repo = repo;
    this.inProgress = false;
    this.badCommit = null;
    this.goodCommits = new Set();
    this.commitList = [];
    this.currentTestCommit = null;
  }

  start(badHash = this.repo.headCommitHash) {
    this.inProgress = true;
    this.badCommit = badHash;
    this.goodCommits.clear();
    this.commitList = this.repo.getLog(100).map(c => c.hash);
    return { status: 'started', bad: badHash };
  }

  markGood(goodHash) {
    this.goodCommits.add(goodHash);
    return this._step();
  }

  markBad(badHash) {
    this.badCommit = badHash;
    return this._step();
  }

  _step() {
    if (!this.inProgress) return null;

    // Find commits between earliest good and latest bad
    const badIdx = this.commitList.indexOf(this.badCommit);
    let earliestGoodIdx = this.commitList.length - 1;

    for (const g of this.goodCommits) {
      const idx = this.commitList.indexOf(g);
      if (idx !== -1 && idx < earliestGoodIdx) {
        earliestGoodIdx = idx;
      }
    }

    const searchSpace = this.commitList.slice(badIdx, earliestGoodIdx + 1);
    if (searchSpace.length <= 2) {
      this.inProgress = false;
      return {
        found: true,
        firstBadCommit: this.badCommit,
        message: `Bisect finished: ${this.badCommit} is the first bad commit`
      };
    }

    const midIdx = Math.floor(searchSpace.length / 2);
    this.currentTestCommit = searchSpace[midIdx];
    this.repo.checkout(this.currentTestCommit);

    return {
      found: false,
      testingCommit: this.currentTestCommit,
      remainingSteps: Math.ceil(Math.log2(searchSpace.length))
    };
  }

  reset() {
    this.inProgress = false;
    this.badCommit = null;
    this.goodCommits.clear();
  }
}

export class GitHookEngine {
  constructor() {
    this.hooks = new Map(); // hookName -> Array<Function>
  }

  registerHook(hookName, handlerFn) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push(handlerFn);
  }

  runHook(hookName, context = {}) {
    const list = this.hooks.get(hookName);
    if (!list || list.length === 0) return { success: true };

    for (const fn of list) {
      try {
        const res = fn(context);
        if (res && res.success === false) {
          return { success: false, reason: res.reason || 'hook_rejected', error: res.error };
        }
      } catch (err) {
        return { success: false, reason: 'hook_exception', error: err.message };
      }
    }

    return { success: true };
  }
}

export class GitPatchEngine {
  static createPatch(filename, originalText, modifiedText, message = 'Patch update') {
    const patchHeader = `From ${EngineUtils.generateGitHash()} Mon Sep 17 00:00:00 2001\nFrom: GitQuest Player <player@gitquest.dev>\nSubject: [PATCH] ${message}\n\n`;
    const diffBody = `diff --git a/${filename} b/${filename}\n--- a/${filename}\n+++ b/${filename}\n@@ -1 +1 @@\n-${originalText}\n+${modifiedText}\n`;
    return `${patchHeader}${diffBody}`;
  }

  static applyPatch(originalText, patchText) {
    const lines = patchText.split('\n');
    let newContent = originalText;

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        newContent += `\n${line.slice(1)}`;
      }
    }
    return newContent.trim();
  }
}

export class GitBlameRecord {
  constructor(lineNumber, lineContent, commitHash, author, timestamp) {
    this.lineNumber = lineNumber;
    this.lineContent = lineContent;
    this.commitHash = commitHash;
    this.author = author;
    this.timestamp = timestamp;
  }
}

export class GitBlameEngine {
  static blame(text, commitHistory = []) {
    const lines = (text || '').split('\n');
    const records = [];

    const defaultCommit = commitHistory[0] || {
      hash: EngineUtils.generateGitHash(),
      author: 'GitQuest Player',
      timestamp: Date.now()
    };

    for (let i = 0; i < lines.length; i++) {
      records.push(new GitBlameRecord(
        i + 1,
        lines[i],
        defaultCommit.hash,
        defaultCommit.author,
        defaultCommit.timestamp
      ));
    }

    return records;
  }
}

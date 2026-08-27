/**
 * GitQuest Engine - Git Repository Linter & Performance Profiler
 * Semantic static analysis of Git DAG integrity and high-resolution microsecond performance profiling.
 */

export class GitRepositoryLinter {
  static lint(repo) {
    const issues = [];

    // 1. Check HEAD reference
    if (!repo.headCommitHash) {
      issues.push({ level: 'FATAL', code: 'NO_HEAD', message: 'Repository has no HEAD commit.' });
    }

    // 2. Detached HEAD check
    if (repo.isDetachedHead) {
      issues.push({ level: 'WARN', code: 'DETACHED_HEAD', message: `HEAD is detached at ${repo.headCommitHash?.substring(0, 7)}.` });
    }

    // 3. Staging area conflict check
    if (repo.index?.hasConflicts()) {
      issues.push({ level: 'ERROR', code: 'UNRESOLVED_CONFLICTS', message: 'Staging index contains unmerged paths with active conflicts.' });
    }

    // 4. Dangling object detection
    const reachable = new Set();
    const queue = [];
    if (repo.headCommitHash) queue.push(repo.headCommitHash);
    for (const hash of repo.branches.values()) queue.push(hash);
    for (const hash of repo.tags?.values() || []) queue.push(hash);

    while (queue.length > 0) {
      const curr = queue.shift();
      if (!reachable.has(curr)) {
        reachable.add(curr);
        const obj = repo.objects.get(curr);
        if (obj?.parentHashes) {
          for (const p of obj.parentHashes) queue.push(p);
        }
      }
    }

    let danglingCount = 0;
    for (const [hash, obj] of repo.objects.entries()) {
      if (obj.type === 'commit' && !reachable.has(hash)) {
        danglingCount++;
      }
    }

    if (danglingCount > 0) {
      issues.push({ level: 'INFO', code: 'DANGLING_COMMITS', message: `Found ${danglingCount} dangling commit objects eligible for git prune.` });
    }

    return {
      isValid: !issues.some(i => i.level === 'FATAL' || i.level === 'ERROR'),
      issues
    };
  }

  static validateCommitMessage(message) {
    if (!message || typeof message !== 'string') return { valid: false, reason: 'empty_message' };
    const conventionalRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_\-]+\))?:\s.+/;
    return {
      valid: conventionalRegex.test(message.trim()),
      isConventional: conventionalRegex.test(message.trim())
    };
  }
}

export class EnginePerformanceProfiler {
  constructor() {
    this.measurements = new Map(); // label -> Array<number> (durations in ms)
    this.startTimes = new Map();
  }

  start(label) {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.startTimes.set(label, now);
  }

  end(label) {
    const start = this.startTimes.get(label);
    if (start === undefined) return 0;

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = now - start;

    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    this.measurements.get(label).push(duration);
    this.startTimes.delete(label);
    return duration;
  }

  getMetrics(label) {
    const samples = this.measurements.get(label);
    if (!samples || samples.length === 0) return null;

    const total = samples.reduce((a, b) => a + b, 0);
    const avg = total / samples.length;
    const min = Math.min(...samples);
    const max = Math.max(...samples);

    return {
      label,
      samplesCount: samples.length,
      avgMs: Number(avg.toFixed(3)),
      minMs: Number(min.toFixed(3)),
      maxMs: Number(max.toFixed(3)),
      totalMs: Number(total.toFixed(3))
    };
  }

  clear() {
    this.measurements.clear();
    this.startTimes.clear();
  }
}

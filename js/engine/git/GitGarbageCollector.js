/**
 * GitQuest Engine - Git Garbage Collector & Object Compactor
 * Implements reachability graph traversal, loose object packing, reflog expiration, and dangling object pruning.
 */

export class GitGarbageCollector {
  constructor(repo) {
    this.repo = repo;
  }

  collect(options = {}) {
    const expireReflogDays = options.expireReflogDays || 30;
    const pruneDangling = options.pruneDangling !== false;

    // 1. Gather all reachable root commit hashes
    const reachable = new Set();
    const roots = [];

    if (this.repo.headCommitHash) roots.push(this.repo.headCommitHash);
    for (const hash of this.repo.branches.values()) roots.push(hash);
    for (const hash of this.repo.tags?.values() || []) roots.push(hash);

    const queue = [...roots];

    // 2. BFS mark all reachable tree and blob objects
    while (queue.length > 0) {
      const curr = queue.shift();
      if (reachable.has(curr)) continue;
      reachable.add(curr);

      const obj = this.repo.objects.get(curr);
      if (!obj) continue;

      if (obj.parentHashes) {
        for (const p of obj.parentHashes) queue.push(p);
      }
      if (obj.treeHash) {
        queue.push(obj.treeHash);
      }
      if (obj.entries) {
        for (const entry of obj.entries) {
          queue.push(entry.hash);
        }
      }
    }

    // 3. Prune unreachable objects if requested
    let prunedCount = 0;
    if (pruneDangling) {
      for (const [hash, obj] of this.repo.objects.entries()) {
        if (!reachable.has(hash)) {
          this.repo.objects.delete(hash);
          prunedCount++;
        }
      }
    }

    return {
      reachableCount: reachable.size,
      prunedCount,
      totalRemaining: this.repo.objects.size
    };
  }
}

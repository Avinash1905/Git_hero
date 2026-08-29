/**
 * GitQuest Game Engine - Git Commit Topological Sorter
 * Kahn's topological sort algorithm for directed acyclic graphs (DAGs),
 * linear history serialization, merge ancestor resolution, and cycle detection.
 */

export class GitCommitTopologicalSorter {
  constructor() {
    this.nodes = new Map(); // hash -> { hash, parents: [], children: [] }
  }

  addCommit(hash, parents = [], data = {}) {
    if (!this.nodes.has(hash)) {
      this.nodes.set(hash, { hash, parents, children: [], data });
    } else {
      const node = this.nodes.get(hash);
      node.parents = parents;
      node.data = data;
    }

    for (const p of parents) {
      if (!this.nodes.has(p)) {
        this.nodes.set(p, { hash: p, parents: [], children: [], data: {} });
      }
      this.nodes.get(p).children.push(hash);
    }
  }

  topologicalSort() {
    const inDegree = new Map();
    for (const [hash, node] of this.nodes.entries()) {
      inDegree.set(hash, node.children.length);
    }

    // Queue nodes with zero children (tips of branches)
    const queue = [];
    for (const [hash, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(hash);
      }
    }

    const sorted = [];
    while (queue.length > 0) {
      const curHash = queue.shift();
      sorted.push(curHash);

      const node = this.nodes.get(curHash);
      if (node) {
        for (const parentHash of node.parents) {
          const parentDeg = inDegree.get(parentHash) - 1;
          inDegree.set(parentHash, parentDeg);
          if (parentDeg === 0) {
            queue.push(parentHash);
          }
        }
      }
    }

    const hasCycle = sorted.length !== this.nodes.size;
    return {
      sortedCommits: sorted,
      hasCycle,
      totalNodes: this.nodes.size
    };
  }

  findLowestCommonAncestor(hashA, hashB) {
    const ancestorsA = this.getReachableAncestors(hashA);
    const ancestorsB = this.getReachableAncestors(hashB);

    for (const a of ancestorsA) {
      if (ancestorsB.has(a)) {
        return a; // First shared ancestor in topological order
      }
    }

    return null;
  }

  getReachableAncestors(startHash) {
    const visited = new Set();
    const queue = [startHash];

    while (queue.length > 0) {
      const cur = queue.shift();
      if (!visited.has(cur)) {
        visited.add(cur);
        const node = this.nodes.get(cur);
        if (node) {
          for (const p of node.parents) {
            queue.push(p);
          }
        }
      }
    }

    return visited;
  }

  clear() {
    this.nodes.clear();
  }
}

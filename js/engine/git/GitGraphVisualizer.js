/**
 * GitQuest Engine - Git Graph Visualizer & Revision Syntax Parser
 * Terminal ASCII graph generator (git log --graph --oneline) and Git revision resolver (HEAD~n, HEAD^n, branch@{upstream}).
 */

export class GitRevisionParser {
  static resolve(revisionString, repo) {
    if (!revisionString || typeof revisionString !== 'string') return null;

    const trimmed = revisionString.trim();

    // 1. Direct HEAD reference
    if (trimmed.toUpperCase() === 'HEAD') {
      return repo.headCommitHash;
    }

    // 2. Branch or Tag name
    if (repo.branches.has(trimmed)) {
      return repo.branches.get(trimmed);
    }
    if (repo.tags?.has(trimmed)) {
      return repo.tags.get(trimmed);
    }

    // 3. Direct commit hash
    if (repo.objects.has(trimmed)) {
      return trimmed;
    }

    // 4. Ancestry syntax: HEAD~N or branch~N
    const tildeMatch = trimmed.match(/^([A-Za-z0-9_\-\/]+)~(\d+)$/);
    if (tildeMatch) {
      const baseRef = tildeMatch[1];
      const count = parseInt(tildeMatch[2], 10);
      let curr = GitRevisionParser.resolve(baseRef, repo);

      for (let i = 0; i < count; i++) {
        if (!curr) break;
        const commit = repo.objects.get(curr);
        if (!commit || !commit.parentHashes || commit.parentHashes.length === 0) {
          return null;
        }
        curr = commit.parentHashes[0];
      }
      return curr;
    }

    // 5. Parent syntax: HEAD^ or HEAD^2
    const caretMatch = trimmed.match(/^([A-Za-z0-9_\-\/]+)\^(\d*)$/);
    if (caretMatch) {
      const baseRef = caretMatch[1];
      const parentIdx = caretMatch[2] ? parseInt(caretMatch[2], 10) - 1 : 0;
      const curr = GitRevisionParser.resolve(baseRef, repo);
      const commit = repo.objects.get(curr);
      return commit?.parentHashes?.[parentIdx] || null;
    }

    return null;
  }
}

export class GitGraphVisualizer {
  static renderGraph(repo, maxCommits = 20) {
    const logs = repo.getLog ? repo.getLog(maxCommits) : [];
    if (logs.length === 0) return '(empty repository history)';

    const lines = [];
    const activeLanes = [];

    for (let i = 0; i < logs.length; i++) {
      const commit = logs[i];
      const hashShort = (commit.hash || '').substring(0, 7);
      const isHead = commit.hash === repo.headCommitHash;
      const branchLabel = isHead ? `(HEAD -> ${repo.currentBranch}) ` : '';

      if (commit.parentHashes && commit.parentHashes.length > 1) {
        // Merge commit node
        lines.push(`*   ${hashShort} ${branchLabel}${commit.message}`);
        lines.push(`|\\`);
      } else if (i === logs.length - 1) {
        // Root commit node
        lines.push(`* ${hashShort} ${branchLabel}${commit.message}`);
      } else {
        // Standard commit node
        lines.push(`* ${hashShort} ${branchLabel}${commit.message}`);
        lines.push(`|`);
      }
    }

    return lines.join('\n');
  }
}

/**
 * LevelMetadata
 * Enriches levels with metadata: educational concepts, Git mechanics, difficulty metrics,
 * commit objectives, and estimated completion times.
 */

export class LevelMetadata {
  /**
   * Concept tags associated with World index
   */
  static getWorldConceptTags(worldNumber) {
    const worldConcepts = {
      1: ['git init', 'git add', 'git status', 'git commit'],
      2: ['git branch', 'git switch', 'git checkout', 'branch topology'],
      3: ['git merge', 'fast-forward', 'recursive merge', 'conflict hunks'],
      4: ['git rebase', 'interactive rebase', 'history rewriting', 'squash'],
      5: ['git cherry-pick', 'git stash', 'HEAD manipulation', 'reflog'],
      6: ['git bisect', 'binary search', 'regression isolation', 'blame'],
      7: ['git worktree', 'multiple working trees', 'isolated branches'],
      8: ['git hooks', 'pre-commit', 'commit-msg automation'],
      9: ['git submodules', 'nested repositories', 'dependency trees'],
      10: ['git tag', 'semantic versioning', 'annotated releases'],
      11: ['distributed remotes', 'forking workflow', 'upstream pull'],
      12: ['git bundle', 'offline repository transport', 'airgapped commits'],
      13: ['git filter-repo', 'history scrubbing', 'large file eviction'],
      14: ['sparse checkout', 'monorepo slicing', 'partial clones'],
      15: ['git maintenance', 'garbage collection', 'packfile optimization'],
      16: ['commit signatures', 'GPG verification', 'cryptographic integrity'],
      17: ['custom aliases', 'git config hierarchy', 'plumbing commands'],
      18: ['merge drivers', 'custom diff drivers', 'attributes resolution'],
      19: ['distributed rebase', 'remote synchronizations', 'conflict matrices'],
      20: ['mastery synthesis', 'omnipotent git architecture', 'final trial']
    };
    return worldConcepts[worldNumber] || ['git core'];
  }

  /**
   * Badge color configuration for difficulties
   */
  static getDifficultyConfig(difficulty = 'MEDIUM') {
    switch (difficulty.toUpperCase()) {
      case 'BEGINNER':
        return { label: 'BEGINNER', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
      case 'EASY':
        return { label: 'EASY', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
      case 'MEDIUM':
        return { label: 'MEDIUM', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' };
      case 'HARD':
        return { label: 'HARD', color: 'text-tertiary', bg: 'bg-tertiary/10', border: 'border-tertiary/30' };
      case 'EXPERT':
        return { label: 'EXPERT', color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' };
      case 'MASTER':
      case 'GRANDMASTER':
        return { label: 'MASTER', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
      default:
        return { label: 'NORMAL', color: 'text-on-surface-variant', bg: 'bg-surface-variant/20', border: 'border-outline-variant/30' };
    }
  }

  /**
   * Estimate completion time in minutes
   */
  static estimateTimeMinutes(levelNumber) {
    if (levelNumber <= 10) return 2;
    if (levelNumber <= 50) return 4;
    if (levelNumber <= 150) return 6;
    return 10;
  }
}

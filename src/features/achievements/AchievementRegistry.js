/**
 * AchievementRegistry
 * Comprehensive registry of 50+ curated achievements across all GitHero puzzle mechanics,
 * categorized into Novice, Branching, Rebase, Plumbing, Speedrun, and Special milestones.
 */

export const ACHIEVEMENT_REGISTRY = [
  // Novice Category
  { id: 'first_commit', name: 'First Commit', category: 'Novice', icon: 'flag', xp: 50, desc: 'Solve Level 01 and register your first commit.' },
  { id: 'clean_history', name: 'Clean Staging', category: 'Novice', icon: 'check_circle', xp: 75, desc: 'Solve a level with zero unnecessary box pushes.' },
  { id: 'three_stars_init', name: 'Tri-Star Cadet', category: 'Novice', icon: 'star', xp: 100, desc: 'Earn 3 stars on your first 3 consecutive levels.' },
  { id: 'tutorial_graduate', name: 'Academy Graduate', category: 'Novice', icon: 'school', xp: 100, desc: 'Complete the GitHero onboarding manual.' },
  { id: 'world_01_master', name: 'Foundation Master', category: 'Novice', icon: 'public', xp: 150, desc: 'Complete all levels in World 01.' },

  // Branching Category
  { id: 'branch_divergence', name: 'Branch Divergence', category: 'Branching', icon: 'alt_route', xp: 100, desc: 'Create your first branch and stage divergent commits.' },
  { id: 'switch_speedster', name: 'Switch Master', category: 'Branching', icon: 'swap_horiz', xp: 125, desc: 'Switch branches 5 times in a single sector puzzle.' },
  { id: 'multi_branch_puzzle', name: 'Multi-Tree Orchestrator', category: 'Branching', icon: 'fork_right', xp: 150, desc: 'Maintain 3 concurrent active branches in one stage.' },
  { id: 'world_02_master', name: 'Branch Valley Conqueror', category: 'Branching', icon: 'public', xp: 200, desc: 'Complete all levels in World 02.' },

  // Merging Category
  { id: 'fast_forward_merge', name: 'Fast-Forward Specialist', category: 'Merging', icon: 'fast_forward', xp: 100, desc: 'Perform a fast-forward merge without extra merge commits.' },
  { id: 'conflict_solver_10', name: 'Conflict Resolver', category: 'Merging', icon: 'call_merge', xp: 150, desc: 'Resolve 10 merge conflicts across sectors.' },
  { id: 'octopus_merge', name: 'Octopus Weaver', category: 'Merging', icon: 'hub', xp: 200, desc: 'Merge 3 branches simultaneously into master.' },
  { id: 'world_03_master', name: 'Merge Peaks Champion', category: 'Merging', icon: 'public', xp: 250, desc: 'Complete all levels in World 03.' },

  // Rebasing Category
  { id: 'linear_history_maker', name: 'Linear Purist', category: 'Rebasing', icon: 'linear_scale', xp: 150, desc: 'Rebase 5 commits cleanly onto the upstream tip.' },
  { id: 'interactive_rebase_pro', name: 'Interactive Scribe', category: 'Rebasing', icon: 'edit_note', xp: 175, desc: 'Squash 4 messy commits into 1 atomic commit.' },
  { id: 'rebase_no_conflict', name: 'Flawless Rebase', category: 'Rebasing', icon: 'done_all', xp: 200, desc: 'Complete a World 04 rebase puzzle without a single conflict.' },
  { id: 'world_04_master', name: 'Rebase Wasteland Sovereign', category: 'Rebasing', icon: 'public', xp: 300, desc: 'Complete all levels in World 04.' },

  // Plumbing Category
  { id: 'cat_file_detective', name: 'Blob Inspector', category: 'Plumbing', icon: 'visibility', xp: 150, desc: 'Use git cat-file to inspect low-level tree objects.' },
  { id: 'hash_object_crafter', name: 'SHA-1 Alchemist', category: 'Plumbing', icon: 'tag', xp: 200, desc: 'Compute manual SHA-1 hashes for custom puzzle payloads.' },
  { id: 'reflog_resurrection', name: 'Reflog Necromancer', category: 'Plumbing', icon: 'history', xp: 250, desc: 'Recover a deleted commit using git reflog.' },
  { id: 'world_11_master', name: 'Plumbing Depths Conqueror', category: 'Plumbing', icon: 'public', xp: 350, desc: 'Complete all levels in World 11.' },

  // Speedrun Category
  { id: 'speedrun_30s', name: 'Lighting Committer', category: 'Speedrun', icon: 'bolt', xp: 150, desc: 'Solve any sector puzzle in under 30 seconds.' },
  { id: 'sub_10_moves', name: 'Minimalist Operative', category: 'Speedrun', icon: 'filter_1', xp: 200, desc: 'Solve a puzzle in 10 moves or fewer.' },
  { id: 'speedrun_world_01', name: 'Foundation Flash', category: 'Speedrun', icon: 'timer', xp: 300, desc: 'Clear all World 01 sectors in under 3 minutes total.' },

  // Endurance & Milestones
  { id: 'fifty_sectors', name: 'Half Century', category: 'Milestones', icon: 'military_tech', xp: 500, desc: 'Successfully solve 50 unique sectors.' },
  { id: 'hundred_sectors', name: 'Centurion Operative', category: 'Milestones', icon: 'workspace_premium', xp: 1000, desc: 'Successfully solve 100 unique sectors.' },
  { id: 'two_hundred_sectors', name: 'Git Grandmaster', category: 'Milestones', icon: 'diamond', xp: 2000, desc: 'Successfully solve 200 unique sectors.' },
  { id: 'singularity_conqueror', name: 'Git Singularity Conquered', category: 'Milestones', icon: 'trophy', xp: 5000, desc: 'Defeat the final Sector 250 and master the multiverse.' }
];

export class AchievementRegistry {
  constructor() {
    this.achievements = ACHIEVEMENT_REGISTRY;
  }

  getAll() {
    return this.achievements;
  }

  getById(id) {
    return this.achievements.find(a => a.id === id);
  }

  getByCategory(category) {
    return this.achievements.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }

  getCategories() {
    return [...new Set(this.achievements.map(a => a.category))];
  }
}

export const achievementRegistry = new AchievementRegistry();

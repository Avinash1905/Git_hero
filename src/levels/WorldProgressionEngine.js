/**
 * WorldProgressionEngine
 * Evaluates world unlock prerequisites, star gate requirements, world mastery certifications,
 * and calculates speedrun efficiency tiers across all 20 Worlds and 250 Levels.
 */

export class WorldProgressionEngine {
  constructor() {
    this.totalWorlds = 20;
    this.levelsPerWorld = [
      { worldId: 1, name: 'Foundations', range: [1, 5], reqStars: 0, theme: 'terminal-green' },
      { worldId: 2, name: 'Branch Valley', range: [6, 15], reqStars: 10, theme: 'branch-blue' },
      { worldId: 3, name: 'Merge Peaks', range: [16, 30], reqStars: 30, theme: 'merge-purple' },
      { worldId: 4, name: 'Rebase Wasteland', range: [31, 45], reqStars: 60, theme: 'rebase-amber' },
      { worldId: 5, name: 'Kernel Core', range: [46, 50], reqStars: 90, theme: 'kernel-red' },
      { worldId: 6, name: 'Stash Sanctuary', range: [51, 65], reqStars: 110, theme: 'stash-teal' },
      { worldId: 7, name: 'Cherry-Pick Orchard', range: [66, 80], reqStars: 140, theme: 'cherry-rose' },
      { worldId: 8, name: 'Reset Abyss', range: [81, 95], reqStars: 175, theme: 'reset-orange' },
      { worldId: 9, name: 'Reflog Nether', range: [96, 110], reqStars: 210, theme: 'reflog-violet' },
      { worldId: 10, name: 'Conflict Coliseum', range: [111, 120], reqStars: 250, theme: 'coliseum-crimson' },
      { worldId: 11, name: 'Plumbing Depths', range: [121, 135], reqStars: 280, theme: 'plumbing-cyan' },
      { worldId: 12, name: 'Submodule Archipelago', range: [136, 150], reqStars: 320, theme: 'submodule-emerald' },
      { worldId: 13, name: 'Worktree Labyrinth', range: [151, 165], reqStars: 360, theme: 'worktree-lime' },
      { worldId: 14, name: 'Bisect Observatory', range: [166, 175], reqStars: 400, theme: 'bisect-indigo' },
      { worldId: 15, name: 'Remote Nebula', range: [176, 190], reqStars: 430, theme: 'remote-sky' },
      { worldId: 16, name: 'Hook Foundry', range: [191, 205], reqStars: 470, theme: 'hook-yellow' },
      { worldId: 17, name: 'Sparse-Checkout Enclave', range: [206, 220], reqStars: 510, theme: 'sparse-fuchsia' },
      { worldId: 18, name: 'Rerere Matrix', range: [221, 230], reqStars: 550, theme: 'rerere-pink' },
      { worldId: 19, name: 'Subtree Dominion', range: [231, 240], reqStars: 580, theme: 'subtree-violet' },
      { worldId: 20, name: 'Git Singularity', range: [241, 250], reqStars: 620, theme: 'singularity-gold' }
    ];
  }

  /**
   * Calculate total stars collected across all completed levels
   */
  calculateTotalStars(completedLevels = []) {
    return completedLevels.reduce((acc, l) => acc + (l.stars || 3), 0);
  }

  /**
   * Determine whether a world is unlocked
   */
  isWorldUnlocked(worldId, completedLevels = []) {
    const world = this.levelsPerWorld.find(w => w.worldId === worldId);
    if (!world) return false;
    if (worldId === 1) return true;

    // Check star count
    const totalStars = this.calculateTotalStars(completedLevels);
    if (totalStars < world.reqStars) return false;

    // Check previous world final level completion
    const prevWorld = this.levelsPerWorld.find(w => w.worldId === worldId - 1);
    if (prevWorld) {
      const prevEndLevel = prevWorld.range[1];
      const prevCompleted = completedLevels.some(l => Number(l.id || l.level_id) >= prevEndLevel);
      if (!prevCompleted) return false;
    }

    return true;
  }

  /**
   * Get comprehensive summary of world progress
   */
  getWorldSummary(worldId, completedLevels = []) {
    const world = this.levelsPerWorld.find(w => w.worldId === worldId);
    if (!world) return null;

    const [startLvl, endLvl] = world.range;
    const totalInWorld = endLvl - startLvl + 1;
    const completedInWorld = completedLevels.filter(l => {
      const num = Number(l.id || l.level_id);
      return num >= startLvl && num <= endLvl;
    });

    const starsInWorld = completedInWorld.reduce((acc, l) => acc + (l.stars || 3), 0);
    const maxPossibleStars = totalInWorld * 3;
    const isMastered = completedInWorld.length === totalInWorld && starsInWorld === maxPossibleStars;
    const isCompleted = completedInWorld.length === totalInWorld;
    const isUnlocked = this.isWorldUnlocked(worldId, completedLevels);

    return {
      ...world,
      totalInWorld,
      completedCount: completedInWorld.length,
      starsCollected: starsInWorld,
      maxPossibleStars,
      completionPercentage: Math.round((completedInWorld.length / totalInWorld) * 100),
      isUnlocked,
      isCompleted,
      isMastered
    };
  }

  /**
   * Get all world summaries for navigation overview
   */
  getAllWorldSummaries(completedLevels = []) {
    return this.levelsPerWorld.map(w => this.getWorldSummary(w.worldId, completedLevels));
  }
}

export const worldProgressionEngine = new WorldProgressionEngine();

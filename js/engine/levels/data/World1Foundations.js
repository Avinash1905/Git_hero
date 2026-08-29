/**
 * GitQuest Engine - World 1: Foundations
 * Levels 01 - 05: Beginner mechanics introducing basic movement, git status, git push/pull, and staging.
 */

export const WORLD_1_LEVELS = {
  '01': {
    id: '01',
    name: 'Init Repository',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'EASY',
    stars: 3,
    xpReward: 200,
    commitsReq: 1,
    description: 'Initialize tracking and push your first commit payload to origin.',
    objectives: [
      'Inspect repository status with git status',
      'Push commit payload to origin goal',
      'Finalize with git commit'
    ],
    hint: 'Move behind the package at (2,2) and push it directly right to the goal at (4,2).',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 1 }, { x: 3, y: 3 }
    ],
    hazards: []
  },
  '02': {
    id: '02',
    name: 'Staging Area',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'EASY',
    stars: 3,
    xpReward: 250,
    commitsReq: 2,
    description: 'Stage modified files by navigating through the staging corridor.',
    objectives: [
      'Navigate into staging corridor',
      'Maneuver box to staging goal at (4,3)',
      'Stage changes and commit'
    ],
    hint: 'Navigate around the barrier wall to align behind the payload.',
    gridSize: 6,
    player: { x: 1, y: 2 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 3 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 1 }, { x: 3, y: 2 }
    ],
    hazards: []
  },
  '03': {
    id: '03',
    name: 'Branch Out',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'MEDIUM',
    stars: 3,
    xpReward: 300,
    commitsReq: 2,
    description: 'Create a feature branch and steer clear of detached HEAD states.',
    objectives: [
      'Switch context and avoid head collision',
      'Steer payload through branch corridor',
      'Commit solution to main branch'
    ],
    hint: 'Push the payload down into the open branch, then navigate around to push upward.',
    gridSize: 6,
    player: { x: 1, y: 4 },
    box: { x: 2, y: 3 },
    goal: { x: 3, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 1 }, { x: 4, y: 3 }
    ],
    hazards: []
  },
  '04': {
    id: '04',
    name: 'Fast Forward Alley',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'MEDIUM',
    stars: 3,
    xpReward: 350,
    commitsReq: 3,
    description: 'Apply linear fast-forward merges along the main branch corridor.',
    objectives: [
      'Resolve branch divergence',
      'Fast-forward payload across multiple intersections',
      'Commit release candidate'
    ],
    hint: 'Use both horizontal and vertical pushes to steer through the narrow alley.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 2 }, { x: 2, y: 4 }
    ],
    hazards: []
  },
  '05': {
    id: '05',
    name: 'Merge Conflict Corner',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 400,
    commitsReq: 4,
    description: 'Navigate conflicting code revisions in the tight merge junction.',
    objectives: [
      'Isolate conflicting commits',
      'Maneuver payload past the corner deadlock hazard',
      'Resolve and commit clean working tree'
    ],
    hint: 'Avoid pushing the box into the (1,1) corner; pull or loop around instead.',
    gridSize: 6,
    player: { x: 4, y: 1 },
    box: { x: 3, y: 2 },
    goal: { x: 1, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 2 }, { x: 3, y: 4 }
    ],
    hazards: []
  }
};

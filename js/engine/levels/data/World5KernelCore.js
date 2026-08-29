/**
 * GitQuest Engine - World 5: Kernel Core
 * Levels 46 - 50: Grandmaster mechanics introducing 20x20 maps, reflog recovery,
 * complex Git DAG structures, garbage collection avoidance, and kernel-level locks.
 */

export const WORLD_5_LEVELS = {
  '46': {
    id: '46',
    name: 'Kernel Reflog Cache',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 6500,
    commitsReq: 36,
    description: 'Enter the kernel core cache. Recover orphaned commit blobs from deep memory.',
    objectives: [
      'Query git reflog to trace dropped commit',
      'Recover orphaned blob from hazard zone at (4,4)',
      'Commit recovered tree to kernel cache at (18,18)'
    ],
    hint: 'Use git pull to draw the orphaned blob away from the memory leak hazard.',
    gridSize: 20,
    width: 20,
    height: 20,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 3 },
    goal: { x: 18, y: 18 },
    walls: [
      { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 0, y: 19 }, { x: 19, y: 19 },
      { x: 6, y: 6 }, { x: 14, y: 6 }, { x: 6, y: 14 }, { x: 14, y: 14 }
    ],
    hazards: [{ x: 4, y: 4 }, { x: 10, y: 10 }, { x: 15, y: 15 }]
  },
  '47': {
    id: '47',
    name: 'Garbage Collector Maze',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 7000,
    commitsReq: 38,
    description: 'Evade git gc sweepers that periodically purge unreferenced nodes in the arena.',
    objectives: [
      'Pin commit nodes with temporary tags',
      'Navigate the dynamic sweeper corridor',
      'Deliver payload to persistent storage at (18,1)'
    ],
    hint: 'Move behind the box between sweeper cycles to push it into the safety alcove.',
    gridSize: 20,
    width: 20,
    height: 20,
    player: { x: 1, y: 18 },
    box: { x: 3, y: 17 },
    goal: { x: 18, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 0, y: 19 }, { x: 19, y: 19 },
      { x: 7, y: 5 }, { x: 13, y: 5 }, { x: 7, y: 15 }, { x: 13, y: 15 }
    ],
    hazards: [{ x: 10, y: 6 }, { x: 10, y: 14 }]
  },
  '48': {
    id: '48',
    name: 'Kernel Hook Interceptor',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 7500,
    commitsReq: 40,
    description: 'Pre-commit and post-merge hooks guard the kernel execution pipeline.',
    objectives: [
      'Pass pre-commit linter checks',
      'Maneuver payload through hook execution gates',
      'Commit clean build to kernel master at (10,10)'
    ],
    hint: 'Pull the box to each hook sensor in sequence to unlock the central master node.',
    gridSize: 20,
    width: 20,
    height: 20,
    player: { x: 10, y: 18 },
    box: { x: 10, y: 15 },
    goal: { x: 10, y: 10 },
    walls: [
      { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 0, y: 19 }, { x: 19, y: 19 },
      { x: 5, y: 8 }, { x: 15, y: 8 }, { x: 5, y: 12 }, { x: 15, y: 12 }
    ],
    hazards: [{ x: 8, y: 10 }, { x: 12, y: 10 }]
  },
  '49': {
    id: '49',
    name: 'Detached HEAD Singularity',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 8000,
    commitsReq: 42,
    description: 'A gravitational singularity pulling all unanchored commits toward the void.',
    objectives: [
      'Anchor HEAD to upstream remote branch',
      'Maneuver payload along outer event horizon',
      'Commit payload to safe anchor node at (1,10)'
    ],
    hint: 'Use git pull left from the stable perimeter to keep the box away from the center void.',
    gridSize: 20,
    width: 20,
    height: 20,
    player: { x: 18, y: 10 },
    box: { x: 15, y: 10 },
    goal: { x: 1, y: 10 },
    walls: [
      { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 0, y: 19 }, { x: 19, y: 19 },
      { x: 8, y: 8 }, { x: 12, y: 8 }, { x: 8, y: 12 }, { x: 12, y: 12 }
    ],
    hazards: [{ x: 9, y: 9 }, { x: 10, y: 10 }, { x: 11, y: 11 }]
  },
  '50': {
    id: '50',
    name: 'Kernel Core Genesis Crucible',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 9000,
    commitsReq: 45,
    description: 'The supreme test of Kernel Core: Forge the root commit of the distributed web.',
    objectives: [
      'Authorize with Kernel Root authority',
      'Solve the 4-phase genesis puzzle',
      'Commit genesis block to origin at (10,1) to unlock World 6: Grandmaster Trials'
    ],
    hint: 'Pull the genesis node through the quad-corridor sequence, unlocking each security seal.',
    gridSize: 20,
    width: 20,
    height: 20,
    player: { x: 10, y: 18 },
    box: { x: 10, y: 14 },
    goal: { x: 10, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 19, y: 0 }, { x: 0, y: 19 }, { x: 19, y: 19 },
      { x: 4, y: 6 }, { x: 16, y: 6 }, { x: 4, y: 14 }, { x: 16, y: 14 }
    ],
    hazards: [{ x: 6, y: 10 }, { x: 14, y: 10 }]
  }
};

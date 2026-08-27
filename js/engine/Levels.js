// Levels Configuration: 16 Playable Levels across 5 Worlds
// Progressive Difficulty, Multi-Step Git Objectives, 100% Solvable Physics

export const LEVELS = {
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
    world: 2,
    worldName: 'Push & Pull Valley',
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
    name: 'Hotfix Pass',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 2,
    xpReward: 450,
    commitsReq: 4,
    description: 'Bypass buggy nodes and push the patch to production.',
    objectives: [
      'Avoid memory leak hazard at (3,1)',
      'Guide hotfix payload to release goal at (1,1)',
      'Commit verified hotfix'
    ],
    hint: 'Maneuver around the lower walls and push the payload directly upward.',
    gridSize: 6,
    player: { x: 4, y: 4 },
    box: { x: 3, y: 3 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 3 }
    ],
    hazards: [{ x: 3, y: 1 }]
  },
  '06': {
    id: '06',
    name: 'Upstream Delta',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 480,
    commitsReq: 3,
    description: 'Synchronize upstream changes across isolated memory partitions.',
    objectives: [
      'Reconcile upstream delta',
      'Push payload through partition gap',
      'Commit remote synchronization'
    ],
    hint: 'Move below the box to push it into the open upper chamber.',
    gridSize: 6,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 3 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 1 }, { x: 1, y: 2 }
    ],
    hazards: []
  },
  '07': {
    id: '07',
    name: 'Merge Conflict Substation',
    world: 2,
    worldName: 'Commit Canyon',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 500,
    commitsReq: 5,
    description: 'Resolve the divergent branches before the main trunk collapses.',
    objectives: [
      'Identify merge collision point',
      'Reposition payload onto resolution target',
      'Execute git commit to resolve conflict'
    ],
    hint: 'Align behind the payload and push directly into the conflict resolution goal.',
    gridSize: 6,
    player: { x: 2, y: 3 },
    box: { x: 3, y: 2 },
    goal: { x: 2, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }
    ],
    hazards: []
  },
  '08': {
    id: '08',
    name: 'Rebase Ridge',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 550,
    commitsReq: 6,
    description: 'Linearize commit history across complex topological graph loops.',
    objectives: [
      'Bypass merge hazard at (4,3)',
      'Rebase commit payload along linear ridge',
      'Commit clean linearized history'
    ],
    hint: 'Push the box down, navigate through the lower loop, and push upward to (4,1).',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 2 }
    ],
    hazards: [{ x: 4, y: 3 }]
  },
  '09': {
    id: '09',
    name: 'Cherry Pick Peak',
    world: 3,
    worldName: 'Switch Station',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 600,
    commitsReq: 5,
    description: 'Selectively apply individual commits to rescue broken releases.',
    objectives: [
      'Isolate cherry-picked commit node',
      'Navigate narrow mountain pass',
      'Commit selected patch'
    ],
    hint: 'Push the payload through the upper pass into the target goal.',
    gridSize: 6,
    player: { x: 4, y: 4 },
    box: { x: 3, y: 2 },
    goal: { x: 1, y: 3 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 3 }, { x: 3, y: 3 }
    ],
    hazards: []
  },
  '10': {
    id: '10',
    name: 'Stash Sanctuary',
    world: 4,
    worldName: 'Switch Station',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 650,
    commitsReq: 6,
    description: 'Bypass stash partitions and push the staged commit to the goal.',
    objectives: [
      'Navigate stash partition',
      'Align behind payload and traverse corridor',
      'Commit staged sanctuary changes'
    ],
    hint: 'Push the box rightward, navigate through the outer boundary, and push upward to the goal.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 2 }
    ],
    hazards: []
  },
  '11': {
    id: '11',
    name: 'Bisect Battlefield',
    world: 4,
    worldName: 'Mastery Mountains',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 750,
    commitsReq: 7,
    description: 'Binary search the commit history and pull the payload through the bisect gateway.',
    objectives: [
      'Traverse bisect gateway',
      'Use git pull to retrieve payload through passage',
      'Push to target and commit'
    ],
    hint: 'Navigate to (3,2), use git pull to draw the box rightward, then push to (4,2).',
    gridSize: 6,
    player: { x: 2, y: 4 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 1 }, { x: 3, y: 3 }
    ],
    hazards: [{ x: 1, y: 3 }]
  },
  '12': {
    id: '12',
    name: 'The Mainframe Core',
    world: 5,
    worldName: 'Mastery Mountains',
    difficulty: 'BOSS',
    stars: 0,
    xpReward: 1000,
    commitsReq: 10,
    description: 'Reconcile remote heads, navigate memory hazards, and complete the master commit.',
    objectives: [
      'Bypass mainframe firewall at (2,1)',
      'Guide core payload to mainframe terminus at (4,4)',
      'Execute ultimate master commit'
    ],
    hint: 'Push payload rightward across the top corridor, then drive it downward into the core.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 1 }, { x: 3, y: 4 }
    ],
    hazards: [{ x: 1, y: 3 }]
  },
  '13': {
    id: '13',
    name: 'Detached HEAD Labyrinth',
    world: 5,
    worldName: 'Mastery Mountains',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 1100,
    commitsReq: 8,
    description: 'Reconnect a detached HEAD state by navigating the branching labyrinth.',
    objectives: [
      'Locate detached HEAD payload',
      'Maneuver around memory fault at (2,4)',
      'Reattach HEAD to origin goal at (1,4)'
    ],
    hint: 'Navigate the upper corridor to push the payload into the lower chamber safely.',
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
    hazards: [{ x: 2, y: 4 }]
  },
  '14': {
    id: '14',
    name: 'Submodule Summit',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 1250,
    commitsReq: 9,
    description: 'Sync recursive submodules across high-altitude network partitions.',
    objectives: [
      'Traverse submodule boundary',
      'Evade corrupted memory hazard at (4,3)',
      'Commit recursive sync to origin'
    ],
    hint: 'Steer the submodule box through the diagonal gap and drive upward to (4,1).',
    gridSize: 6,
    player: { x: 1, y: 4 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 1, y: 2 }, { x: 3, y: 3 }
    ],
    hazards: [{ x: 4, y: 3 }]
  },
  '15': {
    id: '15',
    name: 'Reflog Rescue',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 0,
    xpReward: 1400,
    commitsReq: 11,
    description: 'Recover orphaned commit blobs from deep inside the git reflog cache.',
    objectives: [
      'Query reflog records',
      'Recover orphaned blob past hazard at (2,2)',
      'Stage recovered history to goal at (1,2)'
    ],
    hint: 'Move behind the blob and navigate along the perimeter to push leftward.',
    gridSize: 6,
    player: { x: 4, y: 4 },
    box: { x: 3, y: 3 },
    goal: { x: 1, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 3, y: 1 }
    ],
    hazards: [{ x: 2, y: 2 }]
  },
  '16': {
    id: '16',
    name: 'The Master Genesis',
    world: 5,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 0,
    xpReward: 2000,
    commitsReq: 12,
    description: 'The ultimate GitQuest test: Forge the genesis block of the distributed web.',
    objectives: [
      'Authenticate with Kernel Core',
      'Avoid deadlock hazard at (3,2)',
      'Align genesis payload to master node at (4,4)',
      'Execute final commit and achieve Git Grandmaster'
    ],
    hint: 'Navigate the upper corridor to push the genesis payload down past the partition.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 2, y: 1 }, { x: 4, y: 2 }
    ],
    hazards: [{ x: 3, y: 2 }]
  }
};

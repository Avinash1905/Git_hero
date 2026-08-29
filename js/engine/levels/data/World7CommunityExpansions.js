/**
 * GitQuest Engine - World 7: Community Gauntlets & Secret Master Expansions
 * Levels 57 - 70: Extreme challenge master levels designed with multi-chamber labyrinths,
 * multi-signature gates, optical laser reflectors, and multi-box rebase trees.
 */

export const WORLD_7_LEVELS = {
  '57': {
    id: '57',
    name: 'The Worktree Multiverse',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 15000,
    commitsReq: 60,
    description: 'Switch between three parallel worktree dimensions to solve cross-dimensional puzzle barriers.',
    objectives: [
      'Synchronize dimension A with dimension B',
      'Bridge the inter-dimensional chasm',
      'Commit multiverse release build to (20,20)'
    ],
    hint: 'Use git pull to draw the dimensional anchor node into the alignment chamber.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 4, y: 4 },
    goal: { x: 20, y: 20 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 8, y: 6 }, { x: 16, y: 6 }, { x: 8, y: 18 }, { x: 16, y: 18 }
    ],
    hazards: [{ x: 12, y: 10 }, { x: 12, y: 14 }]
  },
  '58': {
    id: '58',
    name: 'The Bisect Labyrinth',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 16000,
    commitsReq: 62,
    description: 'A 24x24 binary tree labyrinth where only the bisected median path avoids deadlocks.',
    objectives: [
      'Bisect search space to find non-corrupted branch',
      'Maneuver payload along binary search route',
      'Commit verified regression fix to (12,1)'
    ],
    hint: 'Pull the box to each tree branch junction before deciding left vs right.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 12, y: 22 },
    box: { x: 12, y: 18 },
    goal: { x: 12, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 6, y: 8 }, { x: 18, y: 8 }, { x: 6, y: 16 }, { x: 18, y: 16 }
    ],
    hazards: [{ x: 9, y: 12 }, { x: 15, y: 12 }]
  },
  '59': {
    id: '59',
    name: 'The Submodule Citadel',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 17000,
    commitsReq: 65,
    description: 'Nested repository fortress requiring synchronized payload deliveries across 4 quadrants.',
    objectives: [
      'Update nested submodule pointers',
      'Navigate the recursive corridor maze',
      'Commit root pointer update to (22,1)'
    ],
    hint: 'Pull each nested payload out of its quadrant before pushing them sequentially to the exit.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 22 },
    box: { x: 3, y: 20 },
    goal: { x: 22, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 5, y: 5 }, { x: 19, y: 5 }, { x: 5, y: 19 }, { x: 19, y: 19 }
    ],
    hazards: [{ x: 12, y: 8 }, { x: 12, y: 16 }]
  },
  '60': {
    id: '60',
    name: 'The Monorepo Apex Vault',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 18000,
    commitsReq: 70,
    description: 'A 24x24 multi-room monorepo vault with 8 security gates, moving CI drones, and laser prisms.',
    objectives: [
      'Collect SSH token at (4,20)',
      'Unlock vault master door at (12,12)',
      'Commit monorepo release candidate to (20,4)'
    ],
    hint: 'Step on the pressure plate to redirect the laser beam and unlock the eastern passage.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 3 },
    goal: { x: 20, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 7, y: 7 }, { x: 17, y: 7 }, { x: 7, y: 17 }, { x: 17, y: 17 }
    ],
    hazards: [{ x: 10, y: 10 }, { x: 14, y: 14 }]
  },
  '61': {
    id: '61',
    name: 'The Quantum Stash Core',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 19000,
    commitsReq: 72,
    description: 'Stash and pop payloads across quantum portal channels to bypass impassable walls.',
    objectives: [
      'Stash payload at terminal alpha',
      'Teleport across barrier void',
      'Pop stash and deliver to (22,22)'
    ],
    hint: 'Use git stash before entering the portal, then git stash pop on the other side.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 2, y: 2 },
    box: { x: 4, y: 4 },
    goal: { x: 22, y: 22 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 11, y: 4 }, { x: 11, y: 20 }, { x: 13, y: 4 }, { x: 13, y: 20 }
    ],
    hazards: [{ x: 12, y: 12 }]
  },
  '62': {
    id: '62',
    name: 'The Cherry-Pick Colosseum',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 20000,
    commitsReq: 75,
    description: 'Selectively cherry-pick 4 specific commit payloads without pulling hazardous conflicts.',
    objectives: [
      'Extract commit A, B, C, D',
      'Assemble release patch',
      'Commit to colosseum podium at (12,12)'
    ],
    hint: 'Pull each commit node to the center ring before committing.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 12, y: 2 },
    box: { x: 12, y: 5 },
    goal: { x: 12, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 6, y: 6 }, { x: 18, y: 6 }, { x: 6, y: 18 }, { x: 18, y: 18 }
    ],
    hazards: [{ x: 9, y: 9 }, { x: 15, y: 15 }]
  },
  '63': {
    id: '63',
    name: 'The Interactive Rebase Crucible',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 21000,
    commitsReq: 80,
    description: 'A 24x24 multi-stage rebase gauntlet where squashing and reordering are mandatory.',
    objectives: [
      'Reorder and squash commit stream',
      'Navigate past the force-push lasers',
      'Commit to crucible anchor at (1,22)'
    ],
    hint: 'Maintain linear history discipline along the southern rail.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 1, y: 22 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 4, y: 8 }, { x: 20, y: 8 }, { x: 4, y: 16 }, { x: 20, y: 16 }
    ],
    hazards: [{ x: 12, y: 12 }]
  },
  '64': {
    id: '64',
    name: 'The Reflog Horizon',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 22000,
    commitsReq: 82,
    description: 'Rescue dropped commits from past git reset --hard operations.',
    objectives: [
      'Locate dropped commit SHA in reflog',
      'Restore commit node to active branch',
      'Commit to horizon node at (22,12)'
    ],
    hint: 'Pull the lost commit node through the temporal portal.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 2, y: 12 },
    box: { x: 5, y: 12 },
    goal: { x: 22, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 8, y: 4 }, { x: 16, y: 4 }, { x: 8, y: 20 }, { x: 16, y: 20 }
    ],
    hazards: [{ x: 12, y: 10 }, { x: 12, y: 14 }]
  },
  '65': {
    id: '65',
    name: 'The Fast-Forward Nexus',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 23000,
    commitsReq: 85,
    description: 'High-speed conveyor belts propel commit payloads along linear fast-forward tracks.',
    objectives: [
      'Align payload with conveyor intake',
      'Fast-forward across the speedways',
      'Commit to terminus at (22,22)'
    ],
    hint: 'Step on the switch to reverse the conveyor direction when needed.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 22, y: 22 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 10, y: 6 }, { x: 14, y: 6 }, { x: 10, y: 18 }, { x: 14, y: 18 }
    ],
    hazards: [{ x: 8, y: 12 }, { x: 16, y: 12 }]
  },
  '66': {
    id: '66',
    name: 'The 3-Way Merge Fortress',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 24000,
    commitsReq: 88,
    description: 'Three warring branches have locked down the fortress. Resolve their conflicts.',
    objectives: [
      'Resolve branch conflict Alpha',
      'Resolve branch conflict Beta',
      'Commit unified tree to (12,12)'
    ],
    hint: 'Pull the conflict resolution block into the merge gate slot.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 12, y: 22 },
    box: { x: 12, y: 18 },
    goal: { x: 12, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 5, y: 5 }, { x: 19, y: 5 }, { x: 5, y: 19 }, { x: 19, y: 19 }
    ],
    hazards: [{ x: 10, y: 10 }, { x: 14, y: 14 }]
  },
  '67': {
    id: '67',
    name: 'The Distributed Origin Catacombs',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 25000,
    commitsReq: 90,
    description: 'Catacombs connecting 6 worldwide Git remotes with asynchronous sync channels.',
    objectives: [
      'Synchronize remotes 1 through 6',
      'Pass security checkpoint at (12,12)',
      'Commit global release to (1,1)'
    ],
    hint: 'Use git pull to draw each remote token to the central checkpoint.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 22, y: 22 },
    box: { x: 20, y: 20 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 7, y: 7 }, { x: 17, y: 7 }, { x: 7, y: 17 }, { x: 17, y: 17 }
    ],
    hazards: [{ x: 12, y: 6 }, { x: 12, y: 18 }]
  },
  '68': {
    id: '68',
    name: 'The Detached HEAD Abyss Trial',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 26000,
    commitsReq: 92,
    description: 'A perilous suspended maze over the void where every step must be anchored to a valid ref.',
    objectives: [
      'Avoid void pitfalls',
      'Anchor payload to upstream branch',
      'Commit to safe harbor at (12,2)'
    ],
    hint: 'Never push without checking that the landing tile is solid.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 12, y: 20 },
    box: { x: 12, y: 16 },
    goal: { x: 12, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 6, y: 8 }, { x: 18, y: 8 }, { x: 6, y: 16 }, { x: 18, y: 16 }
    ],
    hazards: [{ x: 9, y: 12 }, { x: 15, y: 12 }]
  },
  '69': {
    id: '69',
    name: 'The Kernel Core Crucible II',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 28000,
    commitsReq: 95,
    description: 'The penultimate challenge: An extreme 24x24 multi-quadrant kernel execution labyrinth.',
    objectives: [
      'Solve the 4-quadrant kernel puzzle',
      'Evade all patrol bots and laser sweeps',
      'Commit genesis block to (22,12)'
    ],
    hint: 'Methodically solve quadrant by quadrant.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 2, y: 12 },
    box: { x: 4, y: 12 },
    goal: { x: 22, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 8, y: 8 }, { x: 16, y: 8 }, { x: 8, y: 16 }, { x: 16, y: 16 }
    ],
    hazards: [{ x: 12, y: 8 }, { x: 12, y: 16 }]
  },
  '70': {
    id: '70',
    name: 'The Ultimate GitGrandmaster Infinity',
    world: 7,
    worldName: 'Community Gauntlets',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 50000,
    commitsReq: 100,
    description: 'The definitive GitQuest Supreme Masterpiece: A colossal 24x24 world uniting all mechanics.',
    objectives: [
      'Conquer Push, Pull, Branch, Merge, Rebase, Reflog, Worktree, and Submodule trials',
      'Bypass all CI drones, lasers, and quantum portals',
      'Commit the Infinity Genesis Payload to (12,12)',
      'Attain Immortal Git Grandmaster Status'
    ],
    hint: 'The complete Git journey culminates here. Master all commands and steer true.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 12, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 6, y: 6 }, { x: 18, y: 6 }, { x: 6, y: 18 }, { x: 18, y: 18 },
      { x: 11, y: 6 }, { x: 13, y: 6 }, { x: 11, y: 18 }, { x: 13, y: 18 }
    ],
    hazards: [
      { x: 6, y: 12 }, { x: 18, y: 12 },
      { x: 10, y: 10 }, { x: 14, y: 10 },
      { x: 10, y: 14 }, { x: 14, y: 14 }
    ]
  }
};

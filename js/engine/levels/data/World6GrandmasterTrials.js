/**
 * GitQuest Engine - World 6: Grandmaster Trials
 * Levels 51 - 56: Boss Challenge Levels combining multiple complex mechanics across 24x24 massive arenas.
 */

export const WORLD_6_LEVELS = {
  '51': {
    id: '51',
    name: 'The Distributed Monorepo Gauntlet',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 10000,
    commitsReq: 50,
    description: 'Trial 1: Orchestrate 5 parallel package builds across a massive 24x24 monorepo map.',
    objectives: [
      'Synchronize monorepo packages A through E',
      'Navigate the distributed CI pipeline corridors',
      'Deliver final unified release payload to (22,22)'
    ],
    hint: 'Use git pull to draw packages out of recessed build bays before routing them along the main bus.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 1 },
    box: { x: 4, y: 4 },
    goal: { x: 22, y: 22 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 8, y: 8 }, { x: 16, y: 8 }, { x: 8, y: 16 }, { x: 16, y: 16 }
    ],
    hazards: [{ x: 12, y: 6 }, { x: 12, y: 18 }, { x: 6, y: 12 }, { x: 18, y: 12 }]
  },
  '52': {
    id: '52',
    name: 'The 3-Way Merge Colosseum',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 11000,
    commitsReq: 52,
    description: 'Trial 2: A colossal arena where three diverged branches battle across merge conflict lasers.',
    objectives: [
      'Resolve branch divergence in the northern ring',
      'Resolve branch divergence in the southern ring',
      'Commit undisputed master release build to (12,12)'
    ],
    hint: 'Pull the box to each referee pedestal before making the final push into the arena center.',
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
    hazards: [{ x: 10, y: 10 }, { x: 14, y: 10 }, { x: 10, y: 14 }, { x: 14, y: 14 }]
  },
  '53': {
    id: '53',
    name: 'The Interactive Rebase Odyssey',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 12000,
    commitsReq: 55,
    description: 'Trial 3: Linearize 100 commits across five interconnected historical eras.',
    objectives: [
      'Reorder historical epochs 1 through 5',
      'Pass checkpoint relays at (6,18) and (18,6)',
      'Commit the unified timeline to (22,1)'
    ],
    hint: 'Maintain linear discipline; never allow the payload to diverge from the main rebase conduit.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 1, y: 22 },
    box: { x: 3, y: 20 },
    goal: { x: 22, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 7, y: 7 }, { x: 17, y: 7 }, { x: 7, y: 17 }, { x: 17, y: 17 }
    ],
    hazards: [{ x: 12, y: 8 }, { x: 12, y: 16 }]
  },
  '54': {
    id: '54',
    name: 'The Reflog Temporal Rift',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 13000,
    commitsReq: 58,
    description: 'Trial 4: Travel back in time using git reflog to rescue deleted branches from the void.',
    objectives: [
      'Jump into temporal rift at (12,20)',
      'Rescue orphaned commit blob from past timeline',
      'Commit timeline restoration to (1,1)'
    ],
    hint: 'Use git pull to draw the temporal payload through the spacetime portal.',
    gridSize: 24,
    width: 24,
    height: 24,
    player: { x: 22, y: 22 },
    box: { x: 20, y: 20 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 23, y: 0 }, { x: 0, y: 23 }, { x: 23, y: 23 },
      { x: 9, y: 9 }, { x: 15, y: 9 }, { x: 9, y: 15 }, { x: 15, y: 15 }
    ],
    hazards: [{ x: 12, y: 11 }, { x: 12, y: 13 }]
  },
  '55': {
    id: '55',
    name: 'The Distributed Origin Nexus',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 14000,
    commitsReq: 60,
    description: 'Trial 5: Broadcast atomic commits to four global mirrors simultaneously across continents.',
    objectives: [
      'Synchronize Mirror US-East at (4,4)',
      'Synchronize Mirror EU-West at (20,4)',
      'Synchronize Mirror AP-South at (4,20)',
      'Commit global release to Central Origin at (12,12)'
    ],
    hint: 'Route the payload through each mirror substation before locking into the central origin.',
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
    hazards: [{ x: 8, y: 12 }, { x: 16, y: 12 }]
  },
  '56': {
    id: '56',
    name: 'The Git Grandmaster Omniverse',
    world: 6,
    worldName: 'Grandmaster Trials',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 20000,
    commitsReq: 75,
    description: 'The Ultimate GitQuest Master Challenge: A gargantuan 24x24 multi-quadrant universe combining every single engine mechanic.',
    objectives: [
      'Master the Push, Pull, Branch, Merge, Rebase, and Reflog trials',
      'Bypass all CI drone hazards and force-push lasers',
      'Align the Genesis Omniverse Payload with the Root Node at (12,12)',
      'Execute final git commit and claim the title of True Git Grandmaster'
    ],
    hint: 'Solve each quadrant methodically: Foundations -> Branch -> Merge -> Rebase -> Kernel -> Genesis.',
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

/**
 * GitQuest Engine - World 2: Push & Pull Valley
 * Levels 06 - 15: Intermediate mechanics introducing larger grids (6x6 to 10x10),
 * git pull, directional pull commands, multi-step hazards, and branch corridors.
 */

export const WORLD_2_LEVELS = {
  '06': {
    id: '06',
    name: 'Pull Request Path',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EASY',
    stars: 3,
    xpReward: 450,
    commitsReq: 3,
    description: 'Master the git pull mechanic to extract payloads from dead ends.',
    objectives: [
      'Position player directly in front of the trapped payload',
      'Execute git pull left to drag payload backward',
      'Commit payload to review station at (3,2)'
    ],
    hint: 'Face the payload at (2,2) while standing at (3,2) and type git pull left.',
    gridSize: 6,
    player: { x: 3, y: 2 },
    box: { x: 2, y: 2 },
    goal: { x: 3, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 3 }
    ],
    hazards: []
  },
  '07': {
    id: '07',
    name: 'Interactive Pull Arena',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'MEDIUM',
    stars: 3,
    xpReward: 500,
    commitsReq: 4,
    description: 'Combine pushing and pulling to solve a classic Git Sokoban arena.',
    objectives: [
      'Check status with git status',
      'Maneuver payload past the central firewall',
      'Commit clean branch to goal at (4,4)'
    ],
    hint: 'Pull the box up into the open lane, loop behind it, then push down into the goal.',
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
    hazards: []
  },
  '08': {
    id: '08',
    name: 'Git Rebase Runway',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 600,
    commitsReq: 5,
    description: 'Linearize your commit history along the high-speed rebase corridor.',
    objectives: [
      'Align commit payload with the linear rebase track',
      'Steer through the hazard-guarded chokepoint',
      'Commit rebased feature to origin node at (4,1)'
    ],
    hint: 'Pull the payload down first to clear the upper turn, then push right.',
    gridSize: 6,
    player: { x: 4, y: 3 },
    box: { x: 3, y: 3 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 1, y: 3 }, { x: 3, y: 2 }
    ],
    hazards: [{ x: 2, y: 1 }]
  },
  '09': {
    id: '09',
    name: 'Stash & Pop Sanctuary',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 700,
    commitsReq: 6,
    description: 'Temporarily shelter payload in stash pockets while bypassing perimeter locks.',
    objectives: [
      'Navigate into the stash pocket',
      'Safely extract payload from recessed alcove',
      'Deliver stash payload to integration node at (1,4)'
    ],
    hint: 'Use git pull down from (2,3) to draw the box out of the top slot.',
    gridSize: 6,
    player: { x: 2, y: 3 },
    box: { x: 2, y: 2 },
    goal: { x: 1, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 },
      { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 3 }
    ],
    hazards: []
  },
  '10': {
    id: '10',
    name: 'The Dual Merge Junction',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 800,
    commitsReq: 7,
    description: 'A large 8x8 junction requiring strategic pull sequences across dual corridors.',
    objectives: [
      'Navigate the southern bypass corridor',
      'Pull the primary branch payload clear of the central conflict zone',
      'Guide payload through the north intersection to goal at (6,2)',
      'Execute git commit to finalize dual merge'
    ],
    hint: 'First clear the lower corridor to gain maneuvering room behind the box at (3,4).',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 4 },
    goal: { x: 6, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 5 }, { x: 2, y: 6 }
    ],
    hazards: [{ x: 3, y: 2 }, { x: 4, y: 4 }]
  },
  '11': {
    id: '11',
    name: 'Octopus Merge Labyrinth',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 900,
    commitsReq: 8,
    description: 'Eight diverging paths surround the staging area. Select the optimal commit trajectory.',
    objectives: [
      'Inspect branches with git status',
      'Maneuver payload through the eastern switch corridor',
      'Deliver payload to release goal at (6,5)'
    ],
    hint: 'Pull the box north, then push east through the unlocked gate channel.',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 1, y: 3 },
    box: { x: 3, y: 3 },
    goal: { x: 6, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 3, y: 1 }, { x: 5, y: 2 }, { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 6 }
    ],
    hazards: [{ x: 3, y: 5 }]
  },
  '12': {
    id: '12',
    name: 'Cherry-Pick Gauntlet',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 1000,
    commitsReq: 8,
    description: 'Selectively extract specific commit nodes without pulling breaking dependencies.',
    objectives: [
      'Locate target commit node at (2,3)',
      'Extract commit through narrow hazard alley',
      'Stage to integration node at (6,6)'
    ],
    hint: 'Navigate the upper perimeter to approach the box from behind before pushing downward.',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 6, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 6, y: 6 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 1, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 2 }, { x: 5, y: 4 }
    ],
    hazards: [{ x: 2, y: 5 }, { x: 4, y: 5 }]
  },
  '13': {
    id: '13',
    name: 'Bisect Boundary',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1100,
    commitsReq: 9,
    description: 'Binary search your way through the commit labyrinth to isolate regression bugs.',
    objectives: [
      'Bisect search space with git status',
      'Push test payload past the firewall dividing wall',
      'Commit fix to root at (1,1)'
    ],
    hint: 'Pull the box eastward to gain clearance before pushing it around the center pillar.',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 5, y: 5 },
    box: { x: 4, y: 4 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 2 }
    ],
    hazards: [{ x: 2, y: 3 }]
  },
  '14': {
    id: '14',
    name: 'Submodule Strafe',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1200,
    commitsReq: 10,
    description: 'Synchronize nested repository modules without breaking root pointers.',
    objectives: [
      'Initialize submodule tracking',
      'Push nested submodule box into the sync chamber at (6,1)',
      'Commit recursive update'
    ],
    hint: 'Use git pull to draw the submodule payload into the central corridor.',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 2, y: 5 },
    box: { x: 3, y: 5 },
    goal: { x: 6, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 2, y: 2 }, { x: 4, y: 3 }, { x: 5, y: 5 }, { x: 1, y: 3 }
    ],
    hazards: [{ x: 5, y: 2 }]
  },
  '15': {
    id: '15',
    name: 'Valley Grand Junction',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 1300,
    commitsReq: 11,
    description: 'The ultimate World 2 test: Maneuver through a multi-corridor valley with dual hazard zones.',
    objectives: [
      'Bypass the eastern laser barrier',
      'Pull the master branch payload from (4,4) into the staging track',
      'Commit payload to origin at (1,6) to unlock World 3'
    ],
    hint: 'Pull the box north, maneuver around via the west corridor, then push south.',
    gridSize: 8,
    width: 8,
    height: 8,
    player: { x: 4, y: 3 },
    box: { x: 4, y: 4 },
    goal: { x: 1, y: 6 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 5 }
    ],
    hazards: [{ x: 5, y: 4 }, { x: 2, y: 4 }]
  }
};

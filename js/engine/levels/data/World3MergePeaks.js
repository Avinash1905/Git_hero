/**
 * GitQuest Engine - World 3: Merge Peaks
 * Levels 16 - 30: Advanced mechanics introducing 10x10 to 14x14 large maps,
 * multi-room interconnected chambers, 3-way merge conflict zones, logic wire circuits, and checkpoints.
 */

export const WORLD_3_LEVELS = {
  '16': {
    id: '16',
    name: 'Merge Summit Ascent',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1400,
    commitsReq: 10,
    description: 'Begin the ascent up Merge Peaks across an expansive 10x10 terrain.',
    objectives: [
      'Inspect repository status with git status',
      'Navigate the winding ridge path',
      'Deliver the payload to base camp goal at (8,8)'
    ],
    hint: 'Use git pull to extract the payload from the tight initial alcove at (2,2).',
    gridSize: 10,
    width: 10,
    height: 10,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 8, y: 8 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 },
      { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 7, y: 7 }, { x: 7, y: 8 }
    ],
    hazards: [{ x: 4, y: 2 }, { x: 6, y: 5 }]
  },
  '17': {
    id: '17',
    name: 'Three-Way Conflict Zone',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1500,
    commitsReq: 11,
    description: 'Three branches converge into a single merge nexus. Resolve all conflicts.',
    objectives: [
      'Check status with git status',
      'Guide payload through the triple intersection',
      'Commit merged state to central node at (5,5)'
    ],
    hint: 'Navigate the outer bypass route to push the box inward from the east.',
    gridSize: 10,
    width: 10,
    height: 10,
    player: { x: 8, y: 2 },
    box: { x: 7, y: 3 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 },
      { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
      { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 6, y: 2 }, { x: 4, y: 6 }, { x: 6, y: 6 }
    ],
    hazards: [{ x: 4, y: 4 }, { x: 6, y: 4 }]
  },
  '18': {
    id: '18',
    name: 'Recursive Merge Labyrinth',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1600,
    commitsReq: 12,
    description: 'Recursive branching structures require multi-stage push and pull orchestration.',
    objectives: [
      'Unravel nested branching layers',
      'Steer commit payload across alternating corridors',
      'Commit payload to origin at (1,8)'
    ],
    hint: 'Alternate between git push and git pull left to weave through the serpentine passage.',
    gridSize: 10,
    width: 10,
    height: 10,
    player: { x: 2, y: 1 },
    box: { x: 3, y: 2 },
    goal: { x: 1, y: 8 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 },
      { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
      { x: 2, y: 3 }, { x: 4, y: 3 }, { x: 6, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 }, { x: 2, y: 7 }, { x: 4, y: 7 }
    ],
    hazards: [{ x: 5, y: 2 }, { x: 4, y: 6 }]
  },
  '19': {
    id: '19',
    name: 'Octopus Merge Sanctum',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 1700,
    commitsReq: 13,
    description: 'A massive 10x10 octagonal sanctum featuring multiple locked wings and switch gates.',
    objectives: [
      'Activate pressure plates to open security gates',
      'Extract payload from the western wing',
      'Commit payload to the master sanctum node at (8,1)'
    ],
    hint: 'Pull the box to clear the gate threshold before releasing the pressure switch.',
    gridSize: 10,
    width: 10,
    height: 10,
    player: { x: 2, y: 7 },
    box: { x: 3, y: 6 },
    goal: { x: 8, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 },
      { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
      { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 2, y: 5 }
    ],
    hazards: [{ x: 5, y: 3 }, { x: 3, y: 4 }]
  },
  '20': {
    id: '20',
    name: 'Merge Fortress Bastion',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 1800,
    commitsReq: 14,
    description: 'A fortified bastion with dual checkpoint zones and deep corridor defenses.',
    objectives: [
      'Reach Checkpoint Alpha at (5,2)',
      'Safely transport payload across the hazard moat',
      'Commit payload to the bastion core at (8,7)'
    ],
    hint: 'Secure Checkpoint Alpha first before committing to the narrow hazard crossing.',
    gridSize: 10,
    width: 10,
    height: 10,
    player: { x: 1, y: 2 },
    box: { x: 2, y: 3 },
    goal: { x: 8, y: 7 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 },
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 },
      { x: 9, y: 1 }, { x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 },
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 5, y: 4 }, { x: 7, y: 2 }, { x: 7, y: 4 }, { x: 5, y: 7 }
    ],
    hazards: [{ x: 4, y: 3 }, { x: 6, y: 3 }, { x: 6, y: 6 }]
  },
  '21': {
    id: '21',
    name: 'Git Diff Divide',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 1900,
    commitsReq: 14,
    description: 'Inspect line-by-line diff splits across an 11x11 partition map.',
    objectives: [
      'Run git diff to preview state changes',
      'Maneuver box past alternating diff barriers',
      'Commit change payload to (9,1)'
    ],
    hint: 'Use directional pull to slide the box around horizontal diff dividers.',
    gridSize: 11,
    width: 11,
    height: 11,
    player: { x: 1, y: 9 },
    box: { x: 2, y: 8 },
    goal: { x: 9, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 },
      { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 },
      { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 },
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 3, y: 8 }, { x: 5, y: 8 }
    ],
    hazards: [{ x: 6, y: 3 }, { x: 4, y: 7 }]
  },
  '22': {
    id: '22',
    name: 'Patch Matrix Nexus',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 2000,
    commitsReq: 15,
    description: 'Apply unified patch hunks across a matrix of interconnected chambers.',
    objectives: [
      'Inspect hunk status with git status',
      'Transport patch payload through matrix junction',
      'Commit clean patch to goal at (9,9)'
    ],
    hint: 'Pull the patch node southward before pushing it eastward.',
    gridSize: 11,
    width: 11,
    height: 11,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 3 },
    goal: { x: 9, y: 9 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 },
      { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 },
      { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 },
      { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }
    ],
    hazards: [{ x: 3, y: 5 }, { x: 7, y: 5 }]
  },
  '23': {
    id: '23',
    name: 'Merge Strategy Resolver',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2100,
    commitsReq: 15,
    description: 'Select between recursive, ours, and ort merge strategies to unlock specific pathways.',
    objectives: [
      'Evaluate strategy routes',
      'Maneuver payload into the ort strategy chamber at (9,5)',
      'Commit resolution'
    ],
    hint: 'Use git pull to prevent the box from jamming against the central pillar.',
    gridSize: 11,
    width: 11,
    height: 11,
    player: { x: 1, y: 5 },
    box: { x: 3, y: 5 },
    goal: { x: 9, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 },
      { x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }, { x: 3, y: 10 }, { x: 4, y: 10 }, { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 },
      { x: 10, y: 1 }, { x: 10, y: 2 }, { x: 10, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 10, y: 7 }, { x: 10, y: 8 }, { x: 10, y: 9 },
      { x: 4, y: 3 }, { x: 4, y: 7 }, { x: 6, y: 3 }, { x: 6, y: 7 }, { x: 5, y: 5 }
    ],
    hazards: [{ x: 5, y: 2 }, { x: 5, y: 8 }]
  },
  '24': {
    id: '24',
    name: 'Conflict Matrix Alpha',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2200,
    commitsReq: 16,
    description: 'A 12x12 multi-room labyrinth with dual checkpoint relays and moving CI hazard bots.',
    objectives: [
      'Secure Checkpoint Alpha at (6,2)',
      'Navigate the southern conflict gauntlet',
      'Deliver the final release candidate to (10,10)'
    ],
    hint: 'Move behind the box in room 1, pull it into the corridor, and push through to the goal.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 10, y: 10 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }, { x: 7, y: 10 }
    ],
    hazards: [{ x: 6, y: 5 }, { x: 5, y: 8 }]
  },
  '25': {
    id: '25',
    name: 'Conflict Matrix Beta',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2300,
    commitsReq: 16,
    description: 'Complex 12x12 terrain requiring coordinated git pull left and git pull up maneuvers.',
    objectives: [
      'Unlock gate barrier at (6,6)',
      'Pull commit payload out of the recessed firewall',
      'Stage to goal at (1,10)'
    ],
    hint: 'Draw the payload out into the central junction before making turns.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 10, y: 1 },
    box: { x: 9, y: 2 },
    goal: { x: 1, y: 10 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 8, y: 3 }, { x: 8, y: 4 }, { x: 8, y: 5 }, { x: 4, y: 7 }, { x: 4, y: 8 }, { x: 4, y: 9 }
    ],
    hazards: [{ x: 6, y: 6 }]
  },
  '26': {
    id: '26',
    name: 'Octopus Nexus Prime',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2400,
    commitsReq: 17,
    description: 'A sprawling 12x12 octagonal multi-room fortress with four distinct puzzle quadrants.',
    objectives: [
      'Clear quadrant 1 staging corridor',
      'Pass checkpoint at (6,6)',
      'Deliver final release build to (10,1)'
    ],
    hint: 'Pull the box north through the central corridor, then push east to the exit.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 1, y: 10 },
    box: { x: 3, y: 9 },
    goal: { x: 10, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 7, y: 7 }, { x: 7, y: 8 }, { x: 7, y: 9 }
    ],
    hazards: [{ x: 6, y: 4 }, { x: 6, y: 8 }]
  },
  '27': {
    id: '27',
    name: 'Merge Conflict Citadel',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2500,
    commitsReq: 18,
    description: 'The inner citadel of Merge Peaks. Solve interconnected lock-and-key mechanisms.',
    objectives: [
      'Collect the SSH access key at (10,2)',
      'Unlock the inner gate at (6,6)',
      'Commit payload to the citadel vault at (1,1)'
    ],
    hint: 'Acquire the access token first, then return to guide the payload through the gate.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 6, y: 10 },
    box: { x: 6, y: 8 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 5 }, { x: 8, y: 5 }
    ],
    hazards: [{ x: 4, y: 6 }]
  },
  '28': {
    id: '28',
    name: 'Git Revert Redoubt',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 2600,
    commitsReq: 18,
    description: 'Safely revert regression commits while maintaining forward pipeline momentum.',
    objectives: [
      'Revert faulty commit node',
      'Push corrected payload through the redoubt tunnel',
      'Commit payload to (10,6)'
    ],
    hint: 'Use git pull to back the box away from the dead end before pushing east.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 2, y: 6 },
    box: { x: 3, y: 6 },
    goal: { x: 10, y: 6 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }
    ],
    hazards: [{ x: 7, y: 6 }]
  },
  '29': {
    id: '29',
    name: 'Merge Summit Ridge',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 2700,
    commitsReq: 19,
    description: 'A perilous high-altitude ridge overlooking the Merge Peaks summit.',
    objectives: [
      'Avoid perimeter abyss hazards',
      'Maneuver payload along narrow ridge crest',
      'Commit payload to summit observatory at (10,10)'
    ],
    hint: 'Keep the payload centered on the ridge; avoid pushing against the void edges.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 10, y: 10 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 8, y: 9 }
    ],
    hazards: [{ x: 5, y: 5 }, { x: 7, y: 8 }]
  },
  '30': {
    id: '30',
    name: 'Merge Peaks Apex Trial',
    world: 3,
    worldName: 'Merge Peaks',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 3000,
    commitsReq: 20,
    description: 'The pinnacle of World 3: A massive 12x12 master puzzle unlocking World 4: Rebase Wasteland.',
    objectives: [
      'Synchronize all three branch nodes',
      'Resolve the master conflict nexus',
      'Commit the unified tree to the apex goal at (6,6) to unlock World 4'
    ],
    hint: 'Pull the box to each quadrant corner before delivering it to the center.',
    gridSize: 12,
    width: 12,
    height: 12,
    player: { x: 1, y: 6 },
    box: { x: 3, y: 6 },
    goal: { x: 6, y: 6 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 },
      { x: 0, y: 11 }, { x: 1, y: 11 }, { x: 2, y: 11 }, { x: 3, y: 11 }, { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 6, y: 11 }, { x: 7, y: 11 }, { x: 8, y: 11 }, { x: 9, y: 11 }, { x: 10, y: 11 }, { x: 11, y: 11 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 },
      { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 }, { x: 11, y: 8 }, { x: 11, y: 9 }, { x: 11, y: 10 },
      { x: 4, y: 4 }, { x: 8, y: 4 }, { x: 4, y: 8 }, { x: 8, y: 8 }
    ],
    hazards: [{ x: 5, y: 5 }, { x: 7, y: 5 }, { x: 5, y: 7 }, { x: 7, y: 7 }]
  }
};

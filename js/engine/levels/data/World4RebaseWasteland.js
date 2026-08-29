/**
 * GitQuest Engine - World 4: Rebase Wasteland
 * Levels 31 - 45: Expert mechanics introducing 14x14 to 18x18 expansive maps,
 * interactive rebase ordering, multi-stage delivery, stash containers, timed pressure doors, and secret corridors.
 */

export const WORLD_4_LEVELS = {
  '31': {
    id: '31',
    name: 'Wasteland Staging Grounds',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3200,
    commitsReq: 21,
    description: 'Welcome to Rebase Wasteland: An expansive 14x14 arena where history must be linearized.',
    objectives: [
      'Inspect commit history with git log',
      'Navigate the broken pipeline corridor',
      'Deliver payload to initial rebase station at (12,12)'
    ],
    hint: 'Pull the box to clear the entrance choke point, then loop through the north passage.',
    gridSize: 14,
    width: 14,
    height: 14,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 12, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 },
      { x: 0, y: 13 }, { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 0, y: 12 },
      { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
      { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 8, y: 6 }, { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 10, y: 10 }
    ],
    hazards: [{ x: 5, y: 4 }, { x: 9, y: 8 }]
  },
  '32': {
    id: '32',
    name: 'Interactive Rebase Track',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3400,
    commitsReq: 22,
    description: 'Reorder commit commits across three parallel tracks without creating detached HEADs.',
    objectives: [
      'Reorder feature commit',
      'Pass checkpoint at (7,7)',
      'Commit linearized history to (1,12)'
    ],
    hint: 'Use git pull left from the center track to align the payload before advancing south.',
    gridSize: 14,
    width: 14,
    height: 14,
    player: { x: 12, y: 1 },
    box: { x: 10, y: 2 },
    goal: { x: 1, y: 12 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 },
      { x: 0, y: 13 }, { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 0, y: 12 },
      { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
      { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 9, y: 8 }, { x: 9, y: 9 }, { x: 9, y: 10 }
    ],
    hazards: [{ x: 7, y: 4 }, { x: 6, y: 9 }]
  },
  '33': {
    id: '33',
    name: 'Squash & Fixup Refinery',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3600,
    commitsReq: 23,
    description: 'Compress redundant commits into clean atomic units inside the refinery.',
    objectives: [
      'Squash minor fixups',
      'Maneuver atomic payload through the compression chamber',
      'Deliver to release station at (12,1)'
    ],
    hint: 'Pull the box south to bypass the pressure wall, then push northeast.',
    gridSize: 14,
    width: 14,
    height: 14,
    player: { x: 2, y: 12 },
    box: { x: 4, y: 10 },
    goal: { x: 12, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 },
      { x: 0, y: 13 }, { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 0, y: 12 },
      { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
      { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }
    ],
    hazards: [{ x: 4, y: 6 }, { x: 10, y: 6 }]
  },
  '34': {
    id: '34',
    name: 'Onto Option Overpass',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3800,
    commitsReq: 24,
    description: 'Use git rebase --onto mechanics to transplant a branch topic onto a new upstream base.',
    objectives: [
      'Sever outdated parent link',
      'Transplant payload across overpass',
      'Commit rebase onto upstream at (7,7)'
    ],
    hint: 'Navigate the upper bridge to push the box onto the target island.',
    gridSize: 14,
    width: 14,
    height: 14,
    player: { x: 1, y: 7 },
    box: { x: 3, y: 7 },
    goal: { x: 7, y: 7 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 },
      { x: 0, y: 13 }, { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 9, y: 0 }, { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 0, y: 12 },
      { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
      { x: 5, y: 5 }, { x: 9, y: 5 }, { x: 5, y: 9 }, { x: 9, y: 9 }
    ],
    hazards: [{ x: 5, y: 7 }, { x: 9, y: 7 }]
  },
  '35': {
    id: '35',
    name: 'Wasteland Monolith Vault',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 4000,
    commitsReq: 25,
    description: 'A 14x14 ancient monolith vault featuring timed pressure gates and multi-stage locks.',
    objectives: [
      'Activate monolith pressure plate',
      'Pull payload through timed security door',
      'Commit payload to vault core at (12,7)'
    ],
    hint: 'Step on the switch to open the gate, then quickly pull the box inside before it closes.',
    gridSize: 14,
    width: 14,
    height: 14,
    player: { x: 7, y: 12 },
    box: { x: 7, y: 10 },
    goal: { x: 12, y: 7 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 }, { x: 13, y: 0 },
      { x: 0, y: 13 }, { x: 1, y: 13 }, { x: 2, y: 13 }, { x: 3, y: 13 }, { x: 4, y: 13 }, { x: 5, y: 13 }, { x: 6, y: 13 }, { x: 7, y: 13 }, { x: 8, y: 13 }, { x: 9, y: 13 }, { x: 10, y: 13 }, { x: 11, y: 13 }, { x: 12, y: 13 }, { x: 13, y: 13 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 }, { x: 0, y: 7 }, { x: 0, y: 8 }, { x: 0, y: 9 }, { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 0, y: 12 },
      { x: 13, y: 1 }, { x: 13, y: 2 }, { x: 13, y: 3 }, { x: 13, y: 4 }, { x: 13, y: 5 }, { x: 13, y: 6 }, { x: 13, y: 7 }, { x: 13, y: 8 }, { x: 13, y: 9 }, { x: 13, y: 10 }, { x: 13, y: 11 }, { x: 13, y: 12 },
      { x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }
    ],
    hazards: [{ x: 7, y: 4 }, { x: 7, y: 7 }]
  },
  '36': {
    id: '36',
    name: 'Interactive Rebase Nexus',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 4200,
    commitsReq: 26,
    description: 'An expansive 16x16 complex requiring 4-phase commit reordering and stash operations.',
    objectives: [
      'Rebase commits 1 through 3',
      'Pass checkpoint at (8,8)',
      'Commit to nexus core at (14,14)'
    ],
    hint: 'Use git pull to draw the payload out of each quadrant sequentially.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 3 },
    goal: { x: 14, y: 14 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 5, y: 5 }, { x: 10, y: 5 }, { x: 5, y: 10 }, { x: 10, y: 10 }
    ],
    hazards: [{ x: 8, y: 4 }, { x: 8, y: 12 }]
  },
  '37': {
    id: '37',
    name: 'Linear History Promenade',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 4400,
    commitsReq: 27,
    description: 'Transform a messy spiderweb history DAG into an immaculate single straight line.',
    objectives: [
      'Eliminate diamond merge bubbles',
      'Push payload along straight promenade track',
      'Commit linear branch to (14,1)'
    ],
    hint: 'Pull the box to align with the central groove before accelerating down the track.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 1, y: 14 },
    box: { x: 3, y: 13 },
    goal: { x: 14, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 6, y: 6 }, { x: 9, y: 6 }, { x: 6, y: 9 }, { x: 9, y: 9 }
    ],
    hazards: [{ x: 4, y: 8 }, { x: 11, y: 8 }]
  },
  '38': {
    id: '38',
    name: 'Detached HEAD Abyss',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 4600,
    commitsReq: 28,
    description: 'Avoid stepping into the detached HEAD void while executing complex branch checkouts.',
    objectives: [
      'Attach HEAD pointer to stable branch',
      'Guide payload across the narrow bridge',
      'Commit to safe harbor node at (8,2)'
    ],
    hint: 'Never push the box toward the open void edges without a solid backstop.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 8, y: 14 },
    box: { x: 8, y: 12 },
    goal: { x: 8, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 6, y: 4 }, { x: 10, y: 4 }, { x: 6, y: 10 }, { x: 10, y: 10 }
    ],
    hazards: [{ x: 7, y: 8 }, { x: 9, y: 8 }]
  },
  '39': {
    id: '39',
    name: 'Cherry-Pick Archipelago',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 4800,
    commitsReq: 29,
    description: 'Island-hop across four isolated commit atolls to gather release dependencies.',
    objectives: [
      'Extract commit island 1 payload',
      'Extract commit island 2 payload',
      'Stage unified build to central atoll at (8,8)'
    ],
    hint: 'Use the teleport portals between islands to position yourself behind payloads.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 2, y: 2 },
    box: { x: 4, y: 4 },
    goal: { x: 8, y: 8 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 4, y: 8 }, { x: 12, y: 8 }, { x: 8, y: 4 }, { x: 8, y: 12 }
    ],
    hazards: [{ x: 6, y: 6 }, { x: 10, y: 10 }]
  },
  '40': {
    id: '40',
    name: 'Wasteland Citadel Bastion',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 5000,
    commitsReq: 30,
    description: 'A fortified 16x16 stronghold guarding the passage to the Rebase core.',
    objectives: [
      'Reach Checkpoint Alpha at (4,8)',
      'Reach Checkpoint Beta at (12,8)',
      'Commit master release payload to citadel gate at (8,1)'
    ],
    hint: 'Pull the box to each checkpoint before attempting the final ascent.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 8, y: 14 },
    box: { x: 8, y: 11 },
    goal: { x: 8, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 3, y: 5 }, { x: 12, y: 5 }, { x: 3, y: 11 }, { x: 12, y: 11 }
    ],
    hazards: [{ x: 8, y: 6 }, { x: 8, y: 9 }]
  },
  '41': {
    id: '41',
    name: 'Interactive Rebase Arena II',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 5200,
    commitsReq: 30,
    description: 'The second arena: High-speed moving CI patrol drones guard the rebase channels.',
    objectives: [
      'Evade patrol drone paths',
      'Maneuver payload through active timing windows',
      'Commit payload to (14,8)'
    ],
    hint: 'Wait for the drone to cycle away before making cross-corridor pushes.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 2, y: 8 },
    box: { x: 4, y: 8 },
    goal: { x: 14, y: 8 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 11 }, { x: 7, y: 12 }
    ],
    hazards: [{ x: 7, y: 7 }, { x: 7, y: 8 }]
  },
  '42': {
    id: '42',
    name: 'Rebase Autostash Matrix',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 5400,
    commitsReq: 31,
    description: 'Utilize automatic git stash --autostash mechanisms across complex branching.',
    objectives: [
      'Trigger autostash on branch switch',
      'Pass security relay at (8,8)',
      'Commit restored tree to (1,1)'
    ],
    hint: 'Use git pull to back out of tight autostash pockets.',
    gridSize: 16,
    width: 16,
    height: 16,
    player: { x: 14, y: 14 },
    box: { x: 12, y: 12 },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 15, y: 0 }, { x: 0, y: 15 }, { x: 15, y: 15 },
      { x: 5, y: 7 }, { x: 10, y: 7 }, { x: 5, y: 9 }, { x: 10, y: 9 }
    ],
    hazards: [{ x: 8, y: 5 }, { x: 8, y: 11 }]
  },
  '43': {
    id: '43',
    name: 'Three-Way Rebase Convergence',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 5600,
    commitsReq: 32,
    description: 'Three parallel feature trees converge on an 18x18 colossal rebase matrix.',
    objectives: [
      'Synchronize feature trees A, B, and C',
      'Resolve triple conflict checkpoint',
      'Commit to apex node at (9,9)'
    ],
    hint: 'Clear the outer ring before routing the payload toward the central hub.',
    gridSize: 18,
    width: 18,
    height: 18,
    player: { x: 1, y: 9 },
    box: { x: 4, y: 9 },
    goal: { x: 9, y: 9 },
    walls: [
      { x: 0, y: 0 }, { x: 17, y: 0 }, { x: 0, y: 17 }, { x: 17, y: 17 },
      { x: 6, y: 6 }, { x: 12, y: 6 }, { x: 6, y: 12 }, { x: 12, y: 12 }
    ],
    hazards: [{ x: 9, y: 5 }, { x: 9, y: 13 }]
  },
  '44': {
    id: '44',
    name: 'Wasteland Catacombs',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 5800,
    commitsReq: 33,
    description: 'Deep subterranean catacombs containing encrypted SSH keys and locked gates.',
    objectives: [
      'Locate RSA key in the eastern wing',
      'Unlock subterranean blast door at (9,9)',
      'Commit payload to the catacomb altar at (16,16)'
    ],
    hint: 'Pick up the key first, then return to pull the payload through the blast door.',
    gridSize: 18,
    width: 18,
    height: 18,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 3 },
    goal: { x: 16, y: 16 },
    walls: [
      { x: 0, y: 0 }, { x: 17, y: 0 }, { x: 0, y: 17 }, { x: 17, y: 17 },
      { x: 5, y: 5 }, { x: 13, y: 5 }, { x: 5, y: 13 }, { x: 13, y: 13 }
    ],
    hazards: [{ x: 9, y: 7 }, { x: 9, y: 11 }]
  },
  '45': {
    id: '45',
    name: 'Rebase Wasteland Apex Gauntlet',
    world: 4,
    worldName: 'Rebase Wasteland',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 6000,
    commitsReq: 35,
    description: 'The monumental finale of World 4: An 18x18 multi-room gauntlet unlocking World 5: Kernel Core.',
    objectives: [
      'Complete all 3 rebase stages',
      'Bypass the dual force-push lasers',
      'Commit the master linear history to (16,1) to unlock Kernel Core'
    ],
    hint: 'Pull the payload through the central tunnel, loop around the laser emitter, then push north.',
    gridSize: 18,
    width: 18,
    height: 18,
    player: { x: 1, y: 16 },
    box: { x: 3, y: 15 },
    goal: { x: 16, y: 1 },
    walls: [
      { x: 0, y: 0 }, { x: 17, y: 0 }, { x: 0, y: 17 }, { x: 17, y: 17 },
      { x: 4, y: 4 }, { x: 14, y: 4 }, { x: 4, y: 14 }, { x: 14, y: 14 },
      { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 13 }, { x: 9, y: 14 }
    ],
    hazards: [{ x: 9, y: 8 }, { x: 9, y: 10 }]
  }
};

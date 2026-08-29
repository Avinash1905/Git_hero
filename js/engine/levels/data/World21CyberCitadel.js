/**
 * GitQuest Engine - World 21: Cyber Citadel
 * Levels 251 - 260: Advanced laser grids, optical beam splitters, and magnetic polar conduits.
 */

export const WORLD_21_LEVELS = {
  '251': {
    id: '251',
    name: 'Cyber Citadel: Laser Bastion',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 3500,
    commitsReq: 3,
    description: 'Bypass active laser emitters by aligning optical mirrors and pushing the repository core.',
    objectives: [
      'Deactivate perimeter laser barrier with mirror alignment',
      'Navigate magnetic payload to goal (6, 6)',
      'Commit security patch'
    ],
    hint: 'Use git pull to adjust the mirror box before crossing the emitter path.',
    gridSize: 8,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 6, y: 6 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 5 }, { x: 5, y: 5 }
    ],
    hazards: [{ x: 4, y: 3 }]
  },
  '252': {
    id: '252',
    name: 'Cyber Citadel: Magnetic Flux Gate',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'HARD',
    stars: 3,
    xpReward: 3600,
    commitsReq: 3,
    description: 'Invert magnetic field polarity to repel the heavy payload across the plasma chasm.',
    objectives: [
      'Toggle polarity switch at (2, 5)',
      'Propel polarized payload into reception node (5, 2)',
      'Commit payload'
    ],
    hint: 'Step on the magnetic terminal switch to swap attraction to repulsion.',
    gridSize: 8,
    player: { x: 1, y: 2 },
    box: { x: 3, y: 3 },
    goal: { x: 5, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 },
      { x: 2, y: 2 }, { x: 4, y: 4 }, { x: 4, y: 1 }
    ],
    hazards: [{ x: 3, y: 5 }]
  },
  '253': {
    id: '253',
    name: 'Cyber Citadel: Quantum Matrix Core',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3750,
    commitsReq: 4,
    description: 'Solve paired quantum crates that mirror movements in opposing quadrants.',
    objectives: [
      'Synchronize quantum entangled crate positions',
      'Anchor primary crate onto goal (5, 5)',
      'Commit matrix state'
    ],
    hint: 'Pulling the primary crate shifts the entangled replica inversely.',
    gridSize: 8,
    player: { x: 2, y: 1 },
    box: { x: 3, y: 2 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 7 }, { x: 7, y: 7 },
      { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 4, y: 7 }
    ],
    hazards: [{ x: 2, y: 4 }]
  },
  '254': {
    id: '254',
    name: 'Cyber Citadel: Hydraulic Airlock Sanctum',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 3900,
    commitsReq: 3,
    description: 'Pressurize the hydraulic conduit pipeline to open the titanium airlock.',
    objectives: [
      'Align fluid valve conduits',
      'Fill reservoir tank above 75% capacity',
      'Deliver core payload to goal (6, 2)'
    ],
    hint: 'Rotate the corner pipe junction before activating the pump turbine.',
    gridSize: 8,
    player: { x: 1, y: 5 },
    box: { x: 2, y: 4 },
    goal: { x: 6, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 7, y: 0 }, { x: 0, y: 7 }, { x: 7, y: 7 },
      { x: 5, y: 1 }, { x: 5, y: 3 }, { x: 5, y: 4 }
    ],
    hazards: []
  },
  '255': {
    id: '255',
    name: 'Cyber Citadel: Temporal Resonance Chamber',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'EXPERT',
    stars: 3,
    xpReward: 4100,
    commitsReq: 4,
    description: 'Navigate through a slow-motion chronosphere and harvest temporal crystals.',
    objectives: [
      'Harvest temporal rewind crystal at (3, 3)',
      'Safely extract payload past oscillation hazards',
      'Finalize commit at (6, 5)'
    ],
    hint: 'Use the chronosphere dilation to time your steps between spike cycles.',
    gridSize: 8,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 6, y: 5 },
    walls: [{ x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }],
    hazards: [{ x: 3, y: 4 }, { x: 5, y: 3 }]
  },
  '256': {
    id: '256',
    name: 'Cyber Citadel: Optical Prism Labyrinth',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 4300,
    commitsReq: 4,
    description: 'Redirect laser beams across a 3-way prism network to power the security mainframe.',
    objectives: [
      'Redirect cyan laser into prism receptor',
      'Clear payload corridor of beam hazards',
      'Commit solution to (5, 6)'
    ],
    hint: 'Push the prism block onto the receptor plate before touching the laser beam.',
    gridSize: 8,
    player: { x: 1, y: 2 },
    box: { x: 3, y: 4 },
    goal: { x: 5, y: 6 },
    walls: [{ x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }],
    hazards: [{ x: 4, y: 5 }]
  },
  '257': {
    id: '257',
    name: 'Cyber Citadel: Heavy Monolith Extraction',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 4500,
    commitsReq: 5,
    description: 'Utilize pulley leverage systems to drag a 3-ton Git repository monorepo.',
    objectives: [
      'Position player at pulley lever (2, 4)',
      'Execute multi-step pull sequence on heavy monorepo',
      'Commit monorepo archive at (6, 3)'
    ],
    hint: 'The heavy monorepo requires consecutive pull efforts to overcome friction.',
    gridSize: 8,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 6, y: 3 },
    walls: [{ x: 3, y: 1 }, { x: 3, y: 5 }, { x: 5, y: 1 }, { x: 5, y: 5 }],
    hazards: []
  },
  '258': {
    id: '258',
    name: 'Cyber Citadel: Multi-Floor Server Vault',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'MASTER',
    stars: 3,
    xpReward: 4700,
    commitsReq: 5,
    description: 'Drop repository payload through vertical gravity chutes to lower server level.',
    objectives: [
      'Push payload into Level 1 gravity chute',
      'Take stairwell down to Sub-Floor 2',
      'Recover payload and commit to goal (5, 4)'
    ],
    hint: 'Align the box over the chute icon before taking the stairwell.',
    gridSize: 8,
    player: { x: 2, y: 2 },
    box: { x: 3, y: 2 },
    goal: { x: 5, y: 4 },
    walls: [{ x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }],
    hazards: [{ x: 4, y: 2 }]
  },
  '259': {
    id: '259',
    name: 'Cyber Citadel: Sentinel AI Defense Grid',
    world: 21,
    worldName: 'Cyber Citadel',
    difficulty: 'GRANDMASTER',
    stars: 3,
    xpReward: 4900,
    commitsReq: 5,
    description: 'Evade sentinel drone raycasts and neutralize laser defense batteries.',
    objectives: [
      'Neutralize acid pool with chemical dispenser',
      'Evade sentinel patrol cone',
      'Deliver decrypted repository to goal (6, 1)'
    ],
    hint: 'Pick up the neutralizer vial before attempting to cross the toxic acid canal.',
    gridSize: 8,
    player: { x: 1, y: 6 },
    box: { x: 2, y: 5 },
    goal: { x: 6, y: 1 },
    walls: [{ x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 5, y: 3 }],
    hazards: [{ x: 4, y: 4 }, { x: 4, y: 5 }]
  },
  '260': {
    id: '260',
    name: 'Cyber Citadel: The Citadel Mainframe Core',
    world: 21,
    worldName: 'Cyber Citadel Pinnacle',
    difficulty: 'GODHEAD',
    stars: 3,
    xpReward: 6000,
    commitsReq: 6,
    description: 'The pinnacle of Cyber Citadel: Combine lasers, magnets, fluids, and Git tags to unlock the citadel.',
    objectives: [
      'Authenticate with git tag v21.0.0-citadel',
      'Power all 4 hydraulic circuit nodes',
      'Commit master repository to central mainframe (4, 4)'
    ],
    hint: 'Create the tag first to lower the inner perimeter gate.',
    gridSize: 9,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 3, y: 1 }, { x: 5, y: 1 },
      { x: 3, y: 7 }, { x: 5, y: 7 },
      { x: 1, y: 3 }, { x: 1, y: 5 },
      { x: 7, y: 3 }, { x: 7, y: 5 }
    ],
    hazards: [{ x: 3, y: 3 }, { x: 5, y: 3 }, { x: 3, y: 5 }, { x: 5, y: 5 }]
  }
};

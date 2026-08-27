/**
 * GitHero Authoritative 30+ Handcrafted Level Progression System
 * 6 Worlds, 30 distinct progressive levels with gates, switches, hazards, and Git learning objectives.
 */

export const WORLDS = [
  {
    id: 1,
    name: 'Foundations',
    subtitle: 'Core Git commands, staging & navigation',
    description: 'Learn the fundamental spatial mechanics of git add, git push, git commit, and cardinal navigation.',
    icon: 'folder_open',
    color: '#4edea3',
    unlockedByDefault: true
  },
  {
    id: 2,
    name: 'Push & Pull Valley',
    subtitle: 'Directional pulls & corridor navigation',
    description: 'Master git pull left/right/up/down to manipulate repository payload boxes in tight partitions.',
    icon: 'compare_arrows',
    color: '#adc6ff',
    unlockedByDefault: false
  },
  {
    id: 3,
    name: 'Commit Canyon & Branch Junctions',
    subtitle: 'Branch switching, gates & pressure plates',
    description: 'Navigate divergent branches with git switch, trigger firewall switches, and avoid merge deadlocks.',
    icon: 'alt_route',
    color: '#ffb95f',
    unlockedByDefault: false
  },
  {
    id: 4,
    name: 'Remote Repositories',
    subtitle: 'Upstream synchronization & checkpoints',
    description: 'Synchronize upstream origins, fast-forward feature trees, and clear multi-room network topologies.',
    icon: 'cloud_sync',
    color: '#0566d9',
    unlockedByDefault: false
  },
  {
    id: 5,
    name: 'Merge Conflict Substation',
    subtitle: 'Conflict resolution & laser partitions',
    description: 'Disentangle 3-way merge collisions, navigate hazard zones, and rebase onto clean trees.',
    icon: 'call_merge',
    color: '#ffb4ab',
    unlockedByDefault: false
  },
  {
    id: 6,
    name: 'Kernel Core & Distributed Web',
    subtitle: 'Master genesis protocol & final boss commits',
    description: 'The ultimate GitHero gauntlet: Synthesize the distributed genesis block across complex switch matrices.',
    icon: 'memory',
    color: '#6ffbbe',
    unlockedByDefault: false
  }
];

export const LEVELS = {
  // ==========================================
  // WORLD 1: FOUNDATIONS (Levels 01–05)
  // ==========================================
  '01': {
    id: '01',
    name: 'Init Repository',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'BEGINNER',
    stars: 3,
    xpReward: 300,
    commitsReq: 4,
    description: 'Initialize your first repository. Push the payload box onto the staging goal.',
    gitConcept: 'git init & git push',
    objectives: [
      'Inspect repository status with git status',
      'Push repository box onto the green goal (3, 3)',
      'Execute git commit to resolve level'
    ],
    hint: 'Move below the box using "git up" and push it forward into the target slot.',
    gridSize: 5,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 3, y: 3 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ]
  },
  '02': {
    id: '02',
    name: 'First Commit',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'BEGINNER',
    stars: 3,
    xpReward: 350,
    commitsReq: 6,
    description: 'Stage the staged file and create a clean git commit snapshot.',
    gitConcept: 'git add & git commit',
    objectives: [
      'Check working tree with git status',
      'Navigate to box and push into commit target (3, 1)',
      'Execute git commit to finalize'
    ],
    hint: 'Walk around the partition wall to push the box from the left.',
    gridSize: 5,
    player: { x: 1, y: 2 },
    box: { x: 2, y: 1 },
    goal: { x: 3, y: 1 },
    walls: [
      { x: 2, y: 2 }, { x: 2, y: 3 }
    ]
  },
  '03': {
    id: '03',
    name: 'Staging Area',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'BEGINNER',
    stars: 3,
    xpReward: 400,
    commitsReq: 8,
    description: 'Organize files in the index buffer before committing to the main trunk.',
    gitConcept: 'Index buffer staging',
    objectives: [
      'Inspect stage with git status',
      'Align payload to staging node (1, 4)',
      'Commit staged snapshot'
    ],
    hint: 'Push the box downward past the corridor barrier.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 1, y: 2 },
    goal: { x: 1, y: 4 },
    walls: [
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 0, y: 3 }
    ]
  },
  '04': {
    id: '04',
    name: 'Tracked vs Untracked',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'EASY',
    stars: 3,
    xpReward: 450,
    commitsReq: 8,
    description: 'Distinguish between tracked changes and untracked artifacts.',
    gitConcept: 'File tracking lifecycle',
    objectives: [
      'Check tracking status with git status',
      'Move box to goal at (4, 2)',
      'Commit clean snapshot'
    ],
    hint: 'Navigate the upper corridor to get behind the payload.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 3, y: 2 },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 2, y: 4 }
    ]
  },
  '05': {
    id: '05',
    name: 'Foundations Boss: Clean Working Tree',
    world: 1,
    worldName: 'Foundations',
    difficulty: 'MEDIUM',
    stars: 2,
    xpReward: 600,
    commitsReq: 10,
    description: 'Clear the Foundations terminal by aligning all index files into the repository root.',
    gitConcept: 'Working tree sanitation',
    objectives: [
      'Inspect working tree with git status',
      'Maneuver payload box into root slot (4, 4)',
      'Execute git commit to unlock World 2'
    ],
    hint: 'Push box right, step above, push down into the goal pocket.',
    gridSize: 6,
    player: { x: 1, y: 2 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 1, y: 4 }
    ]
  },

  // ==========================================
  // WORLD 2: PUSH & PULL VALLEY (Levels 06–10)
  // ==========================================
  '06': {
    id: '06',
    name: 'Remote Origin',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EASY',
    stars: 3,
    xpReward: 500,
    commitsReq: 8,
    description: 'Connect local workspace to remote origin and pull initial payloads.',
    gitConcept: 'git remote add origin',
    objectives: [
      'Inspect remote link with git status',
      'Pull payload using git pull into corridor',
      'Commit to remote branch'
    ],
    hint: 'Use "git pull down" or position yourself and pull the box backward.',
    gridSize: 6,
    player: { x: 2, y: 3 },
    box: { x: 2, y: 2 },
    goal: { x: 2, y: 5 },
    walls: [
      { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }
    ]
  },
  '07': {
    id: '07',
    name: 'Fast-Forward Corridor',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'MEDIUM',
    stars: 0,
    xpReward: 550,
    commitsReq: 10,
    description: 'Execute a fast-forward merge without creating unnecessary merge commits.',
    gitConcept: 'Fast-forward linear progression',
    objectives: [
      'Check fast-forward readiness with git status',
      'Move box onto upstream goal (4, 2)',
      'Commit fast-forward update'
    ],
    hint: 'Pull the box to clear the doorway, then circle around to push it home.',
    gridSize: 6,
    player: { x: 2, y: 2 },
    box: { x: 3, y: 2 },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 3 }
    ]
  },
  '08': {
    id: '08',
    name: 'Directional Pull Left',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'MEDIUM',
    stars: 0,
    xpReward: 600,
    commitsReq: 12,
    description: 'Use specialized directional pulls to extract trapped payload boxes.',
    gitConcept: 'git pull left syntax',
    objectives: [
      'Inspect corridor with git status',
      'Use "git pull left" to pull the box rightward',
      'Push box into upper goal (4, 1)'
    ],
    hint: 'Stand at (2, 2) facing left and execute "git pull left".',
    gridSize: 6,
    player: { x: 2, y: 2 },
    box: { x: 1, y: 2 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 3, y: 2 }
    ]
  },
  '09': {
    id: '09',
    name: 'Upstream Synchronization',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 700,
    commitsReq: 14,
    description: 'Reconcile divergent remote branches by coordinating push and pull sequences.',
    gitConcept: 'Upstream tracking',
    objectives: [
      'Verify upstream status with git status',
      'Pull payload out of alcove into main track',
      'Commit synchronized tree'
    ],
    hint: 'Alternate between "git pull" and "git push" to navigate the S-bend.',
    gridSize: 6,
    player: { x: 4, y: 1 },
    box: { x: 3, y: 1 },
    goal: { x: 1, y: 4 },
    walls: [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 4 }
    ]
  },
  '10': {
    id: '10',
    name: 'Valley Boss: The Pull Matrix',
    world: 2,
    worldName: 'Push & Pull Valley',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 900,
    commitsReq: 12,
    description: 'Extract the critical kernel payload from a multi-chamber labyrinth using precise directional pulls.',
    gitConcept: 'Comprehensive directional pull mastery',
    objectives: [
      'Inspect labyrinth with git status',
      'Pull and push box from (2, 2) to goal (4, 4)',
      'Commit clean resolution'
    ],
    hint: 'Pull box down, step around via the right corridor, and push down into the master node.',
    gridSize: 6,
    player: { x: 2, y: 3 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 },
      { x: 3, y: 1 }, { x: 3, y: 3 }
    ]
  },

  // ==========================================
  // WORLD 3: COMMIT CANYON & BRANCHES (Levels 11–15)
  // ==========================================
  '11': {
    id: '11',
    name: 'Branch Switch Substation',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'MEDIUM',
    stars: 0,
    xpReward: 750,
    commitsReq: 10,
    description: 'Switch between feature branches and activate the firewall gate switch.',
    gitConcept: 'git switch -c feature/branch',
    objectives: [
      'Check branch status with git status',
      'Navigate to switch at (1, 3) to unlock firewall gate',
      'Push payload through gate to goal (4, 1)'
    ],
    hint: 'Step on the switch at (1, 3) to open gate at (3, 2), then push the box through.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 3, y: 4 }
    ],
    gates: [
      { id: 'gate_11', x: 3, y: 2, isOpen: false, linkedSwitchId: 'switch_11', label: 'FIREWALL' }
    ],
    switches: [
      { id: 'switch_11', x: 1, y: 3, isActive: false, linkedGateId: 'gate_11', type: 'pressure' }
    ]
  },
  '12': {
    id: '12',
    name: 'Merge Conflict Substation',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 850,
    commitsReq: 12,
    description: 'Resolve conflicting branch pointers before the main canyon trunk collapses.',
    gitConcept: 'Three-way merge resolution',
    objectives: [
      'Inspect merge conflict with git status',
      'Trigger pressure plate to lower partition wall',
      'Commit resolved conflict to main'
    ],
    hint: 'Push box onto the pressure plate at (2, 4) to open gate at (4, 3).',
    gridSize: 6,
    player: { x: 1, y: 2 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 2 }
    ],
    gates: [
      { id: 'gate_12', x: 4, y: 3, isOpen: false, linkedSwitchId: 'switch_12', label: 'GATE_12' }
    ],
    switches: [
      { id: 'switch_12', x: 2, y: 4, isActive: false, linkedGateId: 'gate_12', type: 'pressure' }
    ]
  },
  '13': {
    id: '13',
    name: 'Detached HEAD State',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 900,
    commitsReq: 14,
    description: 'Re-attach a detached HEAD commit pointer back onto a named branch.',
    gitConcept: 'git checkout --detach & recovery',
    objectives: [
      'Identify detached HEAD with git status',
      'Navigate through switch corridors to align box with goal (3, 4)',
      'Commit attached branch'
    ],
    hint: 'Avoid stepping into deadlock pockets on the left.',
    gridSize: 6,
    player: { x: 4, y: 1 },
    box: { x: 3, y: 2 },
    goal: { x: 3, y: 4 },
    walls: [
      { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 4, y: 2 }, { x: 4, y: 3 }
    ]
  },
  '14': {
    id: '14',
    name: 'Git Stash Partition',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 950,
    commitsReq: 15,
    description: 'Stash uncommitted changes to navigate through narrow firewall corridors.',
    gitConcept: 'git stash pop & apply',
    objectives: [
      'Check dirty working tree with git status',
      'Move box to temporary stash slot, then push to goal (4, 1)',
      'Commit clean workspace'
    ],
    hint: 'Push box up, step right, pull box into corridor.',
    gridSize: 6,
    player: { x: 2, y: 3 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }
    ]
  },
  '15': {
    id: '15',
    name: 'Canyon Boss: The Branch Nexus',
    world: 3,
    worldName: 'Commit Canyon',
    difficulty: 'BOSS',
    stars: 0,
    xpReward: 1200,
    commitsReq: 16,
    description: 'Navigate the grand canyon nexus with multiple gates, pressure switches, and divergent branches.',
    gitConcept: 'Multi-branch orchestration',
    objectives: [
      'Inspect canyon nexus with git status',
      'Trigger dual pressure switches to open master firewall',
      'Commit master release'
    ],
    hint: 'Activate switch at (1, 4), then move payload through gate at (3, 3) to goal (5, 5).',
    gridSize: 7,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 1, y: 3 }
    ],
    gates: [
      { id: 'gate_15', x: 3, y: 3, isOpen: false, linkedSwitchId: 'switch_15', label: 'NEXUS_GATE' }
    ],
    switches: [
      { id: 'switch_15', x: 1, y: 4, isActive: false, linkedGateId: 'gate_15', type: 'pressure' }
    ]
  },

  // ==========================================
  // WORLD 4: REMOTE REPOSITORIES (Levels 16–20)
  // ==========================================
  '16': {
    id: '16',
    name: 'Upstream Fetch',
    world: 4,
    worldName: 'Remote Repositories',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 1000,
    commitsReq: 14,
    description: 'Fetch remote objects without merging to inspect incoming changes safely.',
    gitConcept: 'git fetch vs git pull',
    objectives: [
      'Inspect remote refs with git status',
      'Pull incoming payload box to inspection chamber (2, 4)',
      'Commit fetched snapshot'
    ],
    hint: 'Use "git pull down" to safely extract the payload from the remote buffer.',
    gridSize: 6,
    player: { x: 2, y: 2 },
    box: { x: 2, y: 1 },
    goal: { x: 2, y: 4 },
    walls: [
      { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }
    ]
  },
  '17': {
    id: '17',
    name: 'Git Rebase Linearization',
    world: 4,
    worldName: 'Remote Repositories',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 1100,
    commitsReq: 15,
    description: 'Replay commits onto a new base to maintain a clean linear commit graph.',
    gitConcept: 'git rebase main',
    objectives: [
      'Inspect base commit with git status',
      'Align payload to rebase target (4, 1)',
      'Commit linear tree'
    ],
    hint: 'Navigate around the central partition to push payload linearly.',
    gridSize: 6,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 3, y: 4 }
    ]
  },
  '18': {
    id: '18',
    name: 'Interactive Rebase Squash',
    world: 4,
    worldName: 'Remote Repositories',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 1200,
    commitsReq: 16,
    description: 'Squash redundant experimental commits into a single polished production commit.',
    gitConcept: 'git rebase -i & squash',
    objectives: [
      'Review commit stack with git status',
      'Push squashed payload into production node (5, 2)',
      'Commit clean production release'
    ],
    hint: 'Pull box out of the dead-end before attempting the right corridor.',
    gridSize: 6,
    player: { x: 3, y: 4 },
    box: { x: 3, y: 3 },
    goal: { x: 5, y: 2 },
    walls: [
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 2, y: 4 }
    ]
  },
  '19': {
    id: '19',
    name: 'Git Cherry-Pick Corridor',
    world: 4,
    worldName: 'Remote Repositories',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 1300,
    commitsReq: 18,
    description: 'Selectively apply specific commit hashes without pulling entire branches.',
    gitConcept: 'git cherry-pick <hash>',
    objectives: [
      'Identify target hash with git status',
      'Navigate switch maze to transfer payload to goal (1, 5)',
      'Commit cherry-picked patch'
    ],
    hint: 'Step on switch at (4, 1) to lower gate at (2, 3).',
    gridSize: 7,
    player: { x: 4, y: 2 },
    box: { x: 3, y: 2 },
    goal: { x: 1, y: 5 },
    walls: [
      { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 4 }, { x: 2, y: 5 }
    ],
    gates: [
      { id: 'gate_19', x: 2, y: 3, isOpen: false, linkedSwitchId: 'switch_19', label: 'CHERRY_GATE' }
    ],
    switches: [
      { id: 'switch_19', x: 4, y: 1, isActive: false, linkedGateId: 'gate_19', type: 'toggle' }
    ]
  },
  '20': {
    id: '20',
    name: 'Remote Boss: The Distributed Hub',
    world: 4,
    worldName: 'Remote Repositories',
    difficulty: 'BOSS',
    stars: 0,
    xpReward: 1500,
    commitsReq: 20,
    description: 'Orchestrate synchronized pulls and pushes across a 3-chamber network grid.',
    gitConcept: 'Distributed upstream mesh',
    objectives: [
      'Check distributed hub with git status',
      'Trigger central gate and align origin payload to (5, 1)',
      'Execute synchronized master push'
    ],
    hint: 'Pull box into the center hub, toggle switch, then push to upper right.',
    gridSize: 7,
    player: { x: 3, y: 4 },
    box: { x: 3, y: 3 },
    goal: { x: 5, y: 1 },
    walls: [
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }
    ],
    gates: [
      { id: 'gate_20', x: 3, y: 2, isOpen: false, linkedSwitchId: 'switch_20', label: 'HUB_GATE' }
    ],
    switches: [
      { id: 'switch_20', x: 1, y: 3, isActive: false, linkedGateId: 'gate_20', type: 'pressure' }
    ]
  },

  // ==========================================
  // WORLD 5: MERGE CONFLICT SUBSTATION (Levels 21–25)
  // ==========================================
  '21': {
    id: '21',
    name: 'Laser Firewall Corridor',
    world: 5,
    worldName: 'Merge Conflict Substation',
    difficulty: 'HARD',
    stars: 0,
    xpReward: 1200,
    commitsReq: 16,
    description: 'Navigate past deadly firewall laser hazards while maintaining payload integrity.',
    gitConcept: 'Conflict hazard isolation',
    objectives: [
      'Inspect laser grid with git status',
      'Guide payload around hazard at (2, 2) to goal (4, 3)',
      'Commit resolved conflict'
    ],
    hint: 'Never push the box into hazard tiles; maneuver via the outer lane.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 1, y: 2 },
    goal: { x: 4, y: 3 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 3 }
    ],
    hazards: [
      { x: 2, y: 2, type: 'laser', damage: 1 },
      { x: 2, y: 3, type: 'laser', damage: 1 }
    ]
  },
  '22': {
    id: '22',
    name: 'Git Bisect Binary Search',
    world: 5,
    worldName: 'Merge Conflict Substation',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 1350,
    commitsReq: 18,
    description: 'Isolate the faulty regression commit using binary search partition navigation.',
    gitConcept: 'git bisect start / bad / good',
    objectives: [
      'Start binary search with git status',
      'Navigate mid-point switch to unlock bad commit partition',
      'Commit bug fix'
    ],
    hint: 'Push box to the midpoint (3, 3) to test the revision.',
    gridSize: 7,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 3, y: 5 }
    ],
    gates: [
      { id: 'gate_22', x: 3, y: 3, isOpen: false, linkedSwitchId: 'switch_22', label: 'BISECT_GATE' }
    ],
    switches: [
      { id: 'switch_22', x: 1, y: 4, isActive: false, linkedGateId: 'gate_22', type: 'pressure' }
    ]
  },
  '23': {
    id: '23',
    name: 'Three-Way Merge Matrix',
    world: 5,
    worldName: 'Merge Conflict Substation',
    difficulty: 'EXPERT',
    stars: 0,
    xpReward: 1400,
    commitsReq: 18,
    description: 'Reconcile common ancestor, our changes, and their changes in a 3-chamber arena.',
    gitConcept: 'OURS vs THEIRS merge resolution',
    objectives: [
      'Examine merge conflict markers with git status',
      'Align payload to final merged trunk node (4, 1)',
      'Commit clean 3-way merge'
    ],
    hint: 'Pull box out of THEIRS chamber into the common corridor.',
    gridSize: 6,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 1, y: 2 }
    ]
  },
  '24': {
    id: '24',
    name: 'Git Reflog Emergency Recovery',
    world: 5,
    worldName: 'Merge Conflict Substation',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 1600,
    commitsReq: 20,
    description: 'Recover accidentally dropped commits from the internal reference log.',
    gitConcept: 'git reflog recovery',
    objectives: [
      'Inspect reflog history with git status',
      'Extract dropped payload from hazard sector to goal (5, 1)',
      'Commit recovered tree'
    ],
    hint: 'Use precision pulls to steer payload around the deadlock zones.',
    gridSize: 7,
    player: { x: 2, y: 4 },
    box: { x: 2, y: 3 },
    goal: { x: 5, y: 1 },
    walls: [
      { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 1, y: 4 }, { x: 3, y: 4 }
    ],
    hazards: [
      { x: 4, y: 3, type: 'deadlock', damage: 1 }
    ]
  },
  '25': {
    id: '25',
    name: 'Substation Boss: Merge Conflict Sentinel',
    world: 5,
    worldName: 'Merge Conflict Substation',
    difficulty: 'BOSS',
    stars: 0,
    xpReward: 1800,
    commitsReq: 22,
    description: 'Defeat the Merge Conflict Sentinel by solving a synchronized dual-switch puzzle arena.',
    gitConcept: 'Automated conflict resolution bot',
    objectives: [
      'Engage Sentinel with git status',
      'Trigger dual pressure plates to lower master security gates',
      'Commit master release to unlock Kernel Core'
    ],
    hint: 'Move box onto pressure switch at (1, 5) then proceed through opened gate.',
    gridSize: 7,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }
    ],
    gates: [
      { id: 'gate_25', x: 3, y: 3, isOpen: false, linkedSwitchId: 'switch_25', label: 'SENTINEL_GATE' }
    ],
    switches: [
      { id: 'switch_25', x: 1, y: 5, isActive: false, linkedGateId: 'gate_25', type: 'pressure' }
    ]
  },

  // ==========================================
  // WORLD 6: KERNEL CORE & DISTRIBUTED WEB (Levels 26–30)
  // ==========================================
  '26': {
    id: '26',
    name: 'Kernel Assembly Chamber',
    world: 6,
    worldName: 'Kernel Core',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 1700,
    commitsReq: 20,
    description: 'Assemble the low-level operating system kernel tree from distributed object stores.',
    gitConcept: 'Git plumbing: hash-object & cat-file',
    objectives: [
      'Inspect kernel tree with git status',
      'Guide genesis payload through assembly corridor to (4, 4)',
      'Commit compiled kernel'
    ],
    hint: 'Watch out for narrow dead-ends; always maintain space behind the box for pulls.',
    gridSize: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 1 },
    goal: { x: 4, y: 4 },
    walls: [
      { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3 }
    ]
  },
  '27': {
    id: '27',
    name: 'Distributed Hash Ring',
    world: 6,
    worldName: 'Kernel Core',
    difficulty: 'MASTER',
    stars: 0,
    xpReward: 1800,
    commitsReq: 22,
    description: 'Route cryptographic payload hashes across a distributed DHT partition ring.',
    gitConcept: 'SHA-256 Object Identification',
    objectives: [
      'Verify cryptographic hash with git status',
      'Move box around the central core ring to goal (5, 2)',
      'Commit verified hash tree'
    ],
    hint: 'Circle the core in a clockwise direction to push the payload efficiently.',
    gridSize: 7,
    player: { x: 1, y: 3 },
    box: { x: 2, y: 3 },
    goal: { x: 5, y: 2 },
    walls: [
      { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }
    ]
  },
  '28': {
    id: '28',
    name: 'Submodule Synchronization',
    world: 6,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 0,
    xpReward: 1900,
    commitsReq: 24,
    description: 'Coordinate recursive git submodules across nested partition repositories.',
    gitConcept: 'git submodule update --init --recursive',
    objectives: [
      'Inspect submodules with git status',
      'Trigger nested gate switches to unlock inner kernel core',
      'Commit recursive tree'
    ],
    hint: 'Trigger outer switch at (1, 4) to open inner gate at (3, 3).',
    gridSize: 7,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 2, y: 5 },
      { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 5 }
    ],
    gates: [
      { id: 'gate_28', x: 2, y: 2, isOpen: false, linkedSwitchId: 'switch_28', label: 'SUBMODULE_GATE' }
    ],
    switches: [
      { id: 'switch_28', x: 1, y: 4, isActive: false, linkedGateId: 'gate_28', type: 'pressure' }
    ]
  },
  '29': {
    id: '29',
    name: 'Git Worktree Partitioning',
    world: 6,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 0,
    xpReward: 2000,
    commitsReq: 24,
    description: 'Manage multiple concurrent working trees attached to the same repository.',
    gitConcept: 'git worktree add / prune',
    objectives: [
      'Inspect active worktrees with git status',
      'Navigate multi-room corridor to align worktree payload at (5, 1)',
      'Commit synchronized worktree'
    ],
    hint: 'Use "git pull right" to maneuver through the central crossway.',
    gridSize: 7,
    player: { x: 3, y: 5 },
    box: { x: 3, y: 4 },
    goal: { x: 5, y: 1 },
    walls: [
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }
    ]
  },
  '30': {
    id: '30',
    name: 'Grandmaster Finale: Genesis Block Synthesis',
    world: 6,
    worldName: 'Kernel Core',
    difficulty: 'GRANDMASTER',
    stars: 0,
    xpReward: 3000,
    commitsReq: 25,
    description: 'The ultimate GitHero test: Forge the genesis block of the distributed web and achieve Git Grandmaster.',
    gitConcept: 'Genesis Block & Master Protocol',
    objectives: [
      'Authenticate with Kernel Core via git status',
      'Avoid deadlock hazard at (3, 2)',
      'Align genesis payload to master node at (5, 5)',
      'Execute final commit and achieve Git Grandmaster'
    ],
    hint: 'Navigate the upper corridor to push the genesis payload down past the partition.',
    gridSize: 7,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 3 },
    goal: { x: 5, y: 5 },
    walls: [
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 },
      { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }
    ],
    hazards: [
      { x: 3, y: 2, type: 'deadlock', damage: 1 }
    ],
    gates: [
      { id: 'gate_30', x: 4, y: 4, isOpen: false, linkedSwitchId: 'switch_30', label: 'GENESIS_GATE' }
    ],
    switches: [
      { id: 'switch_30', x: 1, y: 4, isActive: false, linkedGateId: 'gate_30', type: 'pressure' }
    ]
  }
};
